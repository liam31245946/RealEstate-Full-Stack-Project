import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import {
  ClientError,
  errorMiddleware,
  authMiddleware,
  uploadsMiddleware,
} from './lib/index.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

type User = {
  userId: number;
  username: string;
  hashedPassword: string;
  role: 'agent' | 'buyer';
  createdAt: Date;
};

type Auth = {
  username: string;
  password: string;
};

export type properties = {
  propertyId: number;
  description: string;
  price: number;
  size: number;
  bedrooms: number;
  bathrooms: number;
  features: string;
  numberAndStreet: string;
  city: string;
  state: string;
  zipCode: string;
  agentId: number;
  imageUrl: string;
  status: string;
  createdAt: Date;
  approvedBy: number;
  approvedDate: Date;
};
const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const apiKey = process.env.GOOGLE_MAPS_API_KEY;
if (!hashKey) throw new Error('Google Map Api Key not found in .env');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(express.json());

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));

// sign in and sing out section Start
app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
      throw new ClientError(
        400,
        'username, password and role are required fields'
      );
    }
    const hashedPassword = await argon2.hash(password);
    const sql = `
      insert into "users" ("userName", "hashedPassword", "role")
      values ($1, $2, $3)
      returning "userId", "userName", "role", "createdAt"
    `;
    const params = [username, hashedPassword, role];
    const result = await db.query<User>(sql, params);
    const [user] = result.rows;
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Auth>;
    if (!username || !password) {
      throw new ClientError(401, 'invalid login');
    }
    const sql = `
    select *
      from "users"
     where "userName" = $1
  `;
    const params = [username];
    const result = await db.query<User>(sql, params);
    const [user] = result.rows;
    if (!user) {
      throw new ClientError(401, 'invalid login');
    }
    const { userId, hashedPassword, role } = user;
    if (!(await argon2.verify(hashedPassword, password))) {
      throw new ClientError(401, 'invalid login');
    }
    const payload = { userId, username, role };
    const token = jwt.sign(payload, hashKey);
    res.json({ token, user: payload });
  } catch (err) {
    next(err);
  }
});
// sign in and sing out section End

/* Agent user backend  Start */
// add new properties , Upload Here
app.post(
  '/api/properties',
  authMiddleware,
  uploadsMiddleware.single('image'),
  async (req, res, next) => {
    try {
      const {
        description,
        price,
        size,
        bedrooms,
        bathrooms,
        features,
        numberAndStreet,
        city,
        state,
        zipCode,
        status,
      } = req.body;
      const { userId, role } = req.user ?? {};

      req.body.agentId = userId;

      if (!description) {
        throw new ClientError(400, 'Description is missing');
      }
      if (!price) {
        throw new ClientError(400, 'Price is missing');
      }
      if (!size) {
        throw new ClientError(400, 'Size is missing');
      }
      if (!bedrooms) {
        throw new ClientError(400, 'Bedrooms is missing');
      }
      if (!bathrooms) {
        throw new ClientError(400, 'Bathrooms is missing');
      }
      if (!numberAndStreet) {
        throw new ClientError(400, 'numberAndStreet is missing');
      }
      if (!city) {
        throw new ClientError(400, 'City is missing');
      }
      if (!state) {
        throw new ClientError(400, 'State is missing');
      }
      if (!zipCode) {
        throw new ClientError(400, 'zipCode is missing');
      }
      if (!status) {
        throw new ClientError(400, 'Status is missing');
      }
      if (!features) {
        throw new ClientError(400, 'Features is missing');
      }
      if (role !== 'agent') {
        throw new ClientError(403, 'Must be an Agent');
      }
      const imageUrl = `/images/${req.file?.filename}`;

      const sql = `
    insert into "properties"
      ( "description", "price", "size", "bedrooms", "bathrooms", "features", "numberAndStreet", "city", "state", "zipCode", "agentId", "status", "imageUrl")
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      returning *`;
      const params = [
        description,
        price,
        size,
        bedrooms,
        bathrooms,
        features,
        numberAndStreet,
        city,
        state,
        zipCode,
        userId,
        status,
        imageUrl,
      ];
      const result = await db.query(sql, params);
      const createdEntry = result.rows[0];
      res.status(201).json(createdEntry);
    } catch (err) {
      next(err);
    }
  }
);

// property delete
app.delete(
  '/api/properties/:propertyId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { userId, role } = req.user ?? {};
      const { propertyId } = req.params;

      if (role !== 'agent') {
        return res
          .status(403)
          .json({ error: 'Only agents can delete properties' });
      }

      // Ensure agent only deletes their own properties
      const checkOwnershipSQL = `SELECT * FROM properties WHERE "propertyId" = $1 AND "agentId" = $2`;
      const ownershipResult = await db.query(checkOwnershipSQL, [
        propertyId,
        userId,
      ]);

      if (ownershipResult.rows.length === 0) {
        return res
          .status(403)
          .json({ error: 'You can only delete your own properties' });
      }

      const sql = `DELETE FROM properties WHERE "propertyId" = $1 RETURNING *`;
      const result = await db.query(sql, [propertyId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Property not found' });
      }

      res.json({ message: 'Property deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
);

// Agent can update properties
app.put(
  '/api/properties/:propertyId',
  authMiddleware,
  uploadsMiddleware.single('image'),
  async (req, res, next) => {
    try {
      const { propertyId } = req.params;
      if (!Number.isInteger(+propertyId)) {
        throw new ClientError(400, 'propertyId needs to be a number');
      }
      const {
        description,
        price,
        status,
        size,
        bedrooms,
        bathrooms,
        features,
        city,
        state,
        zipCode,
        numberAndStreet,
      } = req.body;

      const update = [];
      const values = [];
      values.push(propertyId);
      values.push(req.user?.userId);
      let i = 3;

      if (description) {
        update.push(`"description" =$${i++}`);
        values.push(description);
      }
      if (price) {
        update.push(`"price" =$${i++}`);
        values.push(price);
      }
      if (status) {
        update.push(`"status" =$${i++}`);
        values.push(status);
      }
      if (size) {
        update.push(`"size" =$${i++}`);
        values.push(size);
      }
      if (bedrooms) {
        update.push(`"bedrooms" =$${i++}`);
        values.push(bedrooms);
      }
      if (bathrooms) {
        update.push(`"bathrooms" =$${i++}`);
        values.push(bathrooms);
      }
      if (features) {
        update.push(`"features" =$${i++}`);
        values.push(features);
      }
      if (city) {
        update.push(`"city" =$${i++}`);
        values.push(city);
      }
      if (state) {
        update.push(`"state" =$${i++}`);
        values.push(state);
      }
      if (zipCode) {
        update.push(`"zipCode" =$${i++}`);
        values.push(zipCode);
      }
      if (numberAndStreet) {
        update.push(`"numberAndStreet" =$${i++}`);
        values.push(numberAndStreet);
      }
      // this is where update image happens
      if (req.file?.filename) {
        const imageUrl = `/images/${req.file?.filename}`;
        update.push(`"imageUrl" =$${i++}`);
        values.push(imageUrl);
      }

      if (update.length === 0) {
        throw new ClientError(400, 'Please provide what you want to update');
      }

      const sql = `
    update "properties"
    set ${update}
    where "propertyId"=$1 and "agentId"=$2
    returning *
    `;
      console.log(update, values, sql);

      const result = await db.query(sql, values);
      const updatedProperty = result.rows[0];
      if (!updatedProperty) {
        throw new ClientError(404, 'Entry not found');
      }
      res.status(200).json(updatedProperty);
    } catch (err) {
      next(err);
    }
  }
);

//  Implement Filter

app.get('/api/properties', async (req, res, next) => {
  try {
    const { minPrice, maxPrice, bedrooms, bathrooms, city, status } = req.query;
    let sql = `
      select * from "properties" where 1=1
    `;

    const params = [];

    if (status) {
      sql += ` and "status" = $${params.length + 1}`;
      params.push(status);
    }
    if (minPrice) {
      sql += ` and "price" >= $${params.length + 1}`;
      params.push(Number(minPrice));
    }
    if (maxPrice) {
      sql += ` and "price" <= $${params.length + 1}`;
      params.push(Number(maxPrice));
    }
    if (bedrooms) {
      sql += ` and "bedrooms" >= $${params.length + 1}`;
      params.push(Number(bedrooms));
    }
    if (bathrooms) {
      sql += ` and "bathrooms" >= $${params.length + 1}`;
      params.push(Number(bathrooms));
    }
    if (city) {
      sql += ` AND "city" >= $${params.length + 1}`;
      params.push(`%${city}%`);
    }

    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Get all property the agent entered

app.get('/api/properties/', authMiddleware, async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const sql = `SELECT * FROM "properties" WHERE "propertyId" = $1`;
    const params = [propertyId];
    const result = await db.query(sql, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Get back the id for each property

app.get(
  '/api/properties/:propertyId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { propertyId } = req.params;

      const sql = `
      select *
      from "property"
      where "propertyId" = $1
      `;
      const params = [propertyId];
      const result = await db.query(sql, params);
      const propID = result.rows[0];
      if (!propID) {
        return res.status(404).json({ error: 'propID not found' });
      }
      res.status(200).json(propID);
    } catch (err) {
      next(err);
    }
  }
);
/* Agent user backend logic End */

/* User View */
// User can view everything
app.get('/api/properties-allUser', async (req, res, next) => {
  try {
    const sql = `SELECT * FROM "properties"`;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// User can view specific property card
app.get('/api/properties-allUser/:propertyId', async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const sql = `
      select *
      from "properties"
      where "propertyId" = $1
      `;
    const params = [propertyId];
    const result = await db.query(sql, params);
    const propID = result.rows[0];
    if (!propID) {
      return res.status(404).json({ error: 'propID not found' });
    }
    res.status(200).json(propID);
  } catch (err) {
    next(err);
  }
});
/* Favorites back-end logic Start. Use to add, remove, view  favorite property */

// Add favorites
app.post('/api/favorites/', authMiddleware, async (req, res, next) => {
  try {
    const { propertyId } = req.body;
    const { userId } = req.user ?? {};
    if (!userId) {
      throw new ClientError(404, 'userId not found');
    }

    const sql = `
     insert into "favorites" ("userId", "propertyId")
      values ($1, $2)
      returning *;
     `;
    const params = [userId, propertyId];
    const result = await db.query(sql, params);
    const addFav = result.rows[0];
    res.status(201).json({ addFav });
  } catch (err) {
    next(err);
  }
});

// delete favorites
app.delete(
  '/api/favorites/:propertyId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const favoriteId = req.params;
      const sql = `
    delete from "favorites"
      where "userId" = $1 AND "propertyId" = $2
      returning *;
    `;
      const params = [favoriteId];
      const result = await db.query(sql, params);
      const deleteFav = result.rows[0];
      if (!deleteFav) {
        throw new ClientError(404, 'Favorites not found');
      }
      res.status(204).json(deleteFav);
    } catch (err) {
      next(err);
    }
  }
);

// get all favorites back to user

app.get('/api/favorites', authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user ?? {};
    const sql = `
      SELECT *
      FROM "favorites"
      JOIN "properties" ON "favorites"."propertyId" = "properties"."propertyId"
      WHERE "favorites"."userId" = $1
    `;
    const params = [userId];
    const result = await db.query(sql, params);
    const favorites = result.rows;

    if (!favorites || favorites.length === 0) {
      throw new ClientError(404, 'Favorites not found');
    }

    res.status(200).json({ favorites });
  } catch (err) {
    next(err);
  }
});

/* Favorites back-end  End */

/* Messages back-end Start */
// Send message
app.post('/api/messages', authMiddleware, async (req, res, next) => {
  try {
    const { senderId, propertyId, message } = req.body;
    const { userId } = req.user ?? {};

    if (!senderId) {
      throw new ClientError(404, 'senderId is missing ');
    }

    if (!propertyId) {
      throw new ClientError(404, 'propertyId is missing');
    }
    if (!message) {
      throw new ClientError(404, 'message is missing');
    }
    const sql = `
    insert into "message"("senderId", "receiverId", "propertyId", "message")
    values ( $1, $2, $3, $4)
    returning *
    `;
    const params = [senderId, propertyId, message, userId];
    const result = await db.query(sql, params);
    const sendMessage = result.rows[0];
    res.status(200).json({ sendMessage });
  } catch (err) {
    next(err);
  }
});

// receive message from registered user
app.get('/api/messages', authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user ?? {};
    const sql = `
    select *
    from "messages"
     join "users" on "messages"."senderId" = "users"."userID"
    join "properties" on "messages"."propertyId" = "properties"."propertyId"
    where "messages"."receiverId" = $1
    order by "createdAt" desc
    `;
    const params = [userId];
    const result = await db.query(sql, params);
    const receiveMessage = result.rows;
    res.status(200).json({ receiveMessage });
  } catch (err) {
    next(err);
  }
});

// receive specific message between two users
app.get('/api/messages/:receiverId', authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user ?? {};
    const { receiverId } = req.params;
    const sql = `
    select *
    from "messages"
    join "properties" on "messages"."propertyId" = "properties"."propertyId"
    where "messages"."senderId" = $1, "messages"."receiverId"= $2
    order by "messages"."createdAt" desc
    `;
    const params = [userId, receiverId];
    const result = await db.query(sql, params);
    const conversation = result.rows;
    res.status(200).json({ conversation });
  } catch (err) {
    next(err);
  }
});
/* Messages back-end End */

/* Review back-end Start */

// Add review
app.post('/api/reviews', authMiddleware, async (req, res, next) => {
  try {
    const { agentId, reviewText, rating } = req.body;
    const { userId } = req.user ?? {};
    if (!agentId) {
      throw new ClientError(400, 'agentId is missing ');
    }
    if (!reviewText) {
      throw new ClientError(400, 'reviewText is missing ');
    }
    if (!rating) {
      throw new ClientError(400, 'rating is missing ');
    }

    const sql = `
    insert into "reviews"("userId","reviewText", "rating" )
    values ($1, $2, $3)
    returning*
    `;
    const params = [userId, reviewText, rating];
    const result = await db.query(sql, params);
    const addReview = result.rows[0];
    res.status(200).json({ addReview });
  } catch (err) {
    next(err);
  }
});

// role Agent user get back the review
app.get('/api/reviews/:agentId', authMiddleware, async (req, res, next) => {
  try {
    const { agentId } = req.params;
    const sql = `
    select *
    from "reviews"
    join "users" on "reviews"."userId"= "users"."userId"
    where "reviews"."userId"= $1
    order by "reviews"."createdAt" desc
    `;
    const params = [agentId];
    const result = await db.query(sql, params);
    const readReview = result.rows[0];
    res.status(200).json({ readReview });
  } catch (err) {
    next(err);
  }
});

// create reply to a review
app.post(
  'api/reviews/:reviewId/:reply',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const { replyText } = req.body;
      const { userId, role } = req.user ?? {};

      if (role !== 'agent') {
        throw new ClientError(403, 'Only agents can reply to reviews');
      }
      if (!replyText) {
        throw new ClientError(400, 'Reply text is required');
      }

      const sql = `
    INSERT INTO "reviews" ("userId", "reviewText", "replyTo", "rating")
    VALUES ($1, $2, $3, NULL)
    RETURNING *;
    `;
      const params = [userId, replyText, reviewId];
      const result = await db.query(sql, params);
      const reply = result.rows[0];
      res.status(201).json({ reply });
    } catch (err) {
      next(err);
    }
  }
);

/* Map and Geo code */

app.get('/api/geocode', async (req, res, next) => {
  const { numberAndStreet, city, state, zipCode } = req.query;

  if (!numberAndStreet || !city || !state || !zipCode) {
    return res.status(400).json({ error: 'Missing required address fields.' });
  }

  const fullAddress = `${numberAndStreet}, ${city}, ${state}, ${zipCode}`;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    fullAddress as string
  )}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return res.json({ lat: location.lat, lng: location.lng });
    } else {
      console.error('Geocoding failed:', data.status);
      return res
        .status(500)
        .json({ error: `Geocoding failed: ${data.status}` });
    }
  } catch (err) {
    next(err);
  }
});

/* review backend End */
/*
 * Handles paths that aren't handled by any other route handler.
 * It responds with `index.html` to support page refreshes with React Router.
 * This must be the _last_ route, just before errorMiddleware.
 */
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
});

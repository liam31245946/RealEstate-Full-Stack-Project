import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import { ClientError, errorMiddleware, authMiddleware } from './lib/index.js';
import { argon2 } from 'argon2';
import jwt from 'jsonwebtoken';
import { nextTick } from 'process';

type User = {
  userId: number;
  username: string;
  hashedPassword: string;
  role: string;
};

type Auth = {
  username: string;
  password: string;
};

export type properties = {
  propertyId: number;
  title: string;
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
  status: string;
  createdAt: Date;
  approvedBy: number;
  approvedDate: Date;
};
const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(express.json());

// sign in and sing out section Start
app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(400, 'username and password are required fields');
    }
    const hashedPassword = await argon2.hash(password);
    const sql = `
      insert into "users" ("userName", "hashedPassword")
      values ($1, $2)
      returning "userId", "userName", "createdAt"
    `;
    const params = [username, hashedPassword];
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

/* Agent user backend logic Start */
app.post('/api/properties', authMiddleware, async (req, res, next) => {
  try {
    const {
      title,
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
    if (!title) {
      throw new ClientError(400, 'Title is missing');
    }
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

    const sql = `
    insert into "properties"
      ("title", "description", "price", "size", "bedrooms", "bathrooms", "features", "numberAndStreet", "city", "state", "zipCode", "agentId", "status")
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      returning *`;
    const params = [
      title,
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
    ];
    const result = await db.query(sql, params);
    const createdEntry = result.rows[0];
    res.status(201).json(createdEntry);
  } catch (err) {
    next(err);
  }
});

//  Get all the info Agent had entered. Implement Filter logic

app.get('/api/properties', authMiddleware, async (req, res, next) => {
  try {
    const { priceMin, priceMax, bedrooms, bathrooms } = req.query;

    let sql = `
    select * from "properties"
    `;
    const params = [];

    if (priceMin) {
      sql += ` and "price" >= $1`;
      params.push(priceMin);
    }

    if (priceMax) {
      sql += ` and "price" <= $${params.length + 1}`;
      params.push(priceMax);
    }

    if (bedrooms) {
      sql += ` and "bedrooms" = $${params.length + 1}`;
      params.push(bedrooms);
    }

    if (bathrooms) {
      sql += ` and "bathrooms" = $${params.length + 1}`;
      params.push(bathrooms);
    }

    // Todo Status

    // Todo Map location ( numberAndStreet, city, state, zipCode)

    const result = await db.query(sql, params);
    res.status(200).json({ properties: result.rows });
  } catch (err) {
    next(err);
  }
});

// Get back the id for each property

app.get(
  '/api/properties/propertyId',
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

/* Favorites back end logic. Use to add, remove, view  favorite property */
// Add logic
app.post('/api/favorites', authMiddleware, async (req, res, next) => {
  try {
    const { propertyId } = req.body;
    const { userId } = req.user ?? {};
    if (!userId) {
      throw new ClientError(404, 'userId not found');
    }

    const sql = `
     insert into "favorites"("userId", "propertyID")
     returning *;
     `;
    const params = [propertyId, userId];
    const result = await db.query(sql, params);
    const addFav = result.rows[0];
    res.status(201).json({ addFav });
  } catch (err) {
    next(err);
  }
});
// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

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

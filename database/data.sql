-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

--  insert into "todos"
--    ("task", "isCompleted")
--    values
--      ('Learn to code', false),
--      ('Build projects', false),
--      ('Get a job', false);

INSERT INTO "users"
  ("userId", "userName", "hashedPassword", "role")
VALUES
  (2, 'Agent Smith', 'dummy_hashed_password', 'agent');


INSERT INTO "properties"
  ("description", "price", "size", "bedrooms", "bathrooms", "features", "city", "state", "zipCode", "numberAndStreet", "status", "imageUrl","agentId")
VALUES
  ('Modern 3-Bedroom Townhouse', 275000, 1800, 3, 2, 'Open Floor Plan, Smart Home, Private Patio', 'Irvine', 'CA', '92620', '234 Cypress St', 'For Sale', 'https://photos.zillowstatic.com/fp/31ad47fad515471842f727cee9353e06-cc_ft_768.webp', 2),

  ('Luxury 5-Bedroom Villa with Pool', 750000, 4000, 5, 4, 'Swimming Pool, Home Theater, Wine Cellar', 'Los Angeles', 'CA', '90068', '789 Sunset Blvd', 'For Sale', 'https://photos.zillowstatic.com/fp/6e51804a76950b0371c772ad5c1d3eb3-cc_ft_768.webp',2),

  ('Cozy 2-Bedroom Apartment', 220000, 1200, 2, 2, 'Balcony, Gym Access, Security System', 'San Diego', 'CA', '92103', '321 Ocean Ave', 'For Rent', 'https://photos.zillowstatic.com/fp/a0d3abd543c1a5aba045df07e7e509b4-cc_ft_768.webp',2),

  ('Charming 3-Bedroom Bungalow', 310000, 1600, 3, 2, 'Fireplace, Wooden Floors, Fenced Backyard', 'Long Beach', 'CA', '90805', '456 Palm St', 'For Sale', 'https://photos.zillowstatic.com/fp/aed51ee26fb589a5f23430451df82b52-cc_ft_768.webp',2),

  ('Newly Renovated 4-Bedroom Home', 420000, 2500, 4, 3, 'Modern Kitchen, Walk-In Closets, Solar Panels', 'Sacramento', 'CA', '95821', '567 Oak Dr', 'For Sale', 'https://photos.zillowstatic.com/fp/c4d18fbdf2d08b1cc0714aeaf2d85764-cc_ft_768.webp',2),

  ('Downtown 1-Bedroom Loft', 190000, 900, 1, 1, 'High Ceilings, Rooftop Access, City Views', 'San Francisco', 'CA', '94107', '101 Market St', 'For Rent', 'https://photos.zillowstatic.com/fp/d30f18f240eca2c0385d5f719f39b39d-cc_ft_768.webp',2),

  ('Elegant 6-Bedroom Mansion', 1200000, 5500, 6, 5, 'Grand Staircase, Private Elevator, Infinity Pool', 'Beverly Hills', 'CA', '90210', '890 Beverly Hills Rd', 'For Sale', 'https://photos.zillowstatic.com/fp/fe52b22971f7a65333b09eacbf9ff91f-cc_ft_768.webp',2),

  ('Spacious 3-Bedroom Condo', 295000, 1700, 3, 2, 'Gated Community, Pool Access, Fitness Center', 'Fresno', 'CA', '93722', '909 West Ave', 'For Sale', 'https://photos.zillowstatic.com/fp/5bbaddb54c0e21ae04c1c5351d7f2de9-cc_ft_768.webp',2),

  ('Rustic 4-Bedroom Cabin', 350000, 2000, 4, 3, 'Mountain Views, Fireplace, Wraparound Porch', 'Big Bear', 'CA', '92315', '654 Pine Rd', 'For Sale', 'https://photos.zillowstatic.com/fp/33cae37dde246e6656d61a9b2eeefe62-cc_ft_768.webp',2),

  ('Beachfront 2-Bedroom Retreat', 580000, 1400, 2, 2, 'Private Beach Access, Ocean Views, Large Deck', 'Malibu', 'CA', '90265', '202 Shoreline Dr', 'For Sale', 'https://photos.zillowstatic.com/fp/b14df556f941b3d1179a614f1c26a372-cc_ft_768.webp',2),

  ('Luxury Penthouse with City Views', 950000, 2800, 3, 3, 'Private Rooftop, Floor-to-Ceiling Windows, Smart Home Tech', 'Los Angeles', 'CA', '90015', '350 Sky Tower Dr', 'For Sale', 'https://photos.zillowstatic.com/fp/d74308cc29a13b7a92850715c82b7d5c-cc_ft_768.webp',2),

  ('Spacious 5-Bedroom Farmhouse', 650000, 3200, 5, 4, 'Large Barn, Acres of Land, Modern Interior', 'Napa', 'CA', '94558', '789 Vineyard Ln', 'For Sale', 'https://photos.zillowstatic.com/fp/7239dad569dc25a225e3e7f439eca80b-cc_ft_768.webp',2);

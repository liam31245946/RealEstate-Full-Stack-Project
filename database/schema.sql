set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "users" (
  "userId" serial PRIMARY KEY,
  "userName" text,
  "hashedPassword" text,
  "role" text,
  "createdAt" timestamptz,
  "bannedBy" integer,
  "bannedDate" timestamptz
);

CREATE TABLE "properties" (
  "propertyId" serial PRIMARY KEY,
  "title" text,
  "description" text,
  "price" integer,
  "size" integer,
  "bedrooms" integer,
  "bathrooms" integer,
  "features" text,
  "longitude" text,
  "latitude" text,
  "agentId" integer,
  "status" text,
  "createdAt" timestamptz,
  "approvedBy" integer,
  "approvedDate" timestamptz
);

CREATE TABLE "favorites" (
  "favoriteId" serial PRIMARY KEY,
  "userId" integer,
  "propertyId" integer,
  "createdAt" timestamptz
);

CREATE TABLE "messages" (
  "messageId" serial PRIMARY KEY,
  "senderId" integer,
  "receiverId" integer,
  "propertyId" integer,
  "message" text,
  "createdAt" timestamptz
);

CREATE TABLE "reviews" (
  "reviewId" serial PRIMARY KEY,
  "userId" integer,
  "reviewText" text,
  "rating" integer,
  "createdAt" timestamptz,
  "replyTo" integer,
  "replyDate" timestamptz
);

COMMENT ON COLUMN "users"."role" IS 'registered, agent, admin';

COMMENT ON COLUMN "properties"."size" IS 'Size in square feet';

COMMENT ON COLUMN "properties"."status" IS 'for sale, for rent, sold';

COMMENT ON COLUMN "reviews"."rating" IS 'Rating out of 5';

ALTER TABLE "users" ADD FOREIGN KEY ("bannedBy") REFERENCES "users" ("userId");

ALTER TABLE "properties" ADD FOREIGN KEY ("agentId") REFERENCES "users" ("userId");

ALTER TABLE "properties" ADD FOREIGN KEY ("approvedBy") REFERENCES "users" ("userId");

ALTER TABLE "favorites" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "favorites" ADD FOREIGN KEY ("propertyId") REFERENCES "properties" ("propertyId");

ALTER TABLE "messages" ADD FOREIGN KEY ("senderId") REFERENCES "users" ("userId");

ALTER TABLE "messages" ADD FOREIGN KEY ("receiverId") REFERENCES "users" ("userId");

ALTER TABLE "messages" ADD FOREIGN KEY ("propertyId") REFERENCES "properties" ("propertyId");

ALTER TABLE "reviews" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "reviews" ADD FOREIGN KEY ("replyTo") REFERENCES "reviews" ("reviewId");

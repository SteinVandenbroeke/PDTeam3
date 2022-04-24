CREATE TYPE "club_member_val" AS ENUM (
  'ACTIVE',
  'PRE-CREATE'
);

CREATE TYPE "fashion_news_val" AS ENUM (
  'NONE',
  'Regularly'
);

CREATE TABLE users(
  "username" varchar PRIMARY KEY,
  "password" varchar,
  "admin" boolean,
  "email" varchar UNIQUE,
  "dateOfBirth" timestamp,
  "profilePicture" varchar,
  "public_id" varchar,
  "firstName" varchar,
  "lastName" varchar
);

CREATE TABLE abtest(
  "test_name" varchar PRIMARY KEY,
  "algorithms" int[],
  "dataset" varchar REFERENCES datasets(name) ON DELETE CASCADE,
  "begin_ts" TIMESTAMP,
  "end_ts" TIMESTAMP,
  "stepsize" TIMESTAMP
);

CREATE TABLE algorithms(
  "id" int PRIMARY KEY,
  "name" varchar
);

CREATE TABLE datasets(
  "name" varchar PRIMARY KEY,
  "createdBy" varchar REFERENCES users("username"),
  "creationDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

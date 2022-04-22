CREATE TYPE "club_member_val" AS ENUM (
  'ACTIVE',
  'PRE-CREATE'
);

CREATE TYPE "fashion_news_val" AS ENUM (
  'NONE',
  'Regularly'
);

CREATE TABLE "users" (
  "username" varchar PRIMARY KEY,
  "password" varchar,
  "admin" boolean,
  "email" varchar UNIQUE,
  "dateOfBirth" timestamp,
  "profilePicture": varchar,
  "public_id": varchar,
  "fistName": varchar,
  "lastName": varchar
);

CREATE TABLE "ABtest" (
  "test_name" varchar PRIMARY KEY,
  "algorithms" int[],
  "dataset" varchar,
  "begin_ts" TIMESTAMP,
  "end_ts" TIMESTAMP,
  "stepsize" TIMESTAMP
);

CREATE TABLE "Algorithms" (
  "id" int PRIMARY KEY,
  "name" varchar
);

CREATE TABLE "Datasets" (
  "name" varchar PRIMARY KEY,
  "createdBy" varchar REFERENCES "users"("username"),
  "creationDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "contact" ADD FOREIGN KEY ("username") REFERENCES "users" ("username");
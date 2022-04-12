CREATE TYPE "club_member_val" AS ENUM (
  'ACTIVE',
  'PRE-CREATE'
);

CREATE TYPE "fashion_news_val" AS ENUM (
  'NONE',
  'Regularly'
);

CREATE TABLE "contact" (
  "username" varchar,
  "name" varchar,
  "email" varchar
);

CREATE TABLE "users" (
  "username" varchar PRIMARY KEY,
  "password" varchar,
  "admin" bool
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

ALTER TABLE "contact" ADD FOREIGN KEY ("username") REFERENCES "users" ("username");
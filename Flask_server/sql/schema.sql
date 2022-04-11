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

CREATE TABLE "setname_items" (
  "item_id" int PRIMARY KEY,
  "product_code" int,
  "prod_name" varchar,
  "product_type_no" int,
  "product_type_name" varchar,
  "product_group_name" varchar,
  "graphical_appearance_no" int,
  "graphical_appearance_name" varchar,
  "colour_group_code" int,
  "colour_group_name" varchar,
  "perceived_colour_value_id" int,
  "perceived_colour_value_name" varchar,
  "perceived_colour_master_id" int,
  "perceived_colour_master_name" varchar,
  "department_no" int,
  "department_name" varchar,
  "index_code" int,
  "index_name" varchar,
  "index_group_no" int,
  "index_group_name" varchar,
  "section_no" int,
  "section_name" varchar,
  "garment_group_no" int,
  "garment_group_name" varchar,
  "detail_desc" varchar,
  "image_url" varchar
);

CREATE TABLE "setname_people" (
  "person_id" int PRIMARY KEY,
  "FN" int,
  "Active" int,
  "club_member_status" club_member_val,
  "fashion_news_frequency" fashion_news_val,
  "age" int,
  "postal_code" varchar
);

CREATE TABLE "setname_interactions" (
  "person_id" int,
  "item_id" int,
  "price" int,
  "timestamp" datetime
);

CREATE TABLE "setname_personrec" (
  "person_id" int,
  "test" varchar,
  "algorithm" int,
  "timestamp" datetime,
  "rec_list" int[]
);

CREATE TABLE "setname_itemrec" (
  "item_id" int,
  "test" varchar,
  "algorithm" int,
  "timestamp" datetime,
  "num_of_rec" int,
  "num_of_suc_rec" int
);

CREATE TABLE "setname_ABrec" (
  "test" varchar,
  "algorithm" int,
  "timestamp" datetime,
  "rec_list" int[]
);

CREATE TABLE "ABtest" (
  "test_name" varchar PRIMARY KEY,
  "algorithms" int[],
  "dataset" varchar,
  "begin_ts" datetime,
  "end_ts" datetime,
  "stepsize" datetime
);

CREATE TABLE "Algorithms" (
  "id" int PRIMARY KEY,
  "name" varchar
);

ALTER TABLE "contact" ADD FOREIGN KEY ("username") REFERENCES "users" ("username");

ALTER TABLE "setname_interactions" ADD FOREIGN KEY ("person_id") REFERENCES "setname_people" ("person_id");

ALTER TABLE "setname_interactions" ADD FOREIGN KEY ("item_id") REFERENCES "setname_items" ("item_id");

ALTER TABLE "setname_personrec" ADD FOREIGN KEY ("person_id") REFERENCES "setname_people" ("person_id");

ALTER TABLE "setname_personrec" ADD FOREIGN KEY ("test") REFERENCES "ABtest" ("test_name");

ALTER TABLE "setname_personrec" ADD FOREIGN KEY ("algorithm") REFERENCES "Algorithms" ("id");

ALTER TABLE "setname_itemrec" ADD FOREIGN KEY ("item_id") REFERENCES "setname_items" ("item_id");

ALTER TABLE "setname_itemrec" ADD FOREIGN KEY ("test") REFERENCES "ABtest" ("test_name");

ALTER TABLE "setname_itemrec" ADD FOREIGN KEY ("algorithm") REFERENCES "Algorithms" ("id");

ALTER TABLE "setname_ABrec" ADD FOREIGN KEY ("test") REFERENCES "ABtest" ("test_name");

ALTER TABLE "setname_ABrec" ADD FOREIGN KEY ("algorithm") REFERENCES "Algorithms" ("id");
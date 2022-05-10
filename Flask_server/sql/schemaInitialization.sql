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

CREATE TABLE datasets(
  "name" varchar PRIMARY KEY,
  "createdBy" varchar REFERENCES users("username"),
  "creationDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE algorithms(
  "id" int PRIMARY KEY,
  "name" varchar
);

CREATE TABLE abtest(
  "test_name" varchar PRIMARY KEY,
  "dataset" varchar REFERENCES datasets(name) ON DELETE CASCADE,
  "begin_ts" TIMESTAMP,
  "end_ts" TIMESTAMP,
  "topK" int,
  "stepsize" int
);

CREATE TABLE abtest_algorithms(
    "test_name" varchar REFERENCES abtest(test_name) ON UPDATE CASCADE ON DELETE CASCADE,
    "algorithmid" int REFERENCES algorithms(id),
    "interval" int,
    "K" int,
    PRIMARY KEY("test_name", "algorithmid", "interval")
);

-- CREATE TABLE "abtestsitems" (
--   "item_id" int,
--   "test" varchar,
--   "algorithm" int,
--   "timestamp" timestamp ,
--   "num_of_rec" int,
--   "num_of_suc_rec" int,
--    PRIMARY KEY("item_id", "test", "algorithm", "timestamp")
-- );

CREATE TABLE "abrec" (
  "idAbRec" int PRIMARY KEY,
  "algorithm" int,
  "timestamp" timestamp
);

CREATE TABLE "abrecmetric" (
    "idAbRec" int REFERENCES "abrec" ("idAbRec"),
    ctr float,
    atr7 float,
    atr30 float,
    avargeUserRevenueCTR float,
    avargeUserRevenue7 float,
    avargeUserRevenue30 float,
    PRIMARY KEY ("idAbRec")
)

CREATE TABLE "abreclist" (
  "idAbRec" int,
  "itemId" int,
  PRIMARY KEY ("idAbRec", "itemId")
);

CREATE TABLE "abrecid_personrecid" (
  "idAbRec" int,
  "personid" int,
  "test_name" varchar,
  PRIMARY KEY ("idAbRec", "personid", "test_name")
);

--TODO add to python ALTER TABLE "abtestsitems" ADD FOREIGN KEY ("item_id") REFERENCES "setname_items" ("item_id");

ALTER TABLE "abtestsitems" ADD FOREIGN KEY ("test") REFERENCES "abtest" ("test_name");

ALTER TABLE "abtestsitems" ADD FOREIGN KEY ("algorithm") REFERENCES "algorithms" ("id");

ALTER TABLE "abrec" ADD FOREIGN KEY ("algorithm") REFERENCES "algorithms" ("id");

ALTER TABLE "abrecid_personrecid" ADD FOREIGN KEY ("idAbRec") REFERENCES "abrec" ("idAbRec");

ALTER TABLE "abreclist" ADD FOREIGN KEY ("idAbRec") REFERENCES "abrec" ("idAbRec");

ALTER TABLE "abreclist" ADD FOREIGN KEY ("itemId") REFERENCES "setname_items" ("item_id");

ALTER TABLE "abrecid_personrecid" ADD FOREIGN KEY ("test_name") REFERENCES "abtest" ("test_name");

ALTER TABLE "abrecid_personrecid" ADD FOREIGN KEY ("personid") REFERENCES "setname_people" ("person_id");

create sequence "abrec_idAbRec_seq"
	as integer;

alter table abrec alter column "idAbRec" set default nextval('public."abrec_idAbRec_seq"'::regclass);

alter sequence "abrec_idAbRec_seq" owned by abrec."idAbRec";

INSERT INTO public.algorithms (id,name) VALUES (0,'Popularity');
INSERT INTO public.algorithms (id,name) VALUES (1,'Recency');
INSERT INTO public.algorithms (id,name) VALUES (2, 'ItemKNN');
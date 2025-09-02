import { PrismaClient } from "@prisma/client";

let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

if (!global.__db) {
  global.__db = new PrismaClient();

  global.__db
    .$connect()
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((e): any => {
      console.log("Failed to connect to the database");
    });
}

db = global.__db;

export { db };

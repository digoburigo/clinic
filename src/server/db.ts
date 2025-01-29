// import { createClient } from "@libsql/client";
// import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

import { env } from "~/env";

// const libsql = createClient({
//   url: `${process.env.TURSO_DATABASE_URL}`,
//   authToken: `${process.env.TURSO_DATABASE_AUTH_TOKEN}`,
// });

// const adapter = new PrismaLibSQL(libsql);

const createPrismaClient = () =>
  new PrismaClient({
    // adapter: process.env.NODE_ENV === "production" ? adapter : undefined,
    // when seeding to turso, we need to use the adapter
    // adapter: adapter,
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;

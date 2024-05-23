import { PrismaClient as AdminPrisma } from "@prisma/client";

export const adminDB = new AdminPrisma({
  datasources: {
    db: {
      url: `${process.env.DATABASE_URL}sm?retryWrites=true&w=majority`,
    },
  },
});

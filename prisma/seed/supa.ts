import { auth } from "~/server/auth";
import { db } from "~/server/db";

async function main() {
  console.info("Seeding database...");

  const supa = await auth.api.signUpEmail({
    body: {
      email: "superadmin@melomarclinica.com.br",
      password: "senhaforte",
      name: "Super Admin",
    },
  });

  await db.user.update({
    where: {
      id: supa.user.id,
    },
    data: {
      emailVerified: true,
      role: "admin",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.info("Database seeded successfully");
    await db.$disconnect();
  });

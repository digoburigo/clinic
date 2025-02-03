import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { CID_LIST } from "../data/listacid";

async function main() {
  console.info("Seeding database...");

  await Promise.all([
    db.organization.deleteMany(),
    db.account.deleteMany(),
    db.user.deleteMany(),
    db.session.deleteMany(),
    db.verification.deleteMany(),
    db.invitation.deleteMany(),
    db.patient.deleteMany(),
    db.vaccinationsValues.deleteMany(),
    db.healthPlansValues.deleteMany(),
  ]);

  await db.cid.createMany({
    data: CID_LIST,
  });

  const [user, org] = await Promise.all([
    auth.api.signUpEmail({
      body: {
        email: "filipemartyn@gmail.com",
        password: "12345678",
        name: "Filipe Martyn",
      },
    }),
    db.organization.create({
      data: {
        name: "Melomar Clínica Médica",
        slug: "melomar-clinica-medica",
      },
    }),
  ]);

  await Promise.all([
    db.user.update({
      where: {
        id: user.user.id,
      },
      data: {
        emailVerified: true,
      },
    }),
    db.member.create({
      data: {
        organizationId: org?.id as string,
        userId: user.user.id,
        role: "owner",
      },
    }),
  ]);
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

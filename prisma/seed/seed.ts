import { auth } from "~/server/auth";
import { faker } from "@faker-js/faker";
import { db } from "~/server/db";

async function main() {
  console.log("Seeding database...");

  await Promise.all([
    db.organization.deleteMany(),
    db.account.deleteMany(),
    db.user.deleteMany(),
    db.session.deleteMany(),
    db.verification.deleteMany(),
    db.invitation.deleteMany(),
  ]);

  const [superAdminUser, adminUser, memberUser, ownerUser, patientUser] =
    await Promise.all([
      auth.api.signUpEmail({
        body: {
          email: "superadmin@test.com",
          password: "12345678",
          name: "super-admin-user",
        },
      }),
      auth.api.signUpEmail({
        body: {
          email: "admin@test.com",
          password: "12345678",
          name: "admin-user",
        },
      }),
      auth.api.signUpEmail({
        body: {
          email: "member@test.com",
          password: "12345678",
          name: "member-user",
        },
      }),
      auth.api.signUpEmail({
        body: {
          email: "owner@test.com",
          password: "12345678",
          name: "owner-user",
        },
      }),
      auth.api.signUpEmail({
        body: {
          email: "patient@test.com",
          password: "12345678",
          name: "patient-user",
        },
      }),
    ]);

  const [organization1, organization2] = await Promise.all([
    db.organization.create({
      data: {
        name: "Clínica 1",
        slug: "clinica-1",
      },
    }),
    db.organization.create({
      data: {
        name: "Clínica 2",
        slug: "clinica-2",
      },
    }),
  ]);

  await Promise.all([
    db.user.update({
      where: {
        id: superAdminUser.user.id,
      },
      data: {
        role: "admin",
        emailVerified: true,
      },
    }),
    db.user.update({
      where: {
        id: adminUser.user.id,
      },
      data: {
        role: "admin",
        emailVerified: true,
      },
    }),
    db.user.update({
      where: {
        id: memberUser.user.id,
      },
      data: {
        role: "member",
        emailVerified: true,
      },
    }),
    db.user.update({
      where: {
        id: ownerUser.user.id,
      },
      data: {
        role: "owner",
        emailVerified: true,
      },
    }),
    db.user.update({
      where: {
        id: patientUser.user.id,
      },
      data: {
        role: "patient",
        emailVerified: true,
      },
    }),

    db.member.create({
      data: {
        organizationId: organization1?.id as string,
        userId: ownerUser.user.id,
        role: "owner",
      },
    }),
    db.member.create({
      data: {
        organizationId: organization1?.id as string,
        userId: adminUser.user.id,
        role: "admin",
      },
    }),
    db.member.create({
      data: {
        organizationId: organization2?.id as string,
        userId: ownerUser.user.id,
        role: "owner",
      },
    }),
    db.member.create({
      data: {
        organizationId: organization1?.id as string,
        userId: memberUser.user.id,
        role: "member",
      },
    }),
    db.member.create({
      data: {
        organizationId: organization1?.id as string,
        userId: patientUser.user.id,
        role: "patient",
      },
    }),
  ]);

  const mockPatients = Array.from({ length: 99 }, (_, index) => {
    const baseDate = new Date();
    const createdAt = new Date(baseDate.setDate(baseDate.getDate() - index));

    return {
      id: faker.string.nanoid(),
      name: faker.person.fullName().replace(/'/g, "''"),
      email: faker.internet.email().replace(/'/g, "''"),
      cpf: faker.string.numeric(11),
      phone: faker.phone.number().replace(/'/g, "''"),
      gender: faker.person.gender().replace(/'/g, "''"),
      nationality: faker.location.country().replace(/'/g, "''"),
      ethnicity: faker.person.zodiacSign().replace(/'/g, "''"),
      state: faker.location.state().replace(/'/g, "''"),
      city: faker.location.city().replace(/'/g, "''"),
      zipCode: faker.location.zipCode().replace(/'/g, "''"),
      neighborhood: faker.location.streetAddress().replace(/'/g, "''"),
      street: faker.location.streetAddress().replace(/'/g, "''"),
      number: faker.location.buildingNumber().replace(/'/g, "''"),
      ownerId: ownerUser.user.id,
      organizationId: organization1?.id as string,
      occupation: faker.person.jobTitle().replace(/'/g, "''"),
      maritalStatus: faker.color.human().replace(/'/g, "''"),
      bloodType: faker.word.verb().replace(/'/g, "''"),
      genderIdentity: faker.person.sex().replace(/'/g, "''"),
      vaccination: faker.word.verb().replace(/'/g, "''"),
      healthInsurance: faker.word.verb().replace(/'/g, "''"),
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
    };
  });

  // relate to user patient@test.com
  const baseDate = new Date();
  const createdAt = new Date(baseDate.setDate(baseDate.getDate() - 8));
  const patientFromUser = {
    id: faker.string.nanoid(),
    name: faker.person.fullName().replace(/'/g, "''"),
    email: "patient@test.com",
    cpf: faker.string.numeric(11),
    phone: faker.phone.number().replace(/'/g, "''"),
    gender: faker.person.gender().replace(/'/g, "''"),
    nationality: faker.location.country().replace(/'/g, "''"),
    ethnicity: faker.person.zodiacSign().replace(/'/g, "''"),
    state: faker.location.state().replace(/'/g, "''"),
    city: faker.location.city().replace(/'/g, "''"),
    zipCode: faker.location.zipCode().replace(/'/g, "''"),
    neighborhood: faker.location.streetAddress().replace(/'/g, "''"),
    street: faker.location.streetAddress().replace(/'/g, "''"),
    number: faker.location.buildingNumber().replace(/'/g, "''"),
    ownerId: ownerUser.user.id,
    organizationId: organization1?.id as string,
    occupation: faker.person.jobTitle().replace(/'/g, "''"),
    maritalStatus: faker.color.human().replace(/'/g, "''"),
    bloodType: faker.word.verb().replace(/'/g, "''"),
    genderIdentity: faker.person.sex().replace(/'/g, "''"),
    vaccination: faker.word.verb().replace(/'/g, "''"),
    healthInsurance: faker.word.verb().replace(/'/g, "''"),
    createdAt: createdAt.toISOString(),
    updatedAt: createdAt.toISOString(),
  };

  mockPatients.push(patientFromUser);

  // Generate SQL values string
  const values = mockPatients
    .map(
      (p) => `(
      '${p.id}',
      '${p.name}',
      '${p.email}',
      '${p.cpf}',
      '${p.phone}',
      '${p.gender}',
      '${p.nationality}',
      '${p.ethnicity}',
      '${p.state}',
      '${p.city}',
      '${p.zipCode}',
      '${p.neighborhood}',
      '${p.street}',
      '${p.number}',
      '${p.ownerId}',
      '${p.organizationId}',
      '${p.occupation}',
      '${p.maritalStatus}',
      '${p.bloodType}',
      '${p.genderIdentity}',
      '${p.vaccination}',
      '${p.healthInsurance}',
      '${p.createdAt}',
      '${p.updatedAt}'
    )`,
    )
    .join(",\n");

  // Raw SQL query for SQLite
  await db.$executeRawUnsafe(`
    INSERT INTO "Patient" (
      "id",
      "name",
      "email",
      "cpf",
      "phone",
      "gender",
      "nationality",
      "ethnicity",
      "state",
      "city",
      "zipCode",
      "neighborhood",
      "street",
      "number",
      "ownerId",
      "organizationId",
      "occupation",
      "maritalStatus",
      "bloodType",
      "genderIdentity",
      "vaccination",
      "healthInsurance",
      "createdAt",
      "updatedAt"
    ) VALUES ${values};
  `);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Database seeded successfully");
    await db.$disconnect();
  });

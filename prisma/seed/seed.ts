import { auth } from "~/server/auth";
import { faker } from "@faker-js/faker";
import { db } from "~/server/db";

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

  const [vaccine1, vaccine2, healthPlan1, healthPlan2] = await Promise.all([
    db.vaccinationsValues.create({
      data: {
        value: "Vacina 1",
      },
    }),
    db.vaccinationsValues.create({
      data: {
        value: "Vacina 2",
      },
    }),
    db.healthPlansValues.create({
      data: {
        value: "Plano de Saúde 1",
      },
    }),
    db.healthPlansValues.create({
      data: {
        value: "Plano de Saúde 2",
      },
    }),
  ]);

  await db.patient.create({
    data: {
      name: faker.person.fullName().replace(/'/g, "''"),
      email: "patient@test.com",
      cpf: faker.string.numeric(11),
      cellphone: faker.phone.number().replace(/'/g, "''"),
      sex: faker.person.sex().replace(/'/g, "''"),
      responsible: faker.person.fullName().replace(/'/g, "''"),
      nationality: faker.location.country().replace(/'/g, "''"),
      race: faker.helpers
        .arrayElement(["white", "black", "brown", "yellow", "indigenous"])
        .replace(/'/g, "''"),
      state: faker.location.state().replace(/'/g, "''"),
      city: faker.location.city().replace(/'/g, "''"),
      zipcode: faker.location.zipCode().replace(/'/g, "''"),
      neighborhood: faker.location.streetAddress().replace(/'/g, "''"),
      street: faker.location.streetAddress().replace(/'/g, "''"),
      number: faker.location.buildingNumber().replace(/'/g, "''"),
      complement: faker.location.secondaryAddress().replace(/'/g, "''"),
      ownerId: ownerUser.user.id,
      organizationId: organization1?.id as string,
      occupation: faker.person.jobTitle().replace(/'/g, "''"),
      sexualOrientation: faker.helpers
        .arrayElement(["Heterossexual", "Homossexual", "Bissexual"])
        .replace(/'/g, "''"),
      civilStatus: faker.helpers
        .arrayElement(["single", "married", "divorced", "widowed", "separated"])
        .replace(/'/g, "''"),
      bloodType: faker.helpers
        .arrayElement(["a+", "a-", "b+", "b-", "ab+", "ab-", "o+", "o-"])
        .replace(/'/g, "''"),
      genderIdentity: faker.helpers
        .arrayElement(["cisgender", "transgender", "non-binary"])
        .replace(/'/g, "''"),
      vaccinations: {
        create: [
          {
            vaccinationsValuesId: vaccine1.id,
          },
          {
            vaccinationsValuesId: vaccine2.id,
          },
        ],
      },
      healthPlans: {
        create: [
          {
            healthPlansValuesId: healthPlan1.id,
          },
          {
            healthPlansValuesId: healthPlan2.id,
          },
        ],
      },
    },
  });

  const mockPatients = Array.from({ length: 99 }, (_, index) => {
    const baseDate = new Date();
    const createdAt = new Date(baseDate.setDate(baseDate.getDate() - index));

    return {
      id: faker.string.nanoid(),
      name: faker.person.fullName().replace(/'/g, "''"),
      email: faker.internet.email().replace(/'/g, "''"),
      cpf: faker.string.numeric(11),
      cellphone: faker.phone.number().replace(/'/g, "''"),
      sex: faker.person.sex().replace(/'/g, "''"),
      responsible: faker.person.fullName().replace(/'/g, "''"),
      nationality: faker.location.country().replace(/'/g, "''"),
      race: faker.helpers
        .arrayElement(["white", "black", "brown", "yellow", "indigenous"])
        .replace(/'/g, "''"),
      state: faker.location.state().replace(/'/g, "''"),
      city: faker.location.city().replace(/'/g, "''"),
      zipcode: faker.location.zipCode().replace(/'/g, "''"),
      neighborhood: faker.location.streetAddress().replace(/'/g, "''"),
      street: faker.location.streetAddress().replace(/'/g, "''"),
      number: faker.location.buildingNumber().replace(/'/g, "''"),
      complement: faker.location.secondaryAddress().replace(/'/g, "''"),
      ownerId: ownerUser.user.id,
      organizationId: organization1?.id as string,
      occupation: faker.person.jobTitle().replace(/'/g, "''"),
      sexualOrientation: faker.helpers
        .arrayElement(["Heterossexual", "Homossexual", "Bissexual"])
        .replace(/'/g, "''"),
      civilStatus: faker.helpers
        .arrayElement(["single", "married", "divorced", "widowed", "separated"])
        .replace(/'/g, "''"),
      bloodType: faker.helpers
        .arrayElement(["a+", "a-", "b+", "b-", "ab+", "ab-", "o+", "o-"])
        .replace(/'/g, "''"),
      genderIdentity: faker.helpers
        .arrayElement(["cisgender", "transgender", "non-binary"])
        .replace(/'/g, "''"),
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
    };
  });

  // Generate SQL values string
  const values = mockPatients
    .map(
      (p) => `(
      '${p.id}',
      '${p.name}',
      '${p.email}',
      '${p.cpf}',
      '${p.cellphone}',
      '${p.sex}',
      '${p.responsible}',
      '${p.nationality}',
      '${p.race}',
      '${p.state}',
      '${p.city}',
      '${p.zipcode}',
      '${p.neighborhood}',
      '${p.street}',
      '${p.number}',
      '${p.complement}',
      '${p.ownerId}',
      '${p.organizationId}',
      '${p.occupation}',
      '${p.sexualOrientation}',
      '${p.civilStatus}',
      '${p.bloodType}',
      '${p.genderIdentity}',
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
      "cellphone",
      "sex",
      "responsible",
      "nationality",
      "race",
      "state",
      "city",
      "zipcode",
      "neighborhood",
      "street",
      "number",
      "complement",
      "ownerId",
      "organizationId",
      "occupation",
      "sexualOrientation",
      "civilStatus",
      "bloodType",
      "genderIdentity",
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
    console.info("Database seeded successfully");
    await db.$disconnect();
  });

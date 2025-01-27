import { PrismaClient } from "@prisma/client";
import { auth } from "~/server/auth";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await Promise.all([
    prisma.organization.deleteMany(),
    prisma.account.deleteMany(),
    prisma.user.deleteMany(),
    prisma.session.deleteMany(),
    prisma.verification.deleteMany(),
    prisma.invitation.deleteMany(),
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

  const [organization1, organization2] =
    await prisma.organization.createManyAndReturn({
      data: [
        {
          name: "Clínica 1",
          slug: "clinica-1",
        },
        {
          name: "Clínica 2",
          slug: "clinica-2",
        },
      ],
    });

  await Promise.all([
    prisma.user.update({
      where: {
        id: superAdminUser.user.id,
      },
      data: {
        role: "admin",
        emailVerified: true,
      },
    }),
    prisma.user.update({
      where: {
        id: adminUser.user.id,
      },
      data: {
        emailVerified: true,
      },
    }),
    prisma.user.update({
      where: {
        id: ownerUser.user.id,
      },
      data: {
        emailVerified: true,
      },
    }),
    prisma.user.update({
      where: {
        id: patientUser.user.id,
      },
      data: {
        emailVerified: true,
      },
    }),
    prisma.user.update({
      where: {
        id: memberUser.user.id,
      },
      data: {
        emailVerified: true,
      },
    }),
    prisma.member.create({
      data: {
        organizationId: organization1?.id as string,
        userId: ownerUser.user.id as string,
        role: "owner",
      },
    }),
    prisma.member.create({
      data: {
        organizationId: organization2?.id as string,
        userId: ownerUser.user.id as string,
        role: "owner",
      },
    }),
    prisma.member.create({
      data: {
        organizationId: organization1?.id as string,
        userId: memberUser.user.id as string,
        role: "member",
      },
    }),
    prisma.member.create({
      data: {
        organizationId: organization1?.id as string,
        userId: adminUser.user.id as string,
        role: "admin",
      },
    }),
    prisma.member.create({
      data: {
        organizationId: organization1?.id as string,
        userId: patientUser.user.id as string,
        role: "patient",
      },
    }),
  ]);

  const mockPatients = Array.from({ length: 100 }, () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    cpf: faker.string.numeric(11),
    phone: faker.phone.number(),
    gender: faker.person.gender(),
    nationality: faker.location.country(),
    ethnicity: faker.person.zodiacSign(),
    state: faker.location.state(),
    city: faker.location.city(),
    zipCode: faker.location.zipCode(),
    neighborhood: faker.location.streetAddress(),
    street: faker.location.streetAddress(),
    number: faker.location.buildingNumber(),
    ownerId: ownerUser.user.id as string,
    organizationId: organization1?.id as string,
    occupation: faker.person.jobTitle(),
    maritalStatus: faker.color.human(),
    bloodType: faker.word.verb(),
    genderIdentity: faker.person.sex(),
    vaccination: faker.word.verb(),
    healthInsurance: faker.word.verb(),
  }));

  await prisma.patient.createMany({
    data: mockPatients,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Database seeded successfully");
    await prisma.$disconnect();
  });

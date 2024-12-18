import { PrismaClient } from "@prisma/client";
import { auth } from "~/server/auth";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.organization.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.post.deleteMany();

  const adminUser = await auth.api.signUpEmail({
    body: {
      email: "admin@test.com",
      password: "12345678",
      name: "admin-user",
    },
  }); 

  const memberUser = await auth.api.signUpEmail({
    body: {
      email: "member@test.com",
      password: "12345678",
      name: "member-user",
    },
  });

  const ownerUser = await auth.api.signUpEmail({
    body: {
      email: "owner@test.com",
      password: "12345678",
      name: "owner-user",
    },
  });


  const organization1 = await prisma.organization.create({
    data: {
      name: "Test Organization",
      slug: "test-organization",
    },
  });

  const organization2 = await prisma.organization.create({
    data: {
      name: "Test Organization 2",
      slug: "test-organization-2",
    },
  });

  await prisma.member.create({
    data: {
      organizationId: organization1?.id,
      userId: ownerUser.id,
      role: "owner",
    },
  });

  await prisma.member.create({
    data: {
      organizationId: organization1?.id,
      userId: memberUser.id,
      role: "member",
    },
  });

  await prisma.member.create({
    data: {
      organizationId: organization1?.id,
      userId: adminUser.id,
      role: "admin",
    },
  });

  await prisma.member.create({
    data: {
      organizationId: organization2?.id,
      userId: ownerUser.id,
      role: "owner",
    },
  });

  if (organization1) {
     await prisma.post.create({
      data: {
        title: "Test Post 1",
        slug: "test-post-1",
        description: "This is a test post",
        organizationId: organization1.id,
        ownerId: ownerUser.id,
      },
    });
  }

  if (organization2) {
    await prisma.post.create({
      data: {
        title: "Test Post 2",
        slug: "test-post-2",
        description: "This is a test post",
        organizationId: organization2.id,
        ownerId: ownerUser.id,
      },
    });
  }
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

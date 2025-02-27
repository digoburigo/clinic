import { Prisma } from "@zenstackhq/runtime/models";

export const withPatientName = {
  include: {
    patient: {
      select: {
        name: true,
      },
    },
  },
} satisfies Prisma.AppointmentDefaultArgs;

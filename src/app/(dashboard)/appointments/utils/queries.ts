import { Prisma } from "@prisma/client";

export const withPatientName = {
  include: {
    patient: {
      select: {
        name: true,
      },
    },
  },
} satisfies Prisma.AppointmentDefaultArgs;

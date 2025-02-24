import { Prisma } from "@prisma/client";

// PATIENT ENTITY
const patientEntityInclude = {
  include: {
    vaccinations: {
      include: {
        vaccinationsValues: true,
      },
    },
    allergies: {
      include: {
        allergiesValues: true,
      },
    },
    medications: {
      include: {
        medicationsValues: true,
      },
    },
    comorbidities: {
      include: {
        comorbiditiesValues: true,
      },
    },
    surgeries: {
      include: {
        surgeriesValues: true,
      },
    },
    healthPlans: {
      include: {
        healthPlansValues: true,
      },
    },
    examResults: {
      include: {
        examResultsValues: true,
      },
    },
  },
} satisfies Prisma.PatientDefaultArgs;

export type PatientEntity = Prisma.PatientGetPayload<
  typeof patientEntityInclude
>;

const patientEntityNewAppointmentInclude = {
  include: {
    allergies: {
      include: {
        allergiesValues: true,
      },
    },
    medications: {
      include: {
        medicationsValues: true,
      },
    },
    comorbidities: {
      include: {
        comorbiditiesValues: true,
      },
    },
  },
} satisfies Prisma.PatientDefaultArgs;

export type PatientEntityNewAppointment = Prisma.PatientGetPayload<
  typeof patientEntityNewAppointmentInclude
>;

const patientWithAppointmentsEntityInclude = {
  include: {
    appointments: true,
  },
} satisfies Prisma.PatientDefaultArgs;

export type PatientWithAppointments = Prisma.PatientGetPayload<
  typeof patientWithAppointmentsEntityInclude
>;

// APPOINTMENT ENTITY
const appointmentEntityInclude = {
  include: {
    patient: {
      select: {
        name: true,
      },
    },
  },
} satisfies Prisma.AppointmentDefaultArgs;

export type AppointmentWithPatient = Prisma.AppointmentGetPayload<
  typeof appointmentEntityInclude
>;

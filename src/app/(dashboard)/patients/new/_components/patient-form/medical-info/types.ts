import { z } from "zod";

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

export const medicalInfoSchema = z.object({
  vaccinations: z.array(optionSchema).min(1),
  allergies: z.array(optionSchema).min(1).optional(),
  medications: z.array(optionSchema).min(1).optional(),
  resultsExams: z.array(optionSchema).min(1).optional(),
  comorbidities: z.array(optionSchema).min(1).optional(),
  surgeries: z.array(optionSchema).min(1).optional(),
  healthPlan: z.array(optionSchema).min(1),
});

export type MedicalInfoForm = z.infer<typeof medicalInfoSchema>;

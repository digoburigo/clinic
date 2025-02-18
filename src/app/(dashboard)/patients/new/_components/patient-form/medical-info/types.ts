import { z } from "zod";

const optionSchema = z.object({
  id: z.string().optional(),
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

export const medicalInfoSchema = z.object({
  vaccinations: z.array(optionSchema).min(1, {
    message: "Vacinação é obrigatória",
  }),
  healthPlans: z.array(optionSchema).optional(),
  allergies: z.array(optionSchema).optional(),
  medications: z.array(optionSchema).optional(),
  examResults: z.array(optionSchema).optional(),
  comorbidities: z.array(optionSchema).optional(),
  surgeries: z.array(optionSchema).optional(),
});

export type MedicalInfoForm = z.infer<typeof medicalInfoSchema>;

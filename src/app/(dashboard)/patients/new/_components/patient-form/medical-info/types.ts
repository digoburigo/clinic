import { z } from "zod";

const optionSchema = z.object({
  id: z.string().optional(),
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

const examResultSchema = z.object({
  type: z
    .array(optionSchema)
    .min(1, { message: "Tipo do exame é obrigatório" })
    .max(1, { message: "Apenas um tipo de exame é permitido" }),
  result: z.string().min(1, { message: "Resultado é obrigatório" }),
  date: z.date().refine(
    (date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime()) && parsedDate <= new Date();
    },
    { message: "Data inválida ou futura" },
  ),
});

export const medicalInfoSchema = z.object({
  vaccinations: z.array(optionSchema).min(1, {
    message: "Vacinação é obrigatória",
  }),
  healthPlans: z.array(optionSchema).optional(),
  allergies: z.array(optionSchema).optional(),
  medications: z.array(optionSchema).optional(),
  examResults: z.array(examResultSchema).optional(),
  comorbidities: z.array(optionSchema).optional(),
  surgeries: z.array(optionSchema).optional(),
});

export type MedicalInfoForm = z.infer<typeof medicalInfoSchema>;

// Export the ExamResult type for reuse
export type ExamResult = z.infer<typeof examResultSchema>;

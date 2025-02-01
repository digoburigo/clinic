import { useDebounce } from "@uidotdev/usehooks";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormDescription, FormMessage } from "~/components/ui/form";
import { FormControl } from "~/components/ui/form";
import { FormLabel } from "~/components/ui/form";
import { FormField } from "~/components/ui/form";
import { FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import MultipleSelector, { type Option } from "~/components/ui/multiple-select";
import { api } from "~/trpc/react";
import type { MedicalInfoForm } from "./types";
import { VaccinationsField } from "./vaccinations-field";

export function MedicalInfoForm() {
  const { control } = useFormContext<MedicalInfoForm>();

  return (
    <div className="space-y-4">
      <VaccinationsField />

      {/* <FormField
        control={control}
        name="allergies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alergias</FormLabel>
            <FormControl>
              <Input placeholder="Ex.: Alergia à penicilina" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="medications"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Medicamentos</FormLabel>
            <FormControl>
              <Input
                placeholder="Ex.: Paracetamol, Aspirina, etc."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="resultsExams"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Resultados de Exames</FormLabel>
            <FormControl>
              <Input
                placeholder="Ex.: Resultado do exame de sangue"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="comorbidities"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Comorbidades</FormLabel>
            <FormControl>
              <Input
                placeholder="Ex.: Diabetes, Hipertensão, Asma, etc."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="surgeries"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cirurgias</FormLabel>
            <FormControl>
              <Input placeholder="Ex.: Cirurgia de catarata" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="healthPlan"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Plano de Saúde</FormLabel>
            <FormControl>
              <Input placeholder="Ex.: SulAmérica, UNIMED, etc." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      /> */}
    </div>
  );
}

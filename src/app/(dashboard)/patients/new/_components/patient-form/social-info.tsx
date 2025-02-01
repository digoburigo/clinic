import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { FormMessage } from "~/components/ui/form";
import { FormControl } from "~/components/ui/form";
import { FormLabel } from "~/components/ui/form";
import { FormField } from "~/components/ui/form";
import { FormItem } from "~/components/ui/form";
import { SelectContent, SelectItem } from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "~/components/ui/select";


const CivilStatusEnum = z.enum(["single", "married", "separated", "divorced", "widowed"], {
  errorMap: () => ({
    message: "Estado civil é obrigatório.",
  }),
});

const BloodTypeEnum = z.enum(["a+", "a-", "b+", "b-", "ab+", "ab-", "o+", "o-"], {
  errorMap: () => ({
    message: "Tipo sanguíneo é obrigatório.",
  }),
});

const GenderIdentityEnum = z.enum(["cisgender", "transgender", "non-binary"], {
  errorMap: () => ({
    message: "Identidade de gênero é obrigatório.",
  }),
});

export const socialInfoSchema = z.object({
  occupation: z.string().nonempty({
    message: "Ocupação é obrigatório.",
  }),
  sexualOrientation: z.string().optional(),
  civilStatus: CivilStatusEnum,
  bloodType: BloodTypeEnum,
  genderIdentity: GenderIdentityEnum,
});

export type SocialInfoForm = z.infer<typeof socialInfoSchema>;

export function SocialInfoForm() {
  const {
    control,
  } = useFormContext<SocialInfoForm>();

  return (
    <div className="space-y-4">
     <FormField
          control={control}
          name="occupation" 
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel required>Ocupação</FormLabel>
              <FormControl>
                <Input placeholder="Ex.: Enfermeiro, Professor, etc." {...field} />
              </FormControl>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="sexualOrientation"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Orientação Sexual</FormLabel>
              <FormControl>
                <Input placeholder="Ex.: Heterossexual, Homossexual, etc." {...field} />
              </FormControl>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="civilStatus"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel required>Estado Civil</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado civil" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="single">Solteiro(a)</SelectItem>
                  <SelectItem value="married">Casado(a)</SelectItem>
                  <SelectItem value="separated">Separado(a)</SelectItem>
                  <SelectItem value="divorced">Divorciado(a)</SelectItem>
                  <SelectItem value="widowed">Viúvo(a)</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="bloodType"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel required>Tipo Sanguíneo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo sanguíneo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="a+">A+</SelectItem>
                  <SelectItem value="a-">A-</SelectItem>
                  <SelectItem value="b+">B+</SelectItem>
                  <SelectItem value="b-">B-</SelectItem>
                  <SelectItem value="ab+">AB+</SelectItem>
                  <SelectItem value="ab-">AB-</SelectItem>
                  <SelectItem value="o+">O+</SelectItem>
                  <SelectItem value="o-">O-</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="genderIdentity"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel required>Identidade de Gênero</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a identidade de gênero" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="cisgender">Cisgênero</SelectItem>
                  <SelectItem value="transgender">Transgênero</SelectItem>
                  <SelectItem value="non-binary">Não-Binário</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.error && (
                <FormMessage>{fieldState.error.message}</FormMessage>
              )}
            </FormItem>
          )}
        />
    </div>
  );
}
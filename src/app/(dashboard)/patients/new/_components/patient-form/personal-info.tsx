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
import { withMask } from "use-mask-input";

const SexEnum = z.enum(["male", "female"], {
  errorMap: () => {
    return {
      message: "Sexo é obrigatório.",
    };
  },
});

const RaceEnum = z.enum(["white", "black", "brown", "yellow", "indigenous"], {
  errorMap: () => ({
    message: "Raça/Cor é obrigatório.",
  }),
});

export const personalInfoSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Nome é obrigatório.",
    })
    .refine(
      (value) => {
        return value.trim() !== "";
      },
      {
        message: "Nome não pode conter apenas espaços.",
      },
    ),
  cpf: z.string().min(11, {
    message: "CPF é obrigatório.",
  }),
  cellphone: z.string().min(10, {
    message: "Celular é obrigatório.",
  }),
  email: z
    .string()
    .nonempty({
      message: "Email é obrigatório.",
    })
    .email({
      message: "Email inválido.",
    }),
  nationality: z
    .string()
    .nonempty({
      message: "Nacionalidade é obrigatória.",
    })
    .refine(
      (value) => {
        return value.trim() !== "";
      },
      {
        message: "Nacionalidade não pode conter apenas espaços.",
      },
    ),
  sex: SexEnum,
  race: RaceEnum,
  responsible: z.string().optional(),
});
export type PersonalInfoForm = z.infer<typeof personalInfoSchema>;

export function PersonalInfoForm() {
  const { control } = useFormContext<PersonalInfoForm>();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel htmlFor={field.name} required>
              Nome
            </FormLabel>
            <FormControl>
              <Input id={field.name} placeholder="João da Silva" {...field} />
            </FormControl>
            {fieldState.error && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="cpf"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel required>CPF</FormLabel>
            <FormControl
              ref={withMask("999.999.999-99", {
                autoUnmask: true,
              })}
            >
              <Input placeholder="Digite seu CPF" {...field} type="tel" />
            </FormControl>
            {fieldState.error && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="cellphone"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel required>Celular</FormLabel>
            <FormControl
              ref={withMask("(99) 99999-9999", {
                autoUnmask: true,
              })}
            >
              <Input {...field} type="tel" />
            </FormControl>
            {fieldState.error && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel required>Email</FormLabel>
            <FormControl>
              <Input placeholder="Digite seu melhor Email" {...field} />
            </FormControl>
            {fieldState.error && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="sex"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel required>Sexo</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o sexo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="male">Masculino</SelectItem>
                <SelectItem value="female">Feminino</SelectItem>
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
        name="responsible"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Responsável</FormLabel>
            <FormControl>
              <Input placeholder="" {...field} />
            </FormControl>
            {fieldState.error && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="nationality"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel required>Nacionalidade</FormLabel>
            <FormControl>
              <Input placeholder="Digite sua nacionalidade" {...field} />
            </FormControl>
            {fieldState.error && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="race"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel required>Raça / Cor</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a raça/cor" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="white">Branco</SelectItem>
                <SelectItem value="black">Preto</SelectItem>
                <SelectItem value="brown">Pardo</SelectItem>
                <SelectItem value="yellow">Amarelo</SelectItem>
                <SelectItem value="indigenous">Indígena</SelectItem>
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

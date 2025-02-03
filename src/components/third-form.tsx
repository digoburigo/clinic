import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useStepper } from "./ui/stepper";
import { StepperFormActions } from "./custom-stepper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const ThirdFormSchema = z.object({
  ocupacao: z.string().nonempty({
    message: "Ocupação is required.",
  }),
  orientacao_sexual: z.string().optional(),
  estado_civil: z.string().nonempty({
    message: "Estado civil is required.",
  }),
  tipo_sanguineo: z.string().nonempty({
    message: "Tipo sanguíneo is required.",
  }),
  identidade_genero: z.string().nonempty({
    message: "Identidade de gênero is required.",
  }),
});

export function ThirdStepForm() {
  const { nextStep } = useStepper();

  const form = useForm<z.infer<typeof ThirdFormSchema>>({
    resolver: zodResolver(ThirdFormSchema),
    defaultValues: {
      ocupacao: "",
      orientacao_sexual: "",
      estado_civil: "",
      tipo_sanguineo: "",
      identidade_genero: "",
    },
  });

  function onSubmit(data: z.infer<typeof ThirdFormSchema>) {
    nextStep();
    toast.success("Parabéns você completou o terceiro passo!");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="ocupacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ocupação principal</FormLabel>
              <FormControl>
                <Input placeholder="Digite sua ocupação" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="orientacao_sexual"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Orientação Sexual</FormLabel>
              <FormControl>
                <Input placeholder="Digite sua orientação sexual" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estado_civil"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado Civil</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado civil" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                  <SelectItem value="casado">Casado(a)</SelectItem>
                  <SelectItem value="separado">Separado(a)</SelectItem>
                  <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                  <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tipo_sanguineo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo Sanguíneo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo sanguíneo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="apositivo">A+</SelectItem>
                  <SelectItem value="anegativo">A-</SelectItem>
                  <SelectItem value="bpositivo">B+</SelectItem>
                  <SelectItem value="bnegativo">B-</SelectItem>
                  <SelectItem value="abpositivo">AB+</SelectItem>
                  <SelectItem value="abnegativo">AB-</SelectItem>
                  <SelectItem value="opositivo">O+</SelectItem>
                  <SelectItem value="onegativo">O-</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="identidade_genero"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Identidade de Gênero</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a identidade de gênero" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="cisgenero">Cisgênero</SelectItem>
                  <SelectItem value="transgenero">Transgênero</SelectItem>
                  <SelectItem value="naobinario">Não-Binário</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <StepperFormActions />
      </form>
    </Form>
  );
}

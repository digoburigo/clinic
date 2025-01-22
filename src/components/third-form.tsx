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

const ThirdFormSchema = z.object({
  ocupacao: z.string().nonempty({
    message: "Ocupação is required.",
  }),
  orientacao_sexual: z.string().optional(),
  estado_civil: z.string().optional(),
  tipo_sanguineo: z.string().optional(),
  identidade_genero: z.string().optional(),
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
              <FormLabel>Ocupação</FormLabel>
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
              <FormControl>
                <Input placeholder="Digite seu estado civil" {...field} />
              </FormControl>
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
              <FormControl>
                <Input placeholder="Digite seu tipo sanguíneo" {...field} />
              </FormControl>
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
              <FormControl>
                <Input
                  placeholder="Digite sua identidade de gênero"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <StepperFormActions />
      </form>
    </Form>
  );
}

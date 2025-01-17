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

const FourthFormSchema = z.object({
  vacinacao: z.string().nonempty({
    message: "Informação de vacinação é obrigatória.",
  }),
  alergias: z.string().optional(),
  medicacoes: z.string().optional(),
  resultados_exames: z.string().optional(),
  comorbidades: z.string().optional(),
  cirurgias: z.string().optional(),
  plano_saude: z.string().nonempty({
    message: "Informação do plano de saúde é obrigatória.",
  }),
});

export function FourthStepForm() {
  const { nextStep } = useStepper();

  const form = useForm<z.infer<typeof FourthFormSchema>>({
    resolver: zodResolver(FourthFormSchema),
    defaultValues: {
      vacinacao: "",
      alergias: "",
      medicacoes: "",
      resultados_exames: "",
      comorbidades: "",
      cirurgias: "",
      plano_saude: "",
    },
  });

  function onSubmit(data: z.infer<typeof FourthFormSchema>) {
    nextStep();
    toast.success("Parabéns você completou o quarto passo!");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="vacinacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vacinação</FormLabel>
              <FormControl>
                <Input placeholder="Informe seu histórico de vacinação" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="alergias"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alergias</FormLabel>
              <FormControl>
                <Input placeholder="Liste suas alergias, se houver" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="medicacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medicações</FormLabel>
              <FormControl>
                <Input placeholder="Liste as medicações em uso" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="resultados_exames"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resultados de Exames</FormLabel>
              <FormControl>
                <Input placeholder="Informe resultados de exames relevantes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comorbidades"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comorbidades</FormLabel>
              <FormControl>
                <Input placeholder="Liste suas comorbidades, se houver" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cirurgias"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cirurgias</FormLabel>
              <FormControl>
                <Input placeholder="Liste cirurgias realizadas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="plano_saude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plano de Saúde</FormLabel>
              <FormControl>
                <Input placeholder="Informe seu plano de saúde" {...field} />
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
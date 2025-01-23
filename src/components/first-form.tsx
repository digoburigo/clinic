"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useMaskito } from "@maskito/react";
import type { MaskitoOptions } from "@maskito/core";
import {
  Form,
  FormControl,
  FormDescription,
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
import { api } from "~/trpc/react";

const FirstFormSchema = z.object({
  username: z.string().min(2, {
    message: "Nome completo deve ter pelo menos 2 caracteres.",
  }),
  cpf: z.string().min(11, {
    message: "CPF deve ter 11 caracteres.",
  }),
  celular: z.string().min(10, {
    message: "Celular deve ter pelo menos 10 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  sexo: z.union([z.literal("masculino"), z.literal("feminino")], {
    required_error: "Selecione o sexo.",
  }),
  responsavel: z.string().optional(),
  nacionalidade: z.string().min(1, {
    message: "Nacionalidade é obrigatória.",
  }),
  raca_cor: z.union(
    [
      z.literal("branco"),
      z.literal("preto"),
      z.literal("pardo"),
      z.literal("amarelo"),
      z.literal("indigena"),
    ],

    {
      required_error: "Selecione a raça/cor.",
    },
  ),
});

const phoneMaskOptions: MaskitoOptions = {
  mask: [
    "+",
    "5",
    "5",
    " ",
    "(",
    /\d/,
    /\d/,
    ")",
    " ",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ],
};

const cpfMaskOptions: MaskitoOptions = {
  mask: [
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    ".",
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
  ],
};

export function FirstStepForm() {
  const { nextStep } = useStepper();

  const phoneInputRef = useMaskito({ options: phoneMaskOptions });
  const cpfInputRef = useMaskito({ options: cpfMaskOptions });

  const form = useForm<z.infer<typeof FirstFormSchema>>({
    resolver: zodResolver(FirstFormSchema),
    defaultValues: {
      cpf: "",
      celular: "",
      email: "",
      sexo: undefined,
      responsavel: "",
      nacionalidade: "",
      raca_cor: undefined,
    },
  });

  const { mutateAsync: createPatient } = api.patient.create.useMutation();

  async function onSubmit(formData: z.infer<typeof FirstFormSchema>) {
    await createPatient({
      data: {
        name: formData.username,
        cpf: formData.cpf,
        phone: formData.celular,
        email: formData.email,
        gender: formData.sexo,
        nationality: formData.nacionalidade,
        ethnicity: formData.raca_cor,
        responsible: formData.responsavel,
        state: "",
        city: "",
        zipCode: "",
        neighborhood: "",
        street: "",
        number: "",
        complement: "",
        occupation: "",
        sexualOrientation: "",
        maritalStatus: "",
        bloodType: "",
        genderIdentity: "",
        vaccination: "",
        allergies: "",
        medications: "",
        examResults: "",
        comorbidities: "",
        surgeries: "",
        healthInsurance: "",
      },
    });
    nextStep();
    toast.success("Parabéns você completou o primeiro passo!");
  }

  const inputRef = useMaskito({ options: phoneMaskOptions });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu CPF" {...field} ref={cpfInputRef} onInput={(evt) => {
                        form.setValue("cpf", evt.currentTarget.value);
                      }} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="celular"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Celular</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} ref={phoneInputRef} onInput={(evt) => {
                        form.setValue("celular", evt.currentTarget.value);
                      }}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu melhor Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sexo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sexo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o sexo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="responsavel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsável</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nacionalidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nacionalidade</FormLabel>
              <FormControl>
                <Input placeholder="Digite sua nacionalidade" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="raca_cor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Raça / Cor</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a raça/cor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="branco">Branco</SelectItem>
                  <SelectItem value="preto">Preto</SelectItem>
                  <SelectItem value="pardo">Pardo</SelectItem>
                  <SelectItem value="amarelo">Amarelo</SelectItem>
                  <SelectItem value="indigena">Indígena</SelectItem>
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

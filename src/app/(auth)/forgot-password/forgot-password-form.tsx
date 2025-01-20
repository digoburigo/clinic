"use client";

import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { authClient } from "~/lib/auth-client";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

const ForgotPasswordFormSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
});

export function ForgotPasswordForm(props: { email?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const form = useForm<z.infer<typeof ForgotPasswordFormSchema>>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: {
      email: props.email || "",
    },
  });

  async function onSubmit(
    formValues: z.infer<typeof ForgotPasswordFormSchema>,
  ) {
    setIsLoading(true); 

    try {
      const { data, error } = await authClient.forgetPassword({
        email: formValues.email,
        redirectTo: "/reset-password",
      });

      if (error) {
        toast.error("Não foi possível enviar o email. Tente novamente.", {
            position: "top-center",
        });
      }

      if (data?.status) {
        setIsSubmitted(true);
      }

    } catch (err) {
      toast.error("Não foi possível enviar o email. Tente novamente.", {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return <ForgotPasswordIsSubmitted setIsSubmitted={setIsSubmitted} />;
  }

  return (
    <main className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Esqueceu sua senha?</CardTitle>
          <CardDescription>
            Você receberá um email com instruções para redefinir sua senha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email da sua conta</FormLabel>
                    <FormControl>
                      <Input {...field} id="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !form.formState.isValid}
              >
                {isLoading ? (
                  <LoaderCircle
                    className="-ms-1 me-2 animate-spin"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                ) : null}
                Enviar
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm">
            Relembrou a senha?{" "}
            <Link href="/login" className="underline-offset-4 hover:underline hover:text-primary">
              Entrar
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}

function ForgotPasswordIsSubmitted({
  setIsSubmitted,
}: {
  setIsSubmitted: (value: boolean) => void;
}) {
  return (
    <main className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Verifique seu email</CardTitle>
          <CardDescription>
            Enviamos um link de redefinição de senha para o seu email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Se você não receber o email, verifique sua caixa de spam.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Link href="/login" className="w-full">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" /> 
              Voltar ao login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}

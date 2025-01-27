"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { InputPassword } from "~/components/ui/input-password";
import { authClient } from "~/lib/auth-client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { LoaderCircle } from "lucide-react";
import { Separator } from "~/components/ui/separator";

const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function LoginForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(formValues: z.infer<typeof LoginFormSchema>) {
    const { data, error } = await authClient.signIn.email(
      {
        email: formValues.email,
        password: formValues.password,
      },
      {
        onRequest: (ctx) => {
          setIsLoading(true);
        },
        onSuccess: (ctx) => {
          setIsLoading(false);
          router.push("/");
        },
        onError: (ctx) => {
          setIsLoading(false);
          if (ctx.error.status === 403) {
            toast.error("Sua conta não está verificada. Verifique seu email.");
            return;
          }

          toast.error("Não foi possível entrar em sua conta. Tente novamente.");
        },
      },
    );
  }

  const onSignInWithGoogle = async () => {
    const { data, error } = await authClient.signIn.social(
      {
        provider: "google",
      },
      {
        onRequest: (ctx) => {
          setIsLoading(true);
        },
        onSuccess: (ctx) => {
          setIsLoading(false);
          router.push("/");
        },
        onError: (ctx) => {
          setIsLoading(false);
          toast.error("Não foi possível entrar em sua conta. Tente novamente.");
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Bem-vindo</CardTitle>
          <CardDescription>
            Gerencie suas consultas e pacientes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onSignInWithGoogle}
                    disabled={isLoading}
                    type="button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Entrar com Google
                  </Button>
                </div>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Ou continue com
                  </span>
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input {...field} id="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel htmlFor="password">Senha</FormLabel>
                        <Button
                          variant="link"
                          type="button"
                          size="sm"
                          aria-disabled={isLoading}
                          onClick={() => {
                            router.push(
                              `/forgot-password${form.getValues().email ? `?email=${form.getValues().email}` : ""}`,
                            );
                          }}
                        >
                          Esqueceu sua senha?
                        </Button>
                      </div>
                      <FormControl>
                        <InputPassword {...field} id="password" />
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
                  Entrar
                </Button>
                <div className="text-center text-sm">
                  Não tem uma conta?{" "}
                  <Button
                    variant="link"
                    className="p-0 underline underline-offset-4"
                    asChild
                  >
                    <Link href="/register" aria-disabled={isLoading}>
                      Cadastre-se
                    </Link>
                  </Button>
                </div>
                <Separator />
                <div className="text-center text-sm">
                  É paciente?{" "}
                  <Button
                    variant="link"
                    type="button"
                    className="p-0 underline underline-offset-4"
                    asChild
                  >
                    <Link href="/patient-area" aria-disabled={isLoading}>
                      Acessar área do paciente
                    </Link>
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        Ao continuar, você concorda com nossos <a href="#">Termos de Serviço</a>{" "}
        e <a href="#">Política de Privacidade</a>.
      </div>
    </div>
  );
}

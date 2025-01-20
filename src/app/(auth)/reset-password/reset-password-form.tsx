"use client";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { InputPassword } from "~/components/ui/input-password";
import { authClient } from "~/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

const ResetPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
    confirmPassword: z.string().min(8, {
      message: "A senha deve ter pelo menos 8 caracteres",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não correspondem",
    path: ["confirmPassword"],
  });

const RESET_PASSWORD_ERRORS = {
  INVALID_TOKEN: "Token inválido",
};

export default function ResetPasswordForm(props: { token: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof ResetPasswordFormSchema>>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(formValues: z.infer<typeof ResetPasswordFormSchema>) {
    setIsLoading(true);

    try {
      const { data, error } = await authClient.resetPassword({
        newPassword: formValues.password,
        token: props.token,
      });

      if (error?.code) {  
        toast.error(RESET_PASSWORD_ERRORS[error.code as keyof typeof RESET_PASSWORD_ERRORS], {
          position: "top-center",
        });
      }

      if (data?.status) {
        toast.success("Senha redefinida com sucesso", {
          position: "top-center",
        });
      }

      router.push("/login");
    } catch (error) {
      toast.error("Erro ao redefinir senha", {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Redefinir senha</CardTitle>
          <CardDescription>Digite a nova senha para sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">Senha</FormLabel>
                    <FormControl>
                      <InputPassword {...field} id="password" />
                    </FormControl>

                    {!form.getFieldState("password").invalid ? (
                      <FormDescription>
                        A senha deve ter pelo menos 8 caracteres
                      </FormDescription>
                    ) : null}

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="confirmPassword">
                      Confirmar senha
                    </FormLabel>
                    <FormControl>
                      <InputPassword {...field} id="confirmPassword" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <LoaderCircle
                    className="-ms-1 me-2 animate-spin"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                ) : null}
                Redefinir
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

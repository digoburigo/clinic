"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
import { Label } from "~/components/ui/label";
import { authClient } from "~/lib/auth-client";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const onSignIn = async () => {
    const { data, error } = await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: (ctx) => {
          setLoading(true);
        },
        onSuccess: (ctx) => {
          router.push("/");
        },
        onError: (ctx) => {
          setLoading(false);
          if (ctx.error.status === 403) {
            toast.error("Sua conta não está verificada. Verifique seu email.");
            return;
          }
          
          toast.error("Não foi possível entrar em sua conta. Tente novamente.");
        },
      },
    );
  };

  const onSignInWithGoogle = async () => {
    const { data, error } = await authClient.signIn.social(
      {
        provider: "google",
      },
      {
        onRequest: (ctx) => {
          setLoading(true);
        },
        onSuccess: (ctx) => {
          router.push("/");
        },
        onError: (ctx) => {
          setLoading(false);
          toast.error("Não foi possível entrar em sua conta. Tente novamente.");
        },
      },
    );
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Entrar</CardTitle>
        <CardDescription>
          Insira suas informações abaixo para entrar na sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <InputPassword
              id="password"
              label="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <Link
            href={`/forgot-password${email ? `?email=${email}` : ""}`}
            className="ml-auto inline-block text-sm underline"
            aria-disabled={loading}
          >
            Esqueceu sua senha?
          </Link>
          <Button
            type="submit"
            className="w-full"
            onClick={onSignIn}
            disabled={loading}
          >
            Entrar
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={onSignInWithGoogle}
            disabled={loading}
          >
            Entrar com Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Não tem uma conta?{" "}
          <Link href="/register" className="underline" aria-disabled={loading}>
            Cadastre-se
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

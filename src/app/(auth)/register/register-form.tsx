"use client";

import { useState } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { authClient } from "~/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { InputPassword } from "~/components/ui/input-password";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [toastId, setToastId] = useState<string | number | undefined>(undefined);

  const onSignUp = async () => {
    const { data, error } = await authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onRequest: (ctx) => {
          setIsLoading(true);
          const toastId = toast.loading('Criando conta...', {
            dismissible: false,
            duration: Infinity,
            position: 'top-center',
          });
          setToastId(toastId);
        },
        onSuccess: (ctx) => {
          toast.dismiss(toastId);
          toast.success('Conta criada com sucesso!');
          router.push('/');
        },
        onError: (ctx) => {
          toast.dismiss(toastId);
          setIsLoading(false);
          toast.error('Erro ao criar conta. Tente novamente.');
        },
      },
    );
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Cadastro</CardTitle>
        <CardDescription>
          Insira suas informações abaixo para criar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <InputPassword
              id="password"
              label="Senha"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" onClick={onSignUp} disabled={isLoading}>
            Criar conta
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

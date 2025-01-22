import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { P } from "~/components/ui/typography";

export function InvitationError() {
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-6 w-6 text-destructive" />
          <CardTitle className="text-xl text-destructive">
            Erro ao aceitar convite
          </CardTitle>
        </div>
        <CardDescription>Ocorreu um erro ao aceitar o convite.</CardDescription>
      </CardHeader>
      <CardContent>
        <P className="mb-4 text-sm">
          O convite que você está tentando acessar é inválido ou você não tem as
          permissões corretas. Por favor, verifique seu email para um convite
          válido ou entre em contato com a pessoa que o enviou.
        </P>
      </CardContent>
      <CardFooter>
        <Link href="/" className="w-full">
          <Button variant="outline" className="w-full">
            Voltar ao início
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

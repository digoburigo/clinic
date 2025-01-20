import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { P, Small } from "~/components/ui/typography";
import { useSession } from "~/server/auth";

export default async function VerifyEmailPage() {
  const session = await useSession();

  if (!session) {
    return redirect("/login");
  }

  if (session.user.emailVerified) {
    return redirect("/");
  }

  return (
    <div className="w-full h-screen grid place-items-center">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Verifique seu email</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <P>
            Enviamos um email para você.
          </P>
          <Small>
             Clique no link para verificar seu
            email.
          </Small>
        </CardContent>
      </Card>
    </div>
  );
}

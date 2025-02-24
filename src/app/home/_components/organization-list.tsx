"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { LI, P, UL } from "~/components/ui/typography";
import { authClient } from "~/lib/auth-client";
import { useTRPC } from "~/trpc/react";

export function OrganizationList({ userId }: { userId: string }) {
  const trpc = useTRPC();
  const router = useRouter();

  const { data: organizations } = useSuspenseQuery(
    trpc.organization.findMany.queryOptions({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
    }),
  );

  const handleEnterOrg = async (organizationId: string) => {
    await authClient.organization.setActive({
      organizationId,
    });
    router.push(`/`);
  };

  return (
    <>
      {organizations?.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhuma organização encontrada.</CardTitle>
          </CardHeader>
          <CardContent>
            <P className="text-muted-foreground">Possíveis causas</P>
            <UL>
              <LI>
                Verifique se você está autenticado na conta com o email correto.
              </LI>
              <LI>
                Verifique o email vinculado a essa conta se contém convites para
                alguma organização.
              </LI>
              <LI>
                Crie uma organização{" "}
                <Link href="/organizations/create">
                  <Button
                    variant="link"
                    className="text-primary text-md h-fit p-0"
                  >
                    aqui
                  </Button>
                </Link>{" "}
                para começar a usar o sistema.
              </LI>
            </UL>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Suas organizações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid auto-rows-min gap-4 md:grid-cols-5">
              {organizations?.map((organization) => (
                <Card key={organization.id}>
                  <CardHeader>
                    <CardTitle>{organization.name}</CardTitle>
                    <CardDescription>{organization.slug}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => handleEnterOrg(organization.id)}
                    >
                      Entrar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

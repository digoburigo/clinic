"use client";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { authClient } from "~/lib/auth-client";
import { CheckIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { InvitationError } from "./invitation-error";
import { P, H2 } from "~/components/ui/typography";
import { toast } from "sonner";

export function Invitation(props: { invitationId: string; hasUser: boolean }) {
  const router = useRouter();

  if (!props.invitationId) {
    router.push("/patient-login");
    return;
  }

  const [invitationStatus, setInvitationStatus] = useState<
    "pending" | "accepted" | "rejected"
  >("pending");

  async function handleAccept() {
    const res = await authClient.organization.acceptInvitation({
      invitationId: props.invitationId,
    });

    if (res.error) {
      setError(res.error.message || "Um erro ocorreu");
      return;
    }

    setInvitationStatus("accepted");
    await authClient.organization.setActive({
      organizationId: invitation?.organizationId,
    });
    router.push(`/patient-area`);
  }

  async function handleReject() {
    await authClient.organization
      .rejectInvitation({
        invitationId: props.invitationId,
      })
      .then((res) => {
        if (res.error) {
          setError(res.error.message || "Um erro ocorreu");
        } else {
          setInvitationStatus("rejected");
          const timeout = setTimeout(() => {
            toast.info("Convite recusado. Redirecionando em 5 segundos...");
            router.push("/");
            clearTimeout(timeout);
          }, 5000);
        }
      });
  }

  const [invitation, setInvitation] = useState<{
    organizationName: string;
    organizationSlug: string;
    inviterEmail: string;
    id: string;
    status: "pending" | "accepted" | "rejected" | "canceled";
    email: string;
    expiresAt: Date;
    organizationId: string;
    role: string;
    inviterId: string;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authClient.organization
      .getInvitation({
        query: {
          id: props.invitationId,
        },
      })
      .then((res) => {
        if (res.error) {
          setError(res.error.message || "Um erro ocorreu");
        } else {
          setInvitation(res.data);
        }
      });
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      {invitation ? (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Registro de paciente</CardTitle>
            <CardDescription>
              Você foi cadastrado como paciente ({invitation?.organizationName})
            </CardDescription>
          </CardHeader>
          <CardContent>
            {invitationStatus === "pending" && (
              <div className="space-y-4">
                <P>
                  <strong>{invitation?.inviterEmail}</strong> te cadastrou como
                  paciente
                </P>
                <P>
                  Este registro foi enviado para{" "}
                  <strong>{invitation?.email}</strong>.
                </P>
              </div>
            )}
            {invitationStatus === "accepted" && (
              <div className="space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckIcon className="h-8 w-8 text-green-600" />
                </div>
                <H2 className="text-center">
                  Registro realizado
                </H2>
                <P className="text-center">
                  Seu cadastro como paciente foi processado com sucesso
                </P>
              </div>
            )}
            {invitationStatus === "rejected" && (
              <div className="space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <XIcon className="h-8 w-8 text-red-600" />
                </div>
                <H2 className="text-center">Convite recusado</H2>
                <P className="text-center">
                  Você recusou o convite para se juntar ao time{" "}
                  <strong>{invitation?.organizationName}</strong>.
                </P>
              </div>
            )}
          </CardContent>
          {invitationStatus === "pending" && (
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleReject}>
                Recusar
              </Button>
              <Button onClick={handleAccept}>Aceitar</Button>
            </CardFooter>
          )}
        </Card>
      ) : error ? (
        <InvitationError hasUser={props.hasUser} />
      ) : (
        <InvitationSkeleton />
      )}
    </div>
  );
}

function InvitationSkeleton() {
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  );
}

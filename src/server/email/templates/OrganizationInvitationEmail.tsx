import { Html } from "@react-email/components";
import * as React from "react";
import TailwindProvider from "./utils/tailwind";
import { EmailButton } from "./ui/email-button";

export default function OrganizationInvitationEmail({
  email,
  invitedByUsername,
  invitedByEmail,
  teamName,
  inviteLink = "https://example.com",
}: {
  email: string;
  invitedByUsername: string;
  invitedByEmail: string;
  teamName: string;
  inviteLink: string;
}) {
  return (
    <TailwindProvider>
      <Html>
        <p>
          Você foi convidado para se juntar à {teamName} por {invitedByUsername}{" "}
          ({invitedByEmail}).
        </p>
        <EmailButton href={inviteLink}>Aceitar convite</EmailButton>
      </Html>
    </TailwindProvider>
  );
}

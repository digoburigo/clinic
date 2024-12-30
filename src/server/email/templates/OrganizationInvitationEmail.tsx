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
          You've been invited to join {teamName} by {invitedByUsername} ({invitedByEmail}).
        </p>
        <EmailButton
          href={inviteLink}
        >
          Aceitar convite
        </EmailButton>
      </Html>
    </TailwindProvider>
  );
};

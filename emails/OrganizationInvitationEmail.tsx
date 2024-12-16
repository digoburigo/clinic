import { Button, Html } from "@react-email/components";
import * as React from "react";
import TailwindProvider from "../email-utils/tailwind";

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
        <Button
          href={inviteLink}
          className="bg-primary py-2 px-3 rounded-md"
        >
          Accept Invitation
        </Button>
      </Html>
    </TailwindProvider>
  );
};

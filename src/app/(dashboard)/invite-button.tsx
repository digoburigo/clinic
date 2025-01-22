"use client";

import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";

export function InviteButton() {
  const { data: activeOrganization } = authClient.useActiveOrganization();

  return (
    <Button
      onClick={() => {
        authClient.organization.inviteMember({
          email: "rodrigobesmeraldino@gmail.com",
          role: "admin",
          organizationId: activeOrganization?.id,
        });
      }}
    >
      Convidar teste
    </Button>
  );
}

"use client";

import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Skeleton } from "~/components/ui/skeleton";
import { authClient } from "~/lib/auth-client";
import { Organization } from "@prisma/client";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";

export function AreaSwitcher() {
  const { data: organizations, isPending: isPendingOrganizations } = authClient.useListOrganizations();

  const { data: activeOrganization, isPending: isPendingActiveOrganization } =
    authClient.useActiveOrganization();
  const utils = api.useUtils();

  async function setActiveOrganization(organizationId: string) {
    await authClient.organization.setActive({
      organizationId,
    });
    await utils.invalidate();
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }

  return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="disabled:opacity-100"
              disabled={Boolean(organizations && organizations.length <= 1)}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Plus className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {isPendingActiveOrganization ? (
                    <Skeleton className="h-4 w-32" />
                  ) : (
                    activeOrganization?.name
                  )}
                </span>
              </div>
              {organizations && organizations.length > 1 && (
                <ChevronsUpDown className="ml-auto" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={"right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Times
            </DropdownMenuLabel>
            {organizations?.map((organization, index) => (
              <DropdownMenuItem
                key={organization.id}
                onClick={() => setActiveOrganization(organization.id)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Plus className="size-4 shrink-0" />
                </div>
                {organization.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
       
          </DropdownMenuContent>
        </DropdownMenu>
  );
}

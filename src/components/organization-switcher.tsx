"use client";

import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import { Skeleton } from "~/components/ui/skeleton";
import { authClient } from "~/lib/auth-client";
import { Organization } from "@prisma/client";
import { api } from "~/trpc/react";
import { useState } from "react";

export function OrganizationSwitcher({
  organizations,
}: {
  organizations: Organization[];
}) {
  console.log(`organizations:`, organizations);
  const { isMobile } = useSidebar();

  const [isOpen, setIsOpen] = useState(false);

  const { data: activeOrganization, isPending } =
    authClient.useActiveOrganization();
  const utils = api.useUtils();

  async function setActiveOrganization(organization: Organization) {
    await authClient.organization.setActive({
      organizationId: organization.id,
    });
    await utils.invalidate();
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="disabled:opacity-100 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              disabled={organizations.length <= 1}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Plus className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {isPending ? (
                    <Skeleton className="h-4 w-32" />
                  ) : (
                    activeOrganization?.name
                  )}
                </span>
              </div>
              {organizations.length > 1 && (
                <ChevronsUpDown className="ml-auto" />
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Times
            </DropdownMenuLabel>
            {organizations?.map((organization, index) => (
              <DropdownMenuItem
                key={organization.id}
                onClick={() => setActiveOrganization(organization)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Plus className="size-4 shrink-0" />
                </div>
                {organization.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            {/* <DropdownMenuSeparator /> */}
            {/* <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add organization
              </div>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

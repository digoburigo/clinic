"use client";

import { Organization } from "@prisma/client";
import { NavMain } from "~/components/nav-main";
import { Separator } from "~/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { Skeleton } from "~/components/ui/skeleton";
import { authClient } from "~/lib/auth-client";
import { NavUser } from "./nav-user";
import { OrganizationSwitcher } from "./organization-switcher";

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & { memberRole?: string }) {
  const { data: organizations, isPending } = authClient.useListOrganizations();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="text-primary-foreground bg-primary">
        {isPending ? (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Skeleton className="h-[48px] w-[224px]" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ) : (
          <OrganizationSwitcher
            organizations={organizations as Organization[]}
          />
        )}
        <Separator />
      </SidebarHeader>
      <SidebarContent className="text-primary-foreground bg-primary">
        <NavMain />
      </SidebarContent>
      <SidebarFooter className="bg-primary text-primary-foreground">
        <Separator />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

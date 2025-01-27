"use client";

import { NavMain } from "~/components/nav-main";
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
import { Organization } from "@prisma/client";
import { OrganizationSwitcher } from "./organization-switcher";
import { NavUser } from "./nav-user";
// import { AdminNav } from "./admin-nav";


export function AppSidebar({ memberRole, ...props }: React.ComponentProps<typeof Sidebar> & { memberRole?: string }) {
  const { data: organizations, isPending } = authClient.useListOrganizations();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
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
      </SidebarHeader>
      <SidebarContent>
        {/* {memberRole === "admin" ? <AdminNav /> : null} */}
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

"use client";

import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

export function AdminNav() {
  const pathname = usePathname();
  const isActive = (itemHref: string) => {
    if (itemHref === "/") {
      return pathname === itemHref;
    }
    return pathname === itemHref || pathname.startsWith(itemHref);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Área administrativa</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link
              href="/admin"
              className={cn(
                isActive("/admin") ? "text-primary hover:text-primary" : "",
              )}
            >
              Usuários
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

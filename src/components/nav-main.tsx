"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";

export function NavMain() {
  const pathname = usePathname();
  const isActive = (itemHref: string) => {
    if (itemHref === "/") {
      return pathname === itemHref;
    }
    return pathname === itemHref || pathname.startsWith(itemHref);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link
              href="/"
              className={cn(
                isActive("/") ? "text-primary hover:text-primary" : "",
              )}
            >
              Painel de informações
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link
              href="/patients"
              className={isActive("/patients") ? "text-primary hover:text-primary" : ""}
            >
              Pacientes
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link
              href="/appointments"
              className={cn(
                isActive("/appointments") ? "text-primary hover:text-primary" : "",
              )}
            >
              Consultas
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link
              href="/members"
              className={cn(
                isActive("/members") ? "text-primary hover:text-primary" : "",
              )}
            >
              Membros
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarSeparator />
        <SidebarGroupLabel>Atalhos</SidebarGroupLabel>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link
              href="/patients/new"
              className={cn(
                isActive("/patients/new") ? "text-primary hover:text-primary" : "",
              )}
            >
              Adicionar Paciente
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link
              href="/appointments/new"
              className={cn(
                isActive("/appointments/new") ? "text-primary hover:text-primary" : "",
              )}
            >
              Adicionar Consulta
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

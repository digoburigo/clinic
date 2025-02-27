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

import { SolarCalendarAddBoldDuotone } from "./svgs/solar-calendar-add-bold-duotone";
import { SolarCalendarMarkBoldDuotone } from "./svgs/solar-calendar-mark-bold-duotone";
import { SolarChatSquare2BoldDuotone } from "./svgs/solar-chat-square-2-bold-duotone";
import { SolarUserPlusRoundedBoldDuotone } from "./svgs/solar-user-plus-rounded-bold-duotone";
import { SolarUsersGroupRoundedBoldDuotone } from "./svgs/solar-users-group-rounded-bold-duotone";
import { SolarUsersGroupTwoRoundedBoldDuotone } from "./svgs/solar-users-group-two-rounded-bold-duotone";

const MAIN_ROUTES = [
  {
    label: "Painel de informações",
    href: "/",
    icon: SolarChatSquare2BoldDuotone,
  },
  {
    label: "Pacientes",
    href: "/patients",
    icon: SolarUsersGroupRoundedBoldDuotone,
  },
  {
    label: "Consultas",
    href: "/appointments",
    icon: SolarCalendarMarkBoldDuotone,
  },
  {
    label: "Membros",
    href: "/members",
    icon: SolarUsersGroupTwoRoundedBoldDuotone,
  },
];

const SHORTCUT_ROUTES = [
  {
    label: "Adicionar Paciente",
    href: "/patients/new",
    icon: SolarUserPlusRoundedBoldDuotone,
  },
  {
    label: "Adicionar Consulta",
    href: "/appointments/new",
    icon: SolarCalendarAddBoldDuotone,
  },
];

const MENU_ITEMS = [
  {
    label: "Plataforma",
    routes: MAIN_ROUTES,
  },
  {
    label: "Atalhos",
    routes: SHORTCUT_ROUTES,
  },
];

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
      {MENU_ITEMS.map((menu, index) => (
        <div className="flex flex-col gap-1" key={menu.label}>
          <SidebarGroupLabel className="text-primary-foreground/50 text-xs uppercase">
            {menu.label}
          </SidebarGroupLabel>
          <SidebarMenu>
            {menu.routes.map((route) => (
              <SidebarMenuItem key={route.href}>
                <SidebarMenuButton asChild className="h-9 [&>svg]:size-auto">
                  <Link
                    href={route.href}
                    className={
                      isActive(route.href)
                        ? "bg-primary-foreground hover:!bg-primary-foreground/80 text-primary/100 [&>svg]:text-primary/100 font-semibold"
                        : ""
                    }
                  >
                    {route.icon ? (
                      <route.icon
                        className="text-primary-foreground/80 group-data-[active=true]/menu-button:text-primary"
                        width={20}
                        height={20}
                        aria-hidden="true"
                      />
                    ) : null}
                    <span>{route.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          {index !== MENU_ITEMS.length - 1 && (
            <SidebarSeparator className="my-3 data-[orientation=horizontal]:w-15/16" />
          )}
        </div>
      ))}
    </SidebarGroup>
  );
}

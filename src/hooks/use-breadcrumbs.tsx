"use client";

import { usePathname, useParams } from "next/navigation";
import { useMemo } from "react";

type BreadcrumbItem = {
  title: string;
  link: string;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
  "/": [{ title: "Painel de informações", link: "/" }],
  "/patients": [
    { title: "Pacientes", link: "/patients" },
  ],
  "/patients/:id": [
    { title: "Pacientes", link: "/patients" },
    { title: "Detalhes", link: "" },
  ],
  "/patients/:id/appointments": [
    { title: "Pacientes", link: "/patients" },
    { title: "Detalhes", link: "/patients/:id" },
    { title: "Consultas", link: "" },
  ],
  "/patients/:id/appointments/new": [
    { title: "Pacientes", link: "/patients" },
    { title: "Detalhes", link: "/patients/:id" },
    { title: "Consultas", link: "" },
    { title: "Nova Consulta", link: "/patients/:id/appointments/new" },
  ],
  "/patients/new": [
    { title: "Pacientes", link: "/patients" },
    { title: "Adicionar Paciente", link: "/patients/new" },
  ],
  "/members": [
    { title: "Membros", link: "/members" },
  ],
  "/appointments": [
    { title: "Consultas", link: "/appointments" },
  ],
  "/appointments/new": [
    { title: "Consultas", link: "/appointments" },
    { title: "Adicionar Consulta", link: "/appointments/new" },
  ],
  "/admin": [
    { title: "Administração", link: "/admin" },
  ],
};

export function useBreadcrumbs() {
  const pathname = usePathname();
  const params = useParams();
  
  const breadcrumbs = useMemo(() => {
    // First try to match dynamic routes
    for (const [route, breadcrumbItems] of Object.entries(routeMapping)) {
      // Replace :id with actual param value to check for dynamic route match
      const dynamicRoute = Object.entries(params).reduce((path, [key, value]) => {
        return path.replace(`:${key}`, value as string);
      }, route);
      
      if (pathname === dynamicRoute) {
        // Replace dynamic params in the links as well
        return breadcrumbItems.map(item => ({
          ...item,
          link: Object.entries(params).reduce((link, [key, value]) => {
            return link.replace(`:${key}`, value as string);
          }, item.link)
        }));
      }
    }

    // If no dynamic match found, check for exact static route match
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // Fall back to generating breadcrumbs from the path
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join("/")}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path,
      };
    });
  }, [pathname, params]);

  return breadcrumbs;
}

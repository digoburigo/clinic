import type { Metadata } from "next";
import { ClientsList } from "~/components/clients-list";

export const metadata: Metadata = {
  title: "Pacientes",
  description: "Lista de pacientes",
};

export default function Page() {
  return <ClientsList />;
}


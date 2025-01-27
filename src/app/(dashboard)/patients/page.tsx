import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { useSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { PatientsList } from "./_components/patients-list";
import { ClientsList } from "~/components/clients-list";

export const metadata: Metadata = {
  title: "Pacientes",
  description: "Lista de pacientes",
};

export default async function Page() {
  const authSession = await useSession();

  if (!authSession?.session) {
    return redirect("/");
  }

  const page = 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const take = limit;
  void api.patient.findMany.prefetch({
    take,
    skip,
    orderBy: {
      createdAt: "desc",
      name: "asc",
    },
  });

  return (
    <HydrateClient>
      <Suspense fallback={<div>Loading...</div>}>
        {/* <PatientsList />   */}
        <ClientsList />
      </Suspense>
    </HydrateClient>
  );
}


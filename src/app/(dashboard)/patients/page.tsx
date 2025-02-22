import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DataTableSkeleton } from "~/components/ui/data-table/data-table-skeleton";
import { useSession } from "~/server/auth";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { PatientsTable } from "./_components/patients-table";

export const metadata: Metadata = {
  title: "Pacientes",
  description: "Lista de pacientes",
};

export default async function Page() {
  const authSession = await useSession();

  if (!authSession?.session) {
    return redirect("/");
  }

  const page = 0;
  const limit = 10;
  const skip = page * limit;
  const take = limit;

  prefetch(
    trpc.patient.findMany.queryOptions({
      // take,
      // skip,
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    }),
  );

  prefetch(trpc.patient.count.queryOptions());

  return (
    <HydrateClient>
      <Suspense
        fallback={
          <DataTableSkeleton
            columnCount={6}
            searchableColumnCount={1}
            filterableColumnCount={2}
            cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem", "8rem"]}
          />
        }
      >
        <PatientsTable />
      </Suspense>
    </HydrateClient>
  );
}

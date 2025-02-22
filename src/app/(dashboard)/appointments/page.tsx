import type { Metadata } from "next";
import { Suspense } from "react";
import { DataTableSkeleton } from "~/components/ui/data-table/data-table-skeleton";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { AppointmentsTable } from "./_components/appointments-table";
import { withPatientName } from "./utils/queries";

export const metadata: Metadata = {
  title: "Consultas",
  description: "Lista de consultas",
};

export default function Page() {
  prefetch(trpc.appointment.findMany.queryOptions(withPatientName));

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
        <AppointmentsTable />
      </Suspense>
    </HydrateClient>
  );
}

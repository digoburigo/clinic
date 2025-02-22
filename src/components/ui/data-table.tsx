"use client";
"use no memo";

import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";

import type { HTMLAttributes } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import { DataTableMeta } from "~/types";
import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData> extends HTMLAttributes<HTMLDivElement> {
  /**
   * The table instance returned from useDataTable hook with pagination, sorting, filtering, etc.
   * @type TanstackTable<TData>
   */
  table: TanstackTable<TData> & { options: { meta?: DataTableMeta<TData> } };
  emptyMessage?: string;
}

export function DataTable<TData>({
  table,
  children,
  className,
  emptyMessage = "Nenhum resultado.",
  ...props
}: DataTableProps<TData>) {
  return (
    <div
      className={cn("w-full space-y-2.5 overflow-auto", className)}
      {...props}
    >
      {children}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={(e) => {
                    // Check if click originated from actions column
                    const isActionsCell =
                      (e.target as HTMLElement).getAttribute("data-slot") ===
                        "dropdown-menu-item" ||
                      (e.target as HTMLElement)
                        .closest("td")
                        ?.getAttribute("data-column") === "select";

                    if (!isActionsCell) {
                      table.options.meta?.onRowClick?.(row.original);
                    }
                  }}
                  className="hover:bg-primary/10 cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} data-column={cell.column.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

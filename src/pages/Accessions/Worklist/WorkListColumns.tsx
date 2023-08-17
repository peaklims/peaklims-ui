"use client";

import { AccessionDto } from "@/domain/Accessions/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";

export const columns: ColumnDef<AccessionDto>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "accessionNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Accession Number" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  // {
  //   accessorKey: "amount",
  //   header: () => <div className="text-right">Amount</div>,
  //   cell: ({ row }) => {
  //     const amount = parseFloat(row.getValue("amount"));
  //     const formatted = new Intl.NumberFormat("en-US", {
  //       style: "currency",
  //       currency: "USD",
  //     }).format(amount);

  //     return <div className="font-medium text-right">{formatted}</div>;
  //   },
  // },
];

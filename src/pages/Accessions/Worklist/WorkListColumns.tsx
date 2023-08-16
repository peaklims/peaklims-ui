"use client";

import { AccessionDto } from "@/domain/Accessions/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<AccessionDto>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "accessionNumber",
    header: "Accession Number",
  },
  {
    accessorKey: "status",
    header: "Status",
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

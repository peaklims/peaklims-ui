"use client";

import { AccessionWorklistDto } from "@/domain/Accessions/types";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";

export const columns: ColumnDef<AccessionWorklistDto>[] = [
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
  //   accessorKey: "patient",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Patient" canSort={false} />
  //   ),
  //   cell: ({ row }) => {
  //     const firstName = row.getValue("patient.firstName");
  //     const lastName = row.getValue("patient.lastName");

  //     return (
  //       <div className="">
  //         <p>
  //           {firstName}
  //           {lastName}
  //         </p>
  //       </div>
  //     );
  //   },
  // },
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

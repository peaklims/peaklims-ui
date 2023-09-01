"use client";

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../../../components/data-table/data-table-column-header";
import { SampleDto, SampleStatus } from "../../types";
import SampleStatusBadge from "../status-badge";

export const columns: ColumnDef<SampleDto>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "collectionSite",
    header: "CollectionSite",
  },
  {
    accessorKey: "collectionDate",
    header: "CollectionDate",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "sampleNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sample Number" />
    ),
    cell: ({ row }) => {
      const sampleNumber = row.getValue("sampleNumber") as string;
      const status = row.getValue("status");
      return (
        <div className="space-x-3">
          <p className="inline-flex">{sampleNumber}</p>

          <SampleStatusBadge
            status={status as SampleStatus}
            className="hidden sm:inline-flex"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" canSort={false} />
    ),
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (type?.length ?? 0) > 0 ? <p>{type}</p> : "—";
    },
  },
  {
    accessorKey: "collectionInfo",
    accessorFn: (row) => `${row.collectionSite}-${row.collectionDate}`,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Collection Info"
        canSort={false}
      />
    ),
    cell: ({ row }) => {
      const site = row.getValue("collectionSite") as string;
      const hasSite = (site?.length ?? 0) > 0;
      const collectionDate = row.getValue("collectionDate") as string;
      const hasCollectionDate = (collectionDate?.length ?? 0) > 0;

      return (
        <div className="flex flex-col space-y-1">
          <p className={cn(!hasSite && "opacity-40")}>
            {hasSite ? site : "(No Site Given)"}
          </p>
          {hasCollectionDate ? (
            <p className="text-xs text-slate-700">{collectionDate}</p>
          ) : null}
        </div>
      );
    },
  },
  {
    accessorKey: "receivedDate",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Date Received"
        canSort={true}
      />
    ),
    cell: ({ row }) => {
      const receivedDate = row.getValue("receivedDate") as string;
      return (receivedDate?.length ?? 0) > 0 ? <p>{receivedDate}</p> : "—";
    },
  },
];

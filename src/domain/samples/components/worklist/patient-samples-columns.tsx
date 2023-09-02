"use client";

import { TrashButton } from "@/components/data-table/trash-button";
import { cn } from "@/lib/utils";
import { ColumnDef, Row } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../../../components/data-table/data-table-column-header";
import { SampleDto, SampleStatus } from "../../types";
import SampleStatusBadge from "../status-badge";

type ColumnsWithDeleteCallback = ColumnDef<SampleDto> & {
  onDeleteAction?: (row: Row<SampleDto>) => void;
};

export const createColumns = (
  onDeleteAction: (row: Row<SampleDto>) => void
): ColumnsWithDeleteCallback[] => [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "externalId",
    header: "externalId",
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
      const externalId = row.getValue("externalId") as string;
      return (
        <div className="space-x-3">
          <div className="inline-flex flex-col">
            <p className="block ">{sampleNumber}</p>
            {(externalId?.length ?? 0) > 0 && (
              <p className="block text-xs text-slate-700">{externalId}</p>
            )}
          </div>

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
  {
    accessorKey: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} canSort={false} />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center w-full">
          {/* {canDeleteUser.hasPermission && ( */}
          <TrashButton
            onClick={(e) => {
              onDeleteAction(row);
              e.stopPropagation();
            }}
          />
          {/* )} */}
        </div>
      );
    },
  },
];

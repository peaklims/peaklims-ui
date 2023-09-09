"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { ColumnDef, Row } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../../../components/data-table/data-table-column-header";
import { SampleDto, SampleStatus } from "../../types";
import SampleStatusBadge from "../status-badge";

type ColumnsWithDeleteCallback = ColumnDef<SampleDto> & {
  onDeleteAction?: (row: Row<SampleDto>) => void;
  onDisposeAction?: (row: Row<SampleDto>) => void;
};

export const createColumns = (
  onDeleteAction: (row: Row<SampleDto>) => void,
  onDisposeAction: (row: Row<SampleDto>) => void
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
    accessorKey: "containerType",
    header: "containerType",
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
      const containerType = row.getValue("containerType") as string;
      return (
        <div className="flex flex-col">
          <p>{(type?.length ?? 0) > 0 ? <p>{type}</p> : "—"}</p>
          {containerType ? (
            <p className="text-xs text-slate-700">{containerType}</p>
          ) : null}
        </div>
      );
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
    meta: { thClassName: "w-20" },
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center w-8">
          {/* {canDeleteUser.hasPermission && ( */}
          {/* <TrashButton
            onClick={(e) => {
              onDeleteAction(row);
              e.stopPropagation();
            }}
          /> */}
          {/* )} */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className={cn(
                  "inline-flex items-center px-2 py-2 text-sm font-medium leading-5 transition duration-100 ease-in bg-white rounded-full hover:shadow",
                  "hover:bg-slate-100 hover:text-slate-800 hover:outline-none text-slate-700",
                  "sm:p-3 dark:hover:shadow dark:shadow-slate-400 dark:hover:shadow-slate-300"
                  // "sm:opacity-0 sm:group-hover:opacity-100"
                )}
              >
                {/* https://iconbuddy.app/ion/ellipsis-horizontal-sharp */}
                <svg
                  className="w-4 h-4"
                  width={512}
                  height={512}
                  viewBox="0 0 512 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx={256} cy={256} r={48} fill="currentColor" />
                  <circle cx={416} cy={256} r={48} fill="currentColor" />
                  <circle cx={96} cy={256} r={48} fill="currentColor" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" side="right">
              <DropdownMenuLabel className="py-1 text-xs font-medium text-center">
                {row.getValue("sampleNumber")}
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    alert(`Edit Sample ${row.getValue("id")}`);
                  }}
                >
                  <p>Edit Sample</p>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              {/* <DropdownMenuSeparator /> */}
              {/* <DropdownMenuLabel>Manage Sample</DropdownMenuLabel>
              <DropdownMenuSeparator /> */}
              <DropdownMenuGroup>
                {row.getValue("status") !== "Disposed" && (
                  <DropdownMenuItem
                    asChild
                    onClick={(e) => {
                      onDisposeAction(row);
                      e.stopPropagation();
                    }}
                  >
                    <p>Dispose Sample</p>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  asChild
                  onClick={(e) => {
                    onDeleteAction(row);
                    e.stopPropagation();
                  }}
                >
                  <p
                    className={cn(
                      "hover:bg-rose-200 hover:text-rose-700 hover:outline-none",
                      "focus:bg-rose-200 focus:text-rose-700 focus:outline-none",
                      "dark:border-slate-900 dark:bg-slate-800 dark:text-white dark:hover:bg-rose-800 dark:hover:text-rose-300 dark:hover:outline-none",
                      "dark:hover:shadow dark:shadow-rose-400 dark:hover:shadow-rose-300",
                      "flex items-center justify-start space-x-2 w-full text-rose-500"
                    )}
                  >
                    Delete Sample
                  </p>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

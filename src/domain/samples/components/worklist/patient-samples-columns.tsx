"use client";

import { Kbd } from "@/components";
import { HorizontalEllipsis } from "@/components/svgs";
import {
  SampleDto,
  SampleForUpdateDto,
  SampleForm,
  SampleStatus,
  SampleStatusBadge,
  useUpdateSample,
} from "@/domain/samples";
import { cn } from "@/lib/utils";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { DataTableColumnHeader } from "../../../../components/data-table/data-table-column-header";
type ColumnsWithDeleteCallback = ColumnDef<SampleDto> & {
  onDeleteAction?: (row: Row<SampleDto>) => void;
  onDisposeAction?: (row: Row<SampleDto>) => void;
  onEditAction?: (row: Row<SampleDto>) => void;
};

export const sampleTableColumns = (
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
      const [isOpen, setIsOpen] = useState(false);
      const [isDropdownOpen, setIsDropdownOpen] = useState(false);
      const sampleId = row.getValue("id") as string;
      const updateSampleApi = useUpdateSample();

      useHotkeys(
        "e",
        () => {
          setIsOpen(true);
          setIsDropdownOpen(false);
        },
        {
          enabled: isDropdownOpen,
        }
      );

      return (
        <div className="flex items-center justify-center w-8" key={sampleId}>
          <Dropdown isOpen={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownTrigger>
              <div
                className={cn(
                  "inline-flex items-center px-2 py-2 text-sm font-medium leading-5 transition duration-100 ease-in bg-white rounded-full hover:shadow",
                  "hover:bg-slate-100 hover:text-slate-800 hover:outline-none text-slate-700",
                  "sm:p-3 dark:hover:shadow dark:shadow-slate-400 dark:hover:shadow-slate-300"
                )}
              >
                <HorizontalEllipsis className="w-4 h-4" />
              </div>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Actions"
              onAction={(key) => {
                if (key === "edit") {
                  setIsOpen(true);
                }
                if (key === "dispose") {
                  onDisposeAction(row);
                }
                if (key === "delete") {
                  onDeleteAction(row);
                }
              }}
            >
              <DropdownItem key="edit">
                <div className="flex items-center justify-between w-full">
                  <p>Edit Sample</p>
                  <Kbd command={"E"} />
                </div>
              </DropdownItem>
              <DropdownItem
                key="dispose"
                className={cn(
                  row.getValue("status") === "Disposed" && "hidden"
                )}
              >
                <p>Dispose Sample</p>
              </DropdownItem>
              <DropdownItem
                key="delete"
                className={cn(
                  "data-[hover]:bg-rose-200 data-[hover]:text-rose-700 data-[hover]:outline-none",
                  "focus:bg-rose-200 focus:text-rose-700 focus:outline-none",
                  "dark:border-slate-900 dark:bg-slate-800 dark:text-white dark:data-[hover]:bg-rose-800 dark:data-[hover]:text-rose-300 dark:data-[hover]:outline-none",
                  "dark:data-[hover]:shadow dark:shadow-rose-400 dark:data-[hover]:shadow-rose-300",
                  "flex items-center justify-start space-x-2 w-full text-rose-500"
                )}
              >
                <p>Delete Sample</p>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Edit Sample
                  </ModalHeader>
                  <ModalBody>
                    <SampleForm
                      sampleId={sampleId}
                      onSubmit={(value) => {
                        const dto = { ...value } as SampleForUpdateDto;
                        updateSampleApi
                          .mutateAsync({ data: dto, id: sampleId })
                          .then(() => {
                            setIsOpen(false);
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      }}
                    />
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      );
    },
  },
];

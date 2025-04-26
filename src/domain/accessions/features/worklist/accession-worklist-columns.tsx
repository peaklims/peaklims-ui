"use client";

import AccessionStatusBadge from "@/domain/accessions/components/status-badge";
import {
  AccessionStatus,
  AccessionWorklistDto,
} from "@/domain/accessions/types";
import { getFullName, getSexDisplay } from "@/domain/patients/patient.services";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../../../components/data-table/data-table-column-header";

export const columns: ColumnDef<AccessionWorklistDto>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    accessorKey: "accessionNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Accession Number" />
    ),
    cell: ({ row }) => {
      const accessionNumber = row.getValue("accessionNumber") as string;
      const accessionStatus = row.getValue("status");
      return (
        <div className="flex items-center space-x-3">
          <p className="inline-flex">{accessionNumber}</p>

          <AccessionStatusBadge
            status={accessionStatus as AccessionStatus}
            className="inline-flex"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "patient",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Patient" canSort={false} />
    ),
    cell: ({ row }) => {
      const patient = row.getValue("patient") as {
        firstName: string;
        lastName: string;
        age: number | null | undefined;
        sex: string;
      };
      const name = getFullName(patient?.firstName, patient?.lastName);
      const hasName = name.length > 0;
      const sexDisplay = getSexDisplay(patient?.sex);

      return (
        <div className="flex flex-col space-y-0.5">
          <p className="">{hasName ? name : "—"}</p>
          {(patient?.age ?? -1) >= 0 ? (
            <p className="text-xs text-slate-700">
              {patient?.age} year old {sexDisplay}
            </p>
          ) : null}
        </div>
      );
    },
  },
  {
    accessorKey: "organizationName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Organization" />
    ),
    cell: ({ row }) => {
      const organizationName = row.getValue("organizationName") as string;
      return (organizationName?.length ?? 0) > 0 ? (
        <p>{organizationName}</p>
      ) : (
        "—"
      );
    },
  },
];

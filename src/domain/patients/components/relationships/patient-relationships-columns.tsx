import { ColumnDef } from "@tanstack/react-table";
import { PatientRelationshipDto } from "../../types/patient-relationship";

export const relationshipTableColumns = (
  patientId: string
): ColumnDef<PatientRelationshipDto>[] => [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    id: "relatedPatient",
    header: "Related Patient",
    accessorFn: (row) => {
      const patient =
        row.fromPatient.id === patientId ? row.toPatient : row.fromPatient;
      return `${patient.firstName} ${patient.lastName}`;
    },
  },
  {
    id: "relationship",
    header: "Relationship",
    accessorFn: (row) => {
      return row.fromPatient.id === patientId
        ? row.toRelationship
        : row.fromRelationship;
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
];

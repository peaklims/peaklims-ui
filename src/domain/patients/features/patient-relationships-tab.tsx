import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetPatientRelationships } from "../apis/get-patient-relationships";
import { PatientRelationships } from "../components/relationships/patient-relationships";
import { relationshipTableColumns } from "../components/relationships/patient-relationships-columns";

interface PatientRelationshipsTabProps {
  patientId: string;
}

export function PatientRelationshipsTab({
  patientId,
}: PatientRelationshipsTabProps) {
  const { data: relationships, isLoading } =
    useGetPatientRelationships(patientId);
  const columns = relationshipTableColumns(patientId);

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center p-4">Loading...</div>
  //   );
  // }

  // if (!relationships?.length) {
  //   return (
  //     <div className="flex items-center justify-center p-4">
  //       No relationships found for this patient.
  //     </div>
  //   );
  // }

  return (
    <div className="">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-xl font-semibold tracking-tight">
          Manage Patient Relationships
        </h3>
        {/* <AddSampleButton patientId={patientId} /> */}
      </div>

      <div className="pt-3">
        <PatientRelationships
          columns={columns}
          data={relationships ?? []}
          isLoading={isLoading}
        />
        {/* <PatientRelationshipsTable patientId={patientId} /> */}
      </div>
    </div>
  );
}

export function PatientRelationshipsTable({
  patientId,
}: PatientRelationshipsTabProps) {
  const { data: relationships, isLoading } =
    useGetPatientRelationships(patientId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">Loading...</div>
    );
  }

  if (!relationships?.length) {
    return (
      <div className="flex items-center justify-center p-4">
        No relationships found for this patient.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Related Patient</TableHead>
          <TableHead>Relationship</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {relationships.map((relationship) => (
          <TableRow key={relationship.id}>
            {patientId === relationship.fromPatient.id ? (
              <>
                <TableCell>
                  {relationship.toPatient.firstName}{" "}
                  {relationship.toPatient.lastName}
                </TableCell>
                <TableCell>{relationship.toRelationship}</TableCell>
              </>
            ) : (
              <>
                <TableCell>
                  {relationship.fromPatient.firstName}{" "}
                  {relationship.fromPatient.lastName}
                </TableCell>
                <TableCell>{relationship.fromRelationship}</TableCell>
              </>
            )}
            <TableCell>{relationship.notes}</TableCell>
          </TableRow>

          // No relationships found for this patient.
        ))}
      </TableBody>
    </Table>
  );
}

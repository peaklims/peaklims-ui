import { EditableAccessionDto } from "@/domain/accessions/types";
import {
  EmptyPatientCard,
  PatientCard,
  PatientCardProvider,
} from "@/domain/patients/components/patient-cards";
import { PatientForCard } from "@/domain/patients/components/patient-cards/add-patient-button";
import { LoadingPatientCard } from "./patient-cards/patient-cards";

export function ManageAccessionPatientCard({
  accession,
}: {
  accession: EditableAccessionDto | undefined;
}) {
  if (accession == undefined) return <LoadingPatientCard />;

  const accessionId = accession?.id;
  return (
    <PatientCardProvider accessionId={accessionId}>
      <>
        {accession?.patient ? (
          <PatientCard
            patientInfo={
              {
                id: accession?.patient?.id,
                firstName: accession?.patient?.firstName,
                lastName: accession?.patient?.lastName,
                age: accession?.patient?.age,
                dateOfBirth: accession?.patient?.dateOfBirth,
                internalId: accession?.patient?.internalId,
                race: accession?.patient?.race,
                ethnicity: accession?.patient?.ethnicity,
                sex: accession?.patient?.sex,
              } as PatientForCard
            }
          />
        ) : (
          <EmptyPatientCard />
        )}
      </>
    </PatientCardProvider>
  );
}

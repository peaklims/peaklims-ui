import { useGetAccessionForEdit } from "@/domain/accessions/apis/get-editable-aggregate";
import { useRemoveAccessionPatient } from "@/domain/accessions/apis/remove-accession-patient";
import { useParams } from "@tanstack/react-router";
import { Helmet } from "react-helmet";
import {
  EmptyPatientCard,
  PatientCard,
  PatientForCard,
} from "../../domain/patients/components/patient-card";

export function EditAccessionPage() {
  const queryParams = useParams();
  const accessionId = queryParams.accessionId;
  const { data: accession } = useGetAccessionForEdit(accessionId);

  const accessionNumber = accession?.accessionNumber ?? "";
  const accessionNumberTitle = accessionNumber ? ` - ${accessionNumber}` : "";

  const removeAccessionApi = useRemoveAccessionPatient();
  function removePatientFromAccession() {
    removeAccessionApi.mutateAsync(accessionId!).then(() => {
      // TODO toast
    });
  }
  return (
    <div className="">
      <Helmet>
        <title>Edit Accession {accessionNumberTitle}</title>
      </Helmet>

      <div className="flex items-center justify-start w-full space-x-4">
        <h1 className="text-4xl font-bold tracking-tight scroll-m-20">
          Edit Accession
        </h1>
        <p className="max-w-[12rem] rounded-lg border border-slate-400 bg-gradient-to-r from-slate-200 to-slate-300/80 px-2 py-1 font-bold text-sm text-slate-900 shadow-md">
          {accession?.accessionNumber}
        </p>
      </div>

      <div className="flex items-center justify-center w-full pt-3 md:block">
        <div className="space-y-10">
          {accession?.patient ? (
            <PatientCard
              onRemovePatient={removePatientFromAccession}
              onEditPatient={() =>
                alert(`Edit patient ${accession.patient?.id}`)
              }
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
            <EmptyPatientCard accessionId={accessionId} />
          )}
        </div>
      </div>
    </div>
  );
}

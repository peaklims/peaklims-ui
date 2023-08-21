import { useParams } from "@tanstack/react-router";
import { Helmet } from "react-helmet";
import {
  EmptyPatientCard,
  PatientCard,
} from "../../domain/patients/components/patient-card";

export function EditAccessionPage() {
  const accession = { accessionNumber: "ACC-000000000TBD" }; // get accession aggregate
  const queryParams = useParams();
  const accessionId = queryParams.accessionId;

  return (
    <div className="">
      <Helmet>
        <title>Edit Accession - {accession.accessionNumber}</title>
      </Helmet>

      <div className="flex items-center justify-start w-full space-x-4">
        <h1 className="text-4xl font-bold tracking-tight scroll-m-20">
          Edit Accession
        </h1>
        <p className="max-w-[12rem] rounded-lg border border-slate-400 bg-gradient-to-r from-slate-200 to-slate-300/80 px-2 py-1 font-bold text-sm text-slate-900 shadow-md">
          {accession.accessionNumber}
        </p>
      </div>

      <div className="flex items-center justify-center w-full pt-3 md:block">
        <div className="space-y-10">
          <PatientCard />
          <EmptyPatientCard accessionId={accessionId} />
        </div>
      </div>
    </div>
  );
}

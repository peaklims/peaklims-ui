import { Helmet } from "react-helmet";
import { PatientCard } from "../../domain/patients/components/patient-card";

export function EditAccessionPage() {
  return (
    <div className="">
      <Helmet>
        <title>Edit Accession</title>
      </Helmet>

      <h1 className="text-4xl font-bold tracking-tight scroll-m-20">
        Edit Accession
      </h1>

      <div className="flex items-center justify-center w-full pt-3 md:block">
        <PatientCard />
      </div>
    </div>
  );
}

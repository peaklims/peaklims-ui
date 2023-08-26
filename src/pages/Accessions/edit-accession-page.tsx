import {
  VerticalTabs,
  VerticalTabsContent,
  VerticalTabsList,
  VerticalTabsTrigger,
} from "@/components/ui/vertical-tabs";
import { useGetAccessionForEdit } from "@/domain/accessions/apis/get-editable-aggregate";
import { ManageAccessionPatientCard } from "@/domain/patients/components/manage-accession-patient";
import { useParams } from "@tanstack/react-router";
import { Helmet } from "react-helmet";

export function EditAccessionPage() {
  const queryParams = useParams();
  const accessionId = queryParams.accessionId;
  const { data: accession } = useGetAccessionForEdit(accessionId);

  const accessionNumber = accession?.accessionNumber ?? "";
  const accessionNumberTitle = accessionNumber ? ` - ${accessionNumber}` : "";

  return (
    <div className="">
      <Helmet>
        <title>Edit Accession {accessionNumberTitle}</title>
      </Helmet>

      <div className="flex items-center justify-start w-full space-x-4">
        <h1 className="text-4xl font-bold tracking-tight scroll-m-20">
          Edit Accession
        </h1>
        {accession && (
          <p className="max-w-[12rem] rounded-lg border border-slate-400 bg-gradient-to-r from-slate-200 to-slate-300/80 px-2 py-1 font-bold text-sm text-slate-900 shadow-md">
            {accession?.accessionNumber}
          </p>
        )}
      </div>

      <div className="flex items-center justify-center w-full pt-3 md:block">
        <div className="space-y-10">
          <div>
            <h2 className="sr-only">Accession Patient</h2>
            <ManageAccessionPatientCard accession={accession} />
          </div>
          <div>
            {accession?.patient?.id ? (
              <>
                <h2 className="text-3xl">Accession Details</h2>
                <div className="pt-3">
                  <OrganizationManagement accessionId={accessionId} />
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrganizationManagement({ accessionId }: { accessionId: string }) {
  return (
    <VerticalTabs
      defaultValue="organization"
      className="sm:flex"
      orientation="vertical"
    >
      <VerticalTabsList>
        <VerticalTabsTrigger value="organization">
          Organization
        </VerticalTabsTrigger>
        <VerticalTabsTrigger value="samples">Samples</VerticalTabsTrigger>
        <VerticalTabsTrigger value="panels-and-tests">
          Panels and Tests
        </VerticalTabsTrigger>
        <VerticalTabsTrigger value="attachments">
          Attachments
        </VerticalTabsTrigger>
        <VerticalTabsTrigger value="comments">Comments</VerticalTabsTrigger>
      </VerticalTabsList>
      <VerticalTabsContent
        value="organization"
        className="h-[50rem] overflow-auto px-6 py-4 bg-rose-200"
      >
        <h3 className="text-xl font-semibold tracking-tight">
          Organization Details
        </h3>
        <p>Make changes to your org here.</p>
      </VerticalTabsContent>
      <VerticalTabsContent
        value="samples"
        className="h-[50rem] overflow-auto px-6 py-4 bg-rose-300"
      >
        Make changes to your samples here.
      </VerticalTabsContent>
      <VerticalTabsContent
        value="panels-and-tests"
        className="h-[50rem] overflow-auto px-6 py-4 bg-rose-400"
      >
        Change your panels and tests here.
      </VerticalTabsContent>
      <VerticalTabsContent
        value="attachments"
        className="h-[50rem] overflow-auto px-6 py-4 bg-rose-500"
      >
        Change your attachments here.
      </VerticalTabsContent>
      <VerticalTabsContent
        value="comments"
        className="h-[50rem] overflow-auto px-6 py-4 bg-rose-600"
      >
        Change your comments here.
      </VerticalTabsContent>
    </VerticalTabs>
  );
}

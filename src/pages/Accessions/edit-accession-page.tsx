import {
  VerticalTabs,
  VerticalTabsContent,
  VerticalTabsList,
  VerticalTabsTrigger,
} from "@/components/ui/vertical-tabs";
import { useGetAccessionForEdit } from "@/domain/accessions/apis/get-editable-aggregate";
import AccessionStatusBadge from "@/domain/accessions/features/status-badge";
import {
  AccessionContactDto,
  AccessionStatus,
} from "@/domain/accessions/types";
import { AccessionOrganizationForm } from "@/domain/organizations/features/manage-accession-org";
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
        <h1 className="flex items-center justify-start text-4xl font-bold tracking-tight scroll-m-20">
          Edit Accession{" "}
          <span className="pl-2 text-2xl">({accession?.accessionNumber})</span>
        </h1>
        {accession && (
          <AccessionStatusBadge status={accession?.status as AccessionStatus} />
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
                  <AccessionDetails
                    accessionId={accessionId}
                    organizationId={accession?.organizationId}
                    accessionContacts={accession.accessionContacts}
                  />
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function AccessionDetails({
  accessionId,
  organizationId,
  accessionContacts,
}: {
  accessionId: string | undefined;
  organizationId: string | undefined;
  accessionContacts: AccessionContactDto[] | undefined;
}) {
  return (
    <VerticalTabs
      defaultValue="organization"
      className=""
      orientation="vertical"
    >
      <VerticalTabsList className="shadow-md">
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
        className="h-[50rem] overflow-auto px-6 py-4 shadow-md"
      >
        <h3 className="text-xl font-semibold tracking-tight">
          Organization Details
        </h3>
        <AccessionOrganizationForm
          accessionContacts={accessionContacts}
          accessionId={accessionId}
          organizationId={organizationId}
        />
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

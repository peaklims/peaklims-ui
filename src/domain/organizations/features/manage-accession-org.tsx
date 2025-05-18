import { AccessionContactDto } from "@/domain/accessions/types";
import { ContactsManager } from "./contacts-manager";
import { OrganizationSelector } from "./organization-selector";

export function AccessionOrganizationForm({
  accessionId,
  organizationId,
  accessionContacts,
  orgs,
  orgsAreLoading,
}: {
  accessionId?: string;
  organizationId?: string;
  accessionContacts?: AccessionContactDto[];
  orgs?: { value: string; label: string; disabled?: boolean }[];
  orgsAreLoading: boolean;
}) {
  return (
    <div className="pt-1">
      <OrganizationSelector
        accessionId={accessionId}
        organizationId={organizationId}
        orgs={orgs}
        orgsAreLoading={orgsAreLoading}
      />
      <ContactsManager
        accessionId={accessionId}
        organizationId={organizationId}
        accessionContacts={accessionContacts}
      />
    </div>
  );
}

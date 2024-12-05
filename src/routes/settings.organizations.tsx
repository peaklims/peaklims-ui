import { Button } from "@/components/ui/button";
import { Combobox, getLabelById } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetContactsByOrganization } from "@/domain/organization-contacts/apis/get-all-contacts-by-organization";
import { useGetAllOrganizations } from "@/domain/organizations/apis/get-all-organizations";
import { OrganizationDto } from "@/domain/organizations/types";
import { useDebouncedValue } from "@/hooks";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Item } from "react-stately";

export const Route = createFileRoute("/settings/organizations")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: organizations = [] } = useGetAllOrganizations();
  const [selectedOrg, setSelectedOrg] = useState<OrganizationDto | null>();
  const [inputValue, setInputValue] = useState<string | undefined>();

  const orgOptions = organizations.map((org) => ({
    value: org.id,
    label: org.name,
  }));

  useEffect(() => {
    if (organizations.length > 0 && !selectedOrg) {
      const firstOrg = organizations[0];
      setSelectedOrg(firstOrg);
      setInputValue(firstOrg.name);
    }
  }, [organizations, selectedOrg]);

  const handleCreateOrg = () => {
    console.log("Create new organization clicked");
  };
  const handleEditOrg = ({ organizationId }: { organizationId: string }) => {
    console.log("Edit organization clicked", organizationId);
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Organizations</h1>
      </div>

      <div className="flex flex-col flex-1 min-h-0 border rounded-lg">
        <div className="flex items-center gap-2 p-4 border-b">
          <div className="w-[300px]">
            <Combobox
              autoFocus={true}
              label="Organization"
              inputValue={inputValue}
              onInputChange={(value) => {
                setInputValue(value);
              }}
              onClear={() => {
                setSelectedOrg(null);
                setInputValue("");
              }}
              selectedKey={selectedOrg?.id}
              onSelectionChange={(key) => {
                const org = organizations.find((o) => o.id === key);
                setSelectedOrg(org ?? null);
                setInputValue(
                  getLabelById({
                    id: key?.toString() ?? "",
                    data: orgOptions,
                  })
                );
              }}
            >
              {orgOptions.map((org) => (
                <Item key={org.value} textValue={org.label}>
                  {org.label}
                </Item>
              ))}
            </Combobox>
          </div>
          <Button
            variant="default"
            size="sm"
            disabled={!selectedOrg}
            onClick={() => handleEditOrg({ organizationId: selectedOrg!.id })}
          >
            Edit
          </Button>
          <Button variant="secondary" size="sm" onClick={handleCreateOrg}>
            Add
          </Button>
        </div>

        {selectedOrg && <ContactsList organizationId={selectedOrg.id} />}
      </div>
    </div>
  );
}

function ContactsList({ organizationId }: { organizationId: string | null }) {
  const { data: contacts = [] } = useGetContactsByOrganization(organizationId);
  const [contactFilter, setContactFilter] = useState("");
  const [debouncedContactFilter] = useDebouncedValue(contactFilter, 300);

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.firstName
        .toLowerCase()
        .includes(debouncedContactFilter.toLowerCase()) ||
      contact.lastName
        .toLowerCase()
        .includes(debouncedContactFilter.toLowerCase()) ||
      contact.email
        .toLowerCase()
        .includes(debouncedContactFilter.toLowerCase()) ||
      (contact.npi &&
        contact.npi
          .toLowerCase()
          .includes(debouncedContactFilter.toLowerCase()))
  );

  if (contacts.length === 0) {
    return <div className="p-4 text-gray-500">No contacts found</div>;
  }

  const handleCreateContact = () => {
    console.log("Create new contact clicked");
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="flex p-2 space-x-3 border-b">
        <div className="w-full md:w-96">
          <Input
            placeholder="Filter contacts..."
            value={contactFilter}
            onChange={(e) => setContactFilter(e.target.value)}
            className="h-8"
          />
        </div>
        <div className="w-36 md:w-96">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCreateContact}
            disabled={organizationId === null}
          >
            Add Contact
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>NPI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="font-medium">
                <button
                  onClick={() => console.log("Edit contact:", contact.id)}
                  className="text-sm font-medium text-sky-600 hover:underline hover:text-sky-700"
                >
                  {contact.firstName} {contact.lastName}
                </button>
              </TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell className="text-sm text-gray-500">
                {contact.npi || "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

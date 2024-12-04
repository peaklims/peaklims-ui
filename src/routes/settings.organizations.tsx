import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetContactsByOrganization } from "@/domain/organization-contacts/apis/get-all-contacts-by-organization";
import { useGetAllOrganizations } from "@/domain/organizations/apis/get-all-organizations";
import { OrganizationDto } from "@/domain/organizations/types";
import { useDebouncedValue } from "@/hooks/use-debounced-value.tsx";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/settings/organizations")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: organizations = [] } = useGetAllOrganizations();
  const [selectedOrg, setSelectedOrg] = useState<OrganizationDto | null>();
  const [orgFilter, setOrgFilter] = useState("");
  const [debouncedOrgFilter] = useDebouncedValue(orgFilter, 300);

  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(debouncedOrgFilter.toLowerCase())
  );

  useEffect(() => {
    if (filteredOrganizations.length > 0 && !selectedOrg) {
      setSelectedOrg(filteredOrganizations[0]);
    }
  }, [filteredOrganizations, selectedOrg]);

  const handleCreateOrg = () => {
    console.log("Create new organization clicked");
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Organizations</h1>
      </div>

      <div className="grid flex-1 min-h-0 grid-cols-3 gap-4">
        <div className="flex flex-col col-span-2 border rounded-lg max-h-[calc(100vh-18rem)]">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Organizations</h2>
            <Button variant="secondary" size="sm" onClick={handleCreateOrg}>
              Add
            </Button>
          </div>
          <div className="p-2 border-b">
            <Input
              autoFocus={true}
              placeholder="Filter organizations..."
              value={orgFilter}
              onChange={(e) => setOrgFilter(e.target.value)}
              className="h-8"
            />
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-0 overflow-y-auto ">
              {filteredOrganizations.map((org) => (
                <div
                  key={org.id}
                  className={`p-3 rounded cursor-pointer hover:bg-gray-100 ${
                    selectedOrg?.id === org.id ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setSelectedOrg(org)}
                >
                  <div className="font-medium">{org.name}</div>
                  <div className="text-xs text-gray-400">{org.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col col-span-1 border rounded-lg max-h-[calc(100vh-18rem)]">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Contacts</h2>
            <Button variant="secondary" size="sm" disabled={!selectedOrg}>
              Add
            </Button>
          </div>
          {selectedOrg && <ContactsList organizationId={selectedOrg.id} />}
        </div>
      </div>
    </div>
  );
}

function ContactsList({ organizationId }: { organizationId: string }) {
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

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="p-2 border-b">
        <Input
          placeholder="Filter contacts..."
          value={contactFilter}
          onChange={(e) => setContactFilter(e.target.value)}
          className="h-8"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead className="w-[100px]"></TableHead>
            <TableHead>Name</TableHead> */}
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
                <p className="text-xs text-gray-400">{contact.email}</p>
                <p className="text-xs text-gray-400">{contact.npi}</p>
              </TableCell>
              {/* <TableCell>{contact.email}</TableCell>
              <TableCell className="text-sm text-gray-500">
                {contact.npi || "-"}
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

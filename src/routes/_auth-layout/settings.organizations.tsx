import { Button } from '@/components/ui/button'
import { Combobox, getLabelById } from '@/components/ui/combobox'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useGetContactsByOrganization } from '@/domain/organization-contacts/apis/get-all-contacts-by-organization'
import { OrganizationContactModal } from '@/domain/organization-contacts/features/organization-contact-modal'
import { OrganizationContactDto } from '@/domain/organization-contacts/types'
import { useGetAllOrganizations } from '@/domain/organizations/apis/get-all-organizations'
import { OrganizationModal } from '@/domain/organizations/features/organization-modal'
import { OrganizationDto } from '@/domain/organizations/types'
import { useDebouncedValue } from '@/hooks'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Item } from 'react-stately'

export const Route = createFileRoute('/_auth-layout/settings/organizations')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: organizations = [] } = useGetAllOrganizations()
  const [selectedOrg, setSelectedOrg] = useState<OrganizationDto | null>()
  const [inputValue, setInputValue] = useState<string | undefined>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [organizationToEdit, setOrganizationToEdit] =
    useState<OrganizationDto>()

  const orgOptions = organizations.map((org) => ({
    value: org.id,
    label: org.name,
  }))

  useEffect(() => {
    if (organizations.length > 0 && selectedOrg === undefined) {
      const firstOrg = organizations[0]
      setSelectedOrg(firstOrg)
      setInputValue(firstOrg.name)
      return
    }
    if (selectedOrg) {
      setInputValue(selectedOrg.name)
    }
  }, [organizations, selectedOrg])

  const handleCreateOrg = () => {
    setOrganizationToEdit(undefined)
    setIsModalOpen(true)
  }

  const handleEditOrg = () => {
    if (selectedOrg) {
      setOrganizationToEdit(selectedOrg)
      setIsModalOpen(true)
    }
  }

  const handleOrganizationSuccess = (organization: OrganizationDto) => {
    setOrganizationToEdit(undefined)
    setSelectedOrg(organization)
    setInputValue(organization.name)
  }

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
                setInputValue(value)
              }}
              onClear={() => {
                setSelectedOrg(null)
                setInputValue('')
              }}
              selectedKey={selectedOrg?.id}
              onSelectionChange={(key) => {
                const org = organizations.find((o) => o.id === key)
                setSelectedOrg(org ?? null)
                setInputValue(
                  getLabelById({
                    id: key?.toString() ?? '',
                    data: orgOptions,
                  }),
                )
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
            onClick={handleEditOrg}
          >
            Edit
          </Button>
          <Button variant="secondary" size="sm" onClick={handleCreateOrg}>
            Add
          </Button>
        </div>

        {selectedOrg && <ContactsList organizationId={selectedOrg.id} />}
      </div>

      <OrganizationModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        organization={organizationToEdit}
        onSuccess={handleOrganizationSuccess}
      />
    </div>
  )
}

function ContactsList({ organizationId }: { organizationId: string | null }) {
  const { data: contacts = [] } = useGetContactsByOrganization(organizationId)
  const [contactFilter, setContactFilter] = useState('')
  const [debouncedContactFilter] = useDebouncedValue(contactFilter, 300)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [contactToEdit, setContactToEdit] = useState<OrganizationContactDto>()

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
          .includes(debouncedContactFilter.toLowerCase())),
  )

  const handleCreateContact = () => {
    setContactToEdit(undefined)
    setIsContactModalOpen(true)
  }

  const handleEditContact = (contact: OrganizationContactDto) => {
    setContactToEdit(contact)
    setIsContactModalOpen(true)
  }

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 mt-2 space-y-4 text-gray-500 md:mt-10">
        <button
          onClick={handleCreateContact}
          className="flex flex-col items-center justify-center p-10 space-y-4 border border-dashed rounded-lg cursor-pointer border-slate-300 hover:border-slate-500 hover:text-slate-700"
        >
          {/* https://iconbuddy.com/solar/user-plus-linear */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={200}
            height={200}
            viewBox="0 0 24 24"
            className="w-8 h-8"
          >
            <g fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx={12} cy={6} r={4} />
              <path d="M15 13.327A13.57 13.57 0 0 0 12 13c-4.418 0-8 2.015-8 4.5S4 22 12 22c5.687 0 7.331-1.018 7.807-2.5" />
              <circle cx={18} cy={16} r={4} />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 14.667v2.666M16.666 16h2.667"
              />
            </g>
          </svg>

          <p>No contacts found, click here add your first contact</p>
        </button>
      </div>
    )
  }

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
          {filteredContacts?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3}>
                <div className="flex items-center justify-center pt-4">
                  <p>No contacts found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <>
              {filteredContacts
                .sort((a, b) =>
                  a.lastName === b.lastName
                    ? a.firstName.localeCompare(b.firstName)
                    : a.lastName.localeCompare(b.lastName),
                )
                .map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">
                      <button
                        onClick={() => handleEditContact(contact)}
                        className="text-sm font-medium text-sky-600 hover:underline hover:text-sky-700"
                      >
                        {contact.lastName}, {contact.firstName}
                      </button>
                    </TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {contact.npi || '-'}
                    </TableCell>
                  </TableRow>
                ))}
            </>
          )}
        </TableBody>
      </Table>

      <OrganizationContactModal
        isOpen={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
        organizationContact={contactToEdit}
        organizationId={organizationId ?? ''}
        onSuccess={() => {
          setContactToEdit(undefined)
        }}
      />
    </div>
  )
}

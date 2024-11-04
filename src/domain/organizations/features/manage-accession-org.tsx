import { Notification } from "@/components/notifications";
import { Button } from "@/components/ui/button";
import { Combobox, getLabelById } from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAddAccessionContact } from "@/domain/accession-contacts/apis/add-accession-contact";
import { useRemoveAccessionContact } from "@/domain/accession-contacts/apis/remove-accession-contact";
import { useGetAccessionForEdit } from "@/domain/accessions";
import { useSetAccessionOrganization } from "@/domain/accessions/apis/set-accession-org";
import { AccessionContactDto } from "@/domain/accessions/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailMinus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Item } from "react-stately";
import { z } from "zod";
import { useGetContactsByOrganization } from "../../organization-contacts/apis/get-all-contacts-by-organization";

const orgFormSchema = z.object({
  organization: z.string({
    required_error: "Organization is required",
    invalid_type_error: "Organization is required",
  }),
});

type OrgFormData = z.infer<typeof orgFormSchema>;

export function AccessionOrganizationForm({
  accessionId,
  organizationId,
  accessionContacts,
  orgs,
  orgsAreLoading,
}: {
  accessionId: string | undefined;
  organizationId: string | undefined;
  accessionContacts: AccessionContactDto[] | undefined;
  orgs:
    | {
        value: string;
        label: string;
        disabled?: boolean;
      }[]
    | undefined;
  orgsAreLoading: boolean;
}) {
  const onlyActiveOrgsThatAreNotSelected = orgs?.filter(
    (org) => !org.disabled || org.value === organizationId
  );

  const organizationForm = useForm<OrgFormData>({
    resolver: zodResolver(orgFormSchema),
    defaultValues: {
      organization: organizationId ?? "",
    },
  });

  const setOrganizationApi = useSetAccessionOrganization();
  const onSubmit = (data: OrgFormData) => {
    console.log("data", data);
    if (!data.organization || accessionId === undefined) return;

    setOrganizationApi.mutateAsync({
      accessionId: accessionId,
      organizationId: data.organization.toString(),
    });
  };
  const [inputValue, setInputValue] = useState<string | undefined>();

  const { data: accession } = useGetAccessionForEdit(accessionId);
  const isDraftAccession = accession?.status === "Draft";

  const { data: orgContacts } = useGetContactsByOrganization(
    organizationId ?? ""
  );

  const accessionContactIds = new Set(
    accessionContacts?.map((contact) => contact.organizationContactId)
  );

  const filteredOrgContacts = orgContacts?.filter(
    (orgContact) => !accessionContactIds.has(orgContact.id)
  );

  const contactOptions = filteredOrgContacts?.map((contact) => ({
    value: contact.id,
    label: `${contact.firstName} ${contact.lastName}`.trim(),
  }));

  const contactFormSchema = z.object({
    contactId: z.string().nonempty("Please select a contact"),
  });

  const contactForm = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      contactId: "",
    },
  });

  const addAccessionContactApi = useAddAccessionContact();

  const onContactSubmit = (data: { contactId: string }) => {
    addAccessionContactApi
      .mutateAsync({
        accessionId: accessionId ?? "",
        organizationContactId: data.contactId,
      })
      .then(() => {
        contactForm.reset();
      })
      .catch((err) => {
        Notification.error(
          "There was an error adding this contact to the Accession"
        );
        console.error(err);
      });
  };

  return (
    <div className="pt-1">
      <Form {...organizationForm}>
        <form onSubmit={organizationForm.handleSubmit(onSubmit)}>
          <FormField
            control={organizationForm.control}
            name="organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel required={false}>Organization</FormLabel>
                <FormControl>
                  <Combobox
                    classNames={{
                      wrapper: "w-full md:w-[25rem]",
                    }}
                    isDisabled={orgsAreLoading || !isDraftAccession}
                    label={field.name}
                    clearable={true}
                    inputValue={inputValue}
                    onInputChange={(value) => {
                      setInputValue(value);
                    }}
                    selectedKey={field.value}
                    onSelectionChange={(key) => {
                      field.onChange(key);
                      setInputValue(
                        getLabelById({
                          id: key?.toString() ?? "",
                          data: onlyActiveOrgsThatAreNotSelected ?? [],
                        })
                      );
                      organizationForm.handleSubmit((data) => onSubmit(data))();
                    }}
                    disabledKeys={orgs
                      ?.filter((org) => org.disabled)
                      .map((org) => org.value)}
                  >
                    {onlyActiveOrgsThatAreNotSelected?.map((org) => (
                      <Item key={org.value} textValue={org.label}>
                        {org.label}
                      </Item>
                    ))}
                  </Combobox>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className="flex flex-col items-center justify-start w-full pt-3 space-y-12 sm:space-y-4">
        <div className="w-full">
          <h4 className="text-lg font-medium">Organization Contacts</h4>
          <Form {...contactForm}>
            <form
              onSubmit={contactForm.handleSubmit(onContactSubmit)}
              className="flex items-end w-full pt-1 space-x-2"
            >
              <FormField
                control={contactForm.control}
                name="contactId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel required={false}>Select Contact</FormLabel>
                    <FormControl>
                      <Combobox
                        classNames={{
                          wrapper: "w-full",
                        }}
                        isDisabled={!organizationId}
                        label={field.name}
                        selectedKey={field.value}
                        onSelectionChange={(key) => field.onChange(key)}
                        placeholder="Select a contact"
                      >
                        {contactOptions?.map((contact) => (
                          <Item key={contact.value} textValue={contact.label}>
                            {contact.label}
                          </Item>
                        ))}
                      </Combobox>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="mt-2"
                disabled={!organizationId || contactOptions?.length === 0}
              >
                Add Contact
              </Button>
            </form>
          </Form>
        </div>

        <div className="w-full px-1 pt-2 pb-1 space-y-1 overflow-hidden border rounded-lg shadow bg-slate-100">
          <h4 className="pl-2 text-lg font-medium">Accession Contacts</h4>
          <div className="p-1">
            <AccessionContacts
              accessionContacts={accessionContacts}
              accessionId={accessionId ?? ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function AccessionContacts({
  accessionContacts,
  accessionId,
}: {
  accessionContacts: AccessionContactDto[] | undefined;
  accessionId: string;
}) {
  const removeAccessionContactApi = useRemoveAccessionContact();

  return (
    <>
      {accessionContacts !== undefined &&
      (accessionContacts?.length ?? 0) > 0 ? (
        <div className="flex flex-col items-start w-full h-full space-y-2 ">
          {accessionContacts.map((contact) => {
            const name = [contact.firstName, contact.lastName].join(" ").trim();
            return (
              <div
                key={contact.id}
                className="flex flex-col w-full px-3 py-2 space-y-3 bg-white border rounded-md sm:flex-row sm:space-y-0"
              >
                <div className="flex items-center justify-start flex-1 pr-2">
                  <div className="">
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-xs">{contact.targetValue}</p>
                    {contact.npi?.length ?? 0 > 0 ? (
                      <p className="text-xs text-slate-400">
                        <span>#</span>
                        {contact.npi}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center justify-center w-full h-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="flex items-center justify-center w-full sm:w-auto"
                    onClick={() => {
                      removeAccessionContactApi
                        .mutateAsync({
                          accessionId: accessionId ?? "",
                          accessionContactId: contact.id,
                        })
                        .catch((err) => {
                          Notification.error(
                            "There was an error removing this contact from the Accession"
                          );
                          console.error(err);
                        });
                    }}
                  >
                    <MailMinus className="w-4 h-4 shrink-0" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-center">
            No one has been assigned as a contact for this accession yet
          </p>
        </div>
      )}
    </>
  );
}

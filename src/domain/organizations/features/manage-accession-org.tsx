import { Notification } from "@/components/notifications";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAddAccessionContact } from "@/domain/accession-contacts/apis/add-accession-contact";
// import { useGetContactsForAnAccession } from "@/domain/accession-contacts/apis/get-contacts-for-accession";
import { useRemoveAccessionContact } from "@/domain/accession-contacts/apis/remove-accession-contact";
import { useSetAccessionOrganization } from "@/domain/accessions/apis/set-accession-org";
import { AccessionContactDto } from "@/domain/accessions/types";
import { useGetAllOrganizationsForDropdown } from "@/domain/organizations/apis/get-all-organizations";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailMinus, MailPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useGetContactsByOrganization } from "../../organization-contacts/apis/get-all-contacts-by-organization";

const orgFormSchema = z.object({
  organization: z.string().optional(),
});

type OrgFormData = z.infer<typeof orgFormSchema>;

export function AccessionOrganizationForm({
  accessionId,
  organizationId,
  accessionContacts,
}: {
  accessionId: string | undefined;
  organizationId: string | undefined;
  accessionContacts: AccessionContactDto[] | undefined;
}) {
  const { data: orgs, isLoading: orgsAreLoading } =
    useGetAllOrganizationsForDropdown();

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

  // const { data: accessionContacts } = useGetContactsForAnAccession(accessionId);
  const { data: orgContacts } = useGetContactsByOrganization(
    organizationId ?? ""
  );
  const accessionContactIds = new Set(
    accessionContacts?.map((contact) => contact.organizationContactId)
  );
  const filteredOrgContacts = orgContacts?.filter(
    (orgContact) => !accessionContactIds.has(orgContact.id)
  );

  const addAccessionContactApi = useAddAccessionContact();
  const removeAccessionContactApi = useRemoveAccessionContact();

  return (
    <div className="pt-3">
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
                    {...field}
                    items={
                      onlyActiveOrgsThatAreNotSelected as {
                        value: string;
                        label: string;
                        disabled?: boolean;
                      }[]
                    }
                    buttonProps={{
                      className: "w-[25rem]",
                      disabled: orgsAreLoading,
                    }}
                    dropdownProps={{ className: "w-[25rem]" }}
                    onChange={(e) => {
                      field.onChange(e);
                      organizationForm.handleSubmit((data) => onSubmit(data))();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className="flex flex-col items-center justify-start w-full pt-3 space-y-12 sm:space-x-6 sm:flex-row sm:space-y-0">
        <div className="space-y-1 h-[20rem] sm:h-[36rem] w-full">
          <h4 className="text-lg font-medium">Organization Contacts</h4>
          <div className="w-full h-full p-3 border rounded-md shadow-md bg-slate-50">
            {filteredOrgContacts !== undefined &&
            (filteredOrgContacts?.length ?? 0) > 0 ? (
              <div className="flex flex-col items-start w-full h-full space-y-2 ">
                {filteredOrgContacts.map((contact) => {
                  const name = [contact.firstName, contact.lastName]
                    .join(" ")
                    .trim();
                  return (
                    // TODO make this a component
                    <div className="flex flex-col w-full px-3 py-2 space-y-3 bg-white rounded-md shadow-md sm:flex-row sm:space-y-0">
                      <div className="flex items-center justify-start flex-1 pr-2">
                        <div className="">
                          <p className="font-medium">{name}</p>
                          <p className="text-sm">{contact.email}</p>
                          {contact.npi.length > 0 ? (
                            <p className="text-sm text-slate-400">
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
                            addAccessionContactApi
                              .mutateAsync({
                                accessionId: accessionId ?? "",
                                organizationContactId: contact.id,
                              })
                              .catch((err) => {
                                Notification.error(
                                  "There was an error adding this contact to the Accession"
                                );
                                console.error(err);
                              });
                          }}
                        >
                          <MailPlus className="w-4 h-4 shrink-0" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <p className="text-center">
                  {accessionContacts?.length ?? 0 > 0
                    ? "There are no more organization contacts to assign"
                    : "This organization does not have any assignable contacts"}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1 h-[20rem] sm:h-[36rem] w-full">
          <h4 className="text-lg font-medium">Accession Contacts</h4>
          <div className="w-full h-full p-3 border rounded-md shadow-md bg-slate-50">
            {accessionContacts !== undefined &&
            (accessionContacts?.length ?? 0) > 0 ? (
              <div className="flex flex-col items-start w-full h-full space-y-2 ">
                {accessionContacts.map((contact) => {
                  const name = [contact.firstName, contact.lastName]
                    .join(" ")
                    .trim();
                  return (
                    // TODO make this a component
                    <div className="flex flex-col w-full px-3 py-2 space-y-3 bg-white rounded-md shadow-md sm:flex-row sm:space-y-0">
                      <div className="flex items-center justify-start flex-1 pr-2">
                        <div className="">
                          <p className="font-medium">{name}</p>
                          <p className="text-sm">{contact.targetValue}</p>
                          {contact.npi?.length ?? 0 > 0 ? (
                            <p className="text-sm text-slate-400">
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
          </div>
        </div>
      </div>
    </div>
  );
}

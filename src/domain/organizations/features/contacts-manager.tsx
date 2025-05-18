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
import { AccessionContactDto } from "@/domain/accessions/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Item } from "react-stately";
import { z } from "zod";
import { useGetContactsByOrganization } from "../../organization-contacts/apis/get-all-contacts-by-organization";
import { AccessionContacts } from "./accession-contacts";

const contactFormSchema = z.object({
  contactId: z.string().min(1, "Please select a contact"),
});
type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactsManagerProps {
  accessionId?: string;
  organizationId?: string;
  accessionContacts?: AccessionContactDto[];
}

export function ContactsManager({
  accessionId,
  organizationId,
  accessionContacts,
}: ContactsManagerProps) {
  const { data: orgContacts } = useGetContactsByOrganization(
    organizationId ?? ""
  );
  const used = new Set(accessionContacts?.map((c) => c.organizationContactId));
  const available = orgContacts?.filter((c) => !used.has(c.id));
  const options = available?.map((c) => ({
    value: c.id,
    label: `${c.firstName} ${c.lastName}`.trim(),
  }));

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { contactId: "" },
  });

  const addContact = useAddAccessionContact();

  const onSubmit = ({ contactId }: ContactFormData) => {
    if (!accessionId) return;
    addContact
      .mutateAsync({ accessionId, organizationContactId: contactId })
      .then(() => form.reset())
      .catch((err) => {
        Notification.error("Error adding contact");
        console.error(err);
      });
  };

  return (
    <div className="flex flex-col items-center w-full pt-3 space-y-12 sm:space-y-4">
      <div className="w-full">
        <h4 className="text-lg font-medium">Organization Contacts</h4>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-end w-full pt-1 space-x-2"
          >
            <FormField
              control={form.control}
              name="contactId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Select Contact</FormLabel>
                  <FormControl>
                    <Combobox
                      classNames={{ wrapper: "w-full" }}
                      label={field.name}
                      placeholder="Select a contact"
                      selectedKey={field.value}
                      onSelectionChange={field.onChange}
                      isDisabled={!organizationId || options?.length === 0}
                    >
                      {options?.map((opt) => (
                        <Item key={opt.value} textValue={opt.label}>
                          {opt.label}
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
              size="sm"
              variant="default"
              disabled={
                !form.getValues("contactId") ||
                !organizationId ||
                options?.length === 0
              }
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
  );
}

import { Notification } from "@/components/notifications";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAddOrganizationContact } from "../apis/add-organization-contact";
import { useUpdateOrganizationContact } from "../apis/update-organization-contact";
import { OrganizationContactDto } from "../types";

const organizationContactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  npi: z.string().optional(),
  title: z.string().optional(),
});

type OrganizationContactFormData = z.infer<
  typeof organizationContactFormSchema
>;

interface OrganizationContactModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  organizationContact?: OrganizationContactDto;
  organizationId: string;
  onSuccess?: (organizationContact: OrganizationContactDto) => void;
}

export function OrganizationContactModal({
  isOpen,
  onOpenChange,
  organizationContact,
  organizationId,
  onSuccess,
}: OrganizationContactModalProps) {
  const isEditing = !!organizationContact;

  const form = useForm<OrganizationContactFormData>({
    resolver: zodResolver(organizationContactFormSchema),
    defaultValues: {
      firstName: organizationContact?.firstName ?? "",
      lastName: organizationContact?.lastName ?? "",
      email: organizationContact?.email ?? "",
      npi: organizationContact?.npi ?? "",
      title: organizationContact?.title ?? "",
    },
  });

  // Reset form when contact changes
  useEffect(() => {
    if (organizationContact) {
      form.reset({
        firstName: organizationContact.firstName,
        lastName: organizationContact.lastName,
        email: organizationContact.email,
        npi: organizationContact.npi,
        title: organizationContact.title,
      });
    } else {
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        npi: "",
        title: "",
      });
    }
  }, [organizationContact, form]);

  const addOrganizationContactApi = useAddOrganizationContact();
  const updateOrganizationContactApi = useUpdateOrganizationContact();

  const onSubmit = async (data: OrganizationContactFormData) => {
    try {
      if (isEditing && organizationContact) {
        updateOrganizationContactApi.mutate(
          {
            id: organizationContact.id,
            data: { ...data, organizationId },
          },
          {
            onSuccess: () => {
              onSuccess?.({
                id: organizationContact.id,
                ...data,
              });
              onOpenChange(false);
              Notification.success("Contact updated successfully");
            },
          }
        );
      } else {
        addOrganizationContactApi.mutate(
          { ...data, healthcareOrganizationId: organizationId },
          {
            onSuccess: (newContact) => {
              onSuccess?.(newContact);
              onOpenChange(false);
              Notification.success("Contact created successfully");
            },
          }
        );
      }
    } catch (error) {
      Notification.error(
        isEditing ? "Failed to update contact" : "Failed to create contact"
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        base: "overflow-y-visible",
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="text-2xl font-semibold scroll-m-20">
              {isEditing ? "Edit" : "Add"} Contact
            </ModalHeader>
            <ModalBody className="px-6 pb-2 grow gap-y-5">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>First Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            autoFocus={true}
                            placeholder="Enter first name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter last name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required={true}>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter email address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="npi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NPI</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter NPI" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        addOrganizationContactApi.isPending ||
                        updateOrganizationContactApi.isPending
                      }
                    >
                      {isEditing ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </Form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

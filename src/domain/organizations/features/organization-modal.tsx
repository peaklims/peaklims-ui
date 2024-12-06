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
import { useAddOrganization } from "../apis/add-organization";
import { useUpdateOrganization } from "../apis/update-organization";
import { OrganizationDto } from "../types";

const organizationFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type OrganizationFormData = z.infer<typeof organizationFormSchema>;

interface OrganizationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  organization?: OrganizationDto;
  onSuccess?: (organization: OrganizationDto) => void;
}

export function OrganizationModal({
  isOpen,
  onOpenChange,
  organization,
  onSuccess,
}: OrganizationModalProps) {
  const isEditing = !!organization;

  const form = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: organization?.name ?? "",
    },
  });

  // Reset form when organization changes
  useEffect(() => {
    if (organization) {
      form.reset({
        name: organization.name,
      });
    } else {
      form.reset({
        name: "",
      });
    }
  }, [organization, form]);

  const addOrganizationApi = useAddOrganization();
  const updateOrganizationApi = useUpdateOrganization();

  const onSubmit = async (data: OrganizationFormData) => {
    try {
      if (isEditing) {
        updateOrganizationApi.mutate(
          { id: organization.id, data: { name: data.name } },
          {
            onSuccess: () => {
              onSuccess?.({ id: organization.id, name: data.name });
              onOpenChange(false);
              Notification.success("Organization updated successfully");
            },
          }
        );
      } else {
        addOrganizationApi.mutate(
          { name: data.name },
          {
            onSuccess: (newOrg) => {
              onSuccess?.(newOrg);
              onOpenChange(false);
              Notification.success("Organization created successfully");
            },
          }
        );
      }
    } catch (error) {
      Notification.error(
        isEditing
          ? "Failed to update organization"
          : "Failed to create organization"
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
              {isEditing ? "Edit" : "Add"} Organization
            </ModalHeader>
            <ModalBody className="px-6 pb-2 grow gap-y-5">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            autoFocus={true}
                            placeholder="Enter organization name"
                          />
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
                        addOrganizationApi.isPending ||
                        updateOrganizationApi.isPending
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

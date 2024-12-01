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
import { Modal, ModalContent, ModalHeader } from "@nextui-org/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  RichDatePicker,
  getDateControlOnChangeValue,
  getDateControlValue,
} from "@/components/ui/rich-cal";
import { useAdjustTestOrderDueDate } from "../apis/adjust-test-order-due-date.api";

const dueDateFormSchema = z.object({
  dueDate: z.date({
    required_error: "Due date is required",
  }),
});

type DueDateForm = z.infer<typeof dueDateFormSchema>;

export function AdjustDueDateModal({
  isOpen,
  onOpenChange,
  testOrderId,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  testOrderId: string;
}) {
  const form = useForm<DueDateForm>({
    resolver: zodResolver(dueDateFormSchema),
    defaultValues: {
      dueDate: undefined,
    },
  });

  const adjustDueDateApi = useAdjustTestOrderDueDate();

  const onSubmit = (values: DueDateForm) => {
    adjustDueDateApi
      .mutateAsync({ id: testOrderId, dueDate: values.dueDate })
      .then(() => {
        Notification.success("Test order due date updated");
        onOpenChange(false);
        form.reset();
      })
      .catch((err) => {
        const statusCode = err?.response?.status;
        if (statusCode != 422) {
          Notification.error("Failed to update test order due date");
          onOpenChange(false);
        }
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
        onOpenChange(open);
      }}
      placement="top-center"
    >
      <ModalContent>
        <ModalHeader className="text-xl font-semibold">
          Adjust Due Date
        </ModalHeader>
        <div className="px-6 pb-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-4"
            >
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel required={true}>Due Date</FormLabel>
                      <FormControl>
                        <RichDatePicker
                          {...field}
                          value={getDateControlValue(field.value)}
                          onChange={(value) => {
                            field.onChange(getDateControlOnChangeValue(value));
                          }}
                          minValue="today"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    onOpenChange(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!form.formState.isValid}
                >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </ModalContent>
    </Modal>
  );
}

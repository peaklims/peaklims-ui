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
import {
  RichDatePicker,
  getDateControlOnChangeValue,
  getDateControlValue,
} from "@/components/ui/rich-cal";
import { zodResolver } from "@hookform/resolvers/zod";
import { parse } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAdjustTestOrderDueDate } from "../apis/adjust-test-order-due-date.api";

export function AdjustDueDateForm({
  testOrderId,
  onClose,
  startingDueDate,
}: {
  testOrderId: string;
  startingDueDate: Date | null;
  onClose: () => void;
}) {
  const dueDateFormSchema = z.object({
    dueDate: z.date({
      required_error: "Due date is required",
    }),
  });

  type DueDateForm = z.infer<typeof dueDateFormSchema>;

  const parsedStartingDueDate = parse(
    startingDueDate?.toString() ?? "",
    "yyyy-MM-dd",
    new Date()
  );
  const form = useForm<DueDateForm>({
    resolver: zodResolver(dueDateFormSchema),
    defaultValues: {
      dueDate: parsedStartingDueDate,
    },
  });

  const adjustDueDateApi = useAdjustTestOrderDueDate();

  const onSubmit = (values: DueDateForm) => {
    console.log({ values });
    adjustDueDateApi
      .mutateAsync({
        testOrderId,
        dueDate: values.dueDate,
      })
      .then(() => {
        Notification.success("Due date updated successfully");
        onClose();
        form.reset();
      })
      .catch((err) => {
        const statusCode = err?.response?.status;
        if (statusCode !== 422) {
          Notification.error("Error updating due date");
          onClose();
        }
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel required={true}>Due Date</FormLabel>
              <FormControl>
                <RichDatePicker
                  {...field}
                  value={getDateControlValue(field.value)}
                  onChange={(value) => {
                    field.onChange(getDateControlOnChangeValue(value));
                  }}
                  maxValue={"today"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end pt-8">
          <Button type="submit">Ok</Button>
        </div>
      </form>
    </Form>
  );
}

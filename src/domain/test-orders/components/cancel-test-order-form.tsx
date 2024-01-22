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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useCancelTestOrder } from "../apis/canel-test-order";

export const cancelTestOrderSchema = z.object({
  testOrderId: z.string(),
  cancellationReason: z.string(),
  cancellationComments: z.string(),
});

export function CancelTestOrderForm({
  testOrderId,
  cancellationReasonOptions,
  afterSubmit,
}: {
  testOrderId: string;
  cancellationReasonOptions: { value: string; label: string }[];
  afterSubmit?: () => void;
}) {
  const cancellationForm = useForm<z.infer<typeof cancelTestOrderSchema>>({
    resolver: zodResolver(cancelTestOrderSchema),
    defaultValues: {
      testOrderId: testOrderId,
      cancellationReason: "",
      cancellationComments: "",
    },
  });

  const cancelTestOrderApi = useCancelTestOrder();
  function onSubmit(values: z.infer<typeof cancelTestOrderSchema>) {
    const accessionCommentForCreation = {
      reason: values.cancellationReason,
      comments: values.cancellationComments,
    };
    cancelTestOrderApi
      .mutateAsync({
        testOrderId,
        data: accessionCommentForCreation,
      })
      .then(() => {
        if (afterSubmit) {
          afterSubmit();
        }
      })
      .catch((err) => {
        const statusCode = err?.response?.status;
        if (statusCode != 422) {
          Notification.error(`Error cancelling test order`);
        }
      });
  }

  return (
    <Form {...cancellationForm}>
      <form
        onSubmit={cancellationForm.handleSubmit(onSubmit)}
        className="flex flex-col h-full"
      >
        <div className="flex-1 space-y-4">
          <FormField
            control={cancellationForm.control}
            name="cancellationReason"
            render={({ field }) => (
              <FormItem>
                <FormLabel required={true}>Cancellation Reason</FormLabel>
                <FormControl>
                  <Combobox items={cancellationReasonOptions} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={cancellationForm.control}
            name="cancellationComments"
            render={({ field }) => (
              <FormItem>
                <FormLabel required={true}>Cancellation Comments</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-end pt-8">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}

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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Item } from "react-stately";
import * as z from "zod";
import { useCancelPanelOrder } from "../apis/cancel-panel-order.api";

export const cancelPanelOrderSchema = z.object({
  panelOrderId: z.string(),
  cancellationReason: z.string(),
  cancellationComments: z.string(),
});

export function CancelPanelOrderForm({
  panelOrderId,
  cancellationReasonOptions,
  afterSubmit,
}: {
  panelOrderId: string;
  cancellationReasonOptions: { value: string; label: string }[];
  afterSubmit?: () => void;
}) {
  const cancellationForm = useForm<z.infer<typeof cancelPanelOrderSchema>>({
    resolver: zodResolver(cancelPanelOrderSchema),
    defaultValues: {
      panelOrderId: panelOrderId,
      cancellationReason: "",
      cancellationComments: "",
    },
  });

  const cancelPanelOrderApi = useCancelPanelOrder();
  function onSubmit(values: z.infer<typeof cancelPanelOrderSchema>) {
    const cancellationData = {
      reason: values.cancellationReason,
      comments: values.cancellationComments,
    };
    cancelPanelOrderApi
      .mutateAsync({
        panelOrderId,
        data: cancellationData,
      })
      .then(() => {
        if (afterSubmit) {
          afterSubmit();
        }
      })
      .catch((err) => {
        const statusCode = err?.response?.status;
        if (statusCode != 422) {
          Notification.error(`Error cancelling panel order`);
        }
      });
  }

  const cancellationOptions = cancellationReasonOptions
    ? cancellationReasonOptions
    : [];

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
                  <Combobox
                    label={field.name}
                    {...field}
                    inputValue={getLabelById({
                      id: field.value,
                      data: cancellationOptions,
                    })}
                    onInputChange={field.onChange}
                    selectedKey={field.value}
                    onSelectionChange={field.onChange}
                    autoFocus={true}
                    placeholder="Select a reason"
                  >
                    {cancellationOptions?.map((item) => (
                      <Item key={item.value} textValue={item.label}>
                        {item.label}
                      </Item>
                    ))}
                  </Combobox>
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

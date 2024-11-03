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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Item } from "react-stately";
import * as z from "zod";
import { useSetSample } from "../apis/set-sample.api";

export const sampleFormSchema = z.object({
  sampleId: z.string().nullable(),
});

export function SetSampleForm({
  testOrderId,
  sampleOptions,
  afterSubmit,
  sampleId,
}: {
  sampleId: string | null;
  testOrderId: string | null;
  sampleOptions: { value: string; label: string }[];
  afterSubmit?: () => void;
}) {
  const sampleForm = useForm<z.infer<typeof sampleFormSchema>>({
    resolver: zodResolver(sampleFormSchema),
    defaultValues: {
      sampleId: sampleId,
    },
  });

  const setSampleApi = useSetSample();
  function onSubmit(values: z.infer<typeof sampleFormSchema>) {
    if (values.sampleId === "") values.sampleId = null;
    setSampleApi
      .mutateAsync({
        testOrderId: testOrderId ?? "",
        sampleId: values.sampleId,
      })
      .then(() => {
        if (afterSubmit) {
          afterSubmit();
        }
      })
      .catch((e) => {
        Notification.error("There was an error setting this sample");
        console.error(e);
      });
  }
  const watchedSampleId = sampleForm.watch("sampleId");

  return (
    <Form {...sampleForm}>
      <form
        onSubmit={sampleForm.handleSubmit(onSubmit)}
        className="flex flex-col h-full"
      >
        <div className="flex-1 space-y-4">
          <FormField
            control={sampleForm.control}
            name="sampleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel required={false}>Sample</FormLabel>
                <FormControl>
                  <Combobox
                    autoFocus
                    label={field.name}
                    clearable={true}
                    {...field}
                    inputValue={getLabelById({
                      id: field.value,
                      data: sampleOptions,
                    })}
                    onInputChange={field.onChange}
                    selectedKey={field.value}
                    onSelectionChange={field.onChange}
                  >
                    {sampleOptions?.map((item) => (
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
        </div>

        <div className="flex items-center justify-end pt-8">
          {watchedSampleId ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                sampleForm.reset();
                onSubmit({ sampleId: null });
              }}
              className="mr-2"
            >
              Clear Sample
            </Button>
          ) : null}
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}

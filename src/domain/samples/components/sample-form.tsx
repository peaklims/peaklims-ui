import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { parse } from "date-fns";
import { useEffect } from "react";
import { useGetSample } from "../apis/get-sample";
import { sampleTypesDropdown } from "../types/sample-types";

export const sampleFormSchema = z.object({
  type: z.string().nonempty("Sample type is required"),
  receivedDate: z
    .date()
    .refine((dob) => dob <= new Date(), {
      message: "Date Received must not be in the future.",
    })
    .optional(),
  collectionDate: z
    .date()
    .refine((dob) => dob <= new Date(), {
      message: "Collection date must not be in the future.",
    })
    .optional(),
  externalId: z.string().optional(),
  collectionSite: z.string().optional(),
});

export const FormMode = ["Add", "Edit"] as const;
export function SampleForm({
  onSubmit,
  sampleId,
}: {
  onSubmit: (values: z.infer<typeof sampleFormSchema>) => void;
  sampleId?: string | undefined;
}) {
  const { data: sampleData } = useGetSample(sampleId);

  const sampleForm = useForm<z.infer<typeof sampleFormSchema>>({
    resolver: zodResolver(sampleFormSchema),
    defaultValues: {
      type: "",
      receivedDate: undefined,
      collectionDate: undefined,
      collectionSite: "",
      externalId: "",
    },
  });

  useEffect(() => {
    if (sampleData === undefined) {
      return;
    }

    const parsedDateReceived = parse(
      sampleData?.receivedDate?.toString() ?? "",
      "yyyy-MM-dd",
      new Date()
    );
    const parsedDateCollected = parse(
      sampleData?.collectionDate?.toString() ?? "",
      "yyyy-MM-dd",
      new Date()
    );
    sampleForm.reset({
      ...sampleForm.getValues(),
      type: sampleData?.type ?? "",
      collectionSite: sampleData?.collectionSite ?? "",
      externalId: sampleData?.externalId ?? "",
      receivedDate: sampleData?.receivedDate ? parsedDateReceived : undefined,
      collectionDate: sampleData?.collectionDate
        ? parsedDateCollected
        : undefined,
    });
  }, [sampleForm, sampleData]);

  return (
    <Form {...sampleForm}>
      <form
        onSubmit={sampleForm.handleSubmit(onSubmit)}
        className="flex flex-col h-full"
      >
        <div className="flex-1 space-y-4">
          <FormField
            control={sampleForm.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel required={true}>Sample Type</FormLabel>
                <FormControl>
                  <Combobox items={sampleTypesDropdown} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="col-span-1">
            <FormField
              control={sampleForm.control}
              name="externalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required={false}>External Id</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-4">
            <div className="col-span-1">
              <FormField
                control={sampleForm.control}
                name="receivedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required={false}>Date Received</FormLabel>
                    <FormControl>
                      <DatePicker
                        {...field}
                        buttonClassName="w-full"
                        toYear={new Date().getFullYear()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-1">
              <FormField
                control={sampleForm.control}
                name="collectionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required={false}>Collection Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        {...field}
                        buttonClassName="w-full"
                        toYear={new Date().getFullYear()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-1">
              <FormField
                control={sampleForm.control}
                name="collectionSite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required={false}>Collection Site</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-8">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}

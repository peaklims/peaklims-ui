import { Combobox, getLabelById } from "@/components/ui/combobox";
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
import { Item } from "react-stately";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  RichDatePicker,
  getDateControlOnChangeValue,
  getDateControlValue,
} from "@/components/ui/rich-cal";
import { useGetAllContainersForDropdown } from "@/domain/containers/apis/get-all-containers";
import { parse } from "date-fns";
import { useEffect, useState } from "react";
import { sampleTypesDropdown } from "../types/sample-types";

export const sampleFormSchema = z.object({
  type: z.string({ message: "Sample type is required" }),
  receivedDate: z.date().refine((dob) => dob <= new Date(), {
    message: "Date Received must not be in the future.",
  }),
  collectionDate: z
    .date()
    .refine((dob) => dob <= new Date(), {
      message: "Collection date must not be in the future.",
    })
    .optional(),
  externalId: z.string().optional(),
  collectionSite: z.string().optional(),
  containerId: z.string(),
});

export const FormMode = ["Add", "Edit"] as const;
export function SampleForm({
  onSubmit,
  data: sampleData,
}: {
  onSubmit: (values: z.infer<typeof sampleFormSchema>) => void;
  data?:
    | {
        id: string;
        sampleNumber: string;
        externalId?: string | null;
        status: string;
        type: string;
        collectionDate: Date | undefined | null;
        receivedDate: Date | undefined | null;
        collectionSite: string | undefined | null;
        containerId: string | undefined | null;
        containerType: string | undefined | null;
        patientId: string;
      }
    | undefined;
}) {
  const sampleForm = useForm<z.infer<typeof sampleFormSchema>>({
    resolver: zodResolver(sampleFormSchema),
    defaultValues: {
      type: "",
      receivedDate: undefined,
      collectionDate: undefined,
      collectionSite: "",
      externalId: "",
      containerId: "",
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
      containerId: sampleData?.containerId ?? "",
      collectionDate: sampleData?.collectionDate
        ? parsedDateCollected
        : undefined,
    });
  }, [sampleForm, sampleData]);

  const sampleType = sampleForm.watch("type");
  const { data: containers, isLoading: containersAreLoading } =
    useGetAllContainersForDropdown(sampleType);

  const [sampleTypeInputValue, setSampleTypeInputValue] = useState<
    string | undefined
  >();
  const [sampleContainerInputValue, setSampleContainerInputValue] = useState<
    string | undefined
  >();
  useEffect(() => {
    sampleForm.setValue("containerId", "");
    setSampleContainerInputValue(undefined);
  }, [sampleType, sampleForm]);

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
                  <Combobox
                    label={field.name}
                    autoFocus={true}
                    clearable={true}
                    {...field}
                    inputValue={sampleTypeInputValue}
                    onInputChange={(value) => {
                      setSampleTypeInputValue(value);
                    }}
                    selectedKey={field.value}
                    onSelectionChange={(key) => {
                      field.onChange(key);
                      setSampleTypeInputValue(
                        getLabelById({
                          id: key?.toString() ?? "",
                          data: sampleTypesDropdown,
                        })
                      );
                    }}
                  >
                    {sampleTypesDropdown?.map((item) => (
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
                name="containerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required={true}>Container</FormLabel>
                    <FormControl>
                      <Combobox
                        label={field.name}
                        {...field}
                        clearable={true}
                        isDisabled={containersAreLoading || !sampleType}
                        inputValue={sampleContainerInputValue}
                        onInputChange={(value) => {
                          setSampleContainerInputValue(value);
                        }}
                        selectedKey={field.value}
                        onSelectionChange={(key) => {
                          field.onChange(key);
                          setSampleContainerInputValue(
                            getLabelById({
                              id: key?.toString() ?? "",
                              data: containers ?? [],
                            })
                          );
                        }}
                      >
                        {containers?.map((item) => (
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

            <div className="col-span-1">
              <FormField
                control={sampleForm.control}
                name="receivedDate"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel required={true}>Date Received</FormLabel>
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
                  );
                }}
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

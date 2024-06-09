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
import { Combobox, getLabelById } from "@/components/ui/combobox";
import {
  RichDatePicker,
  getDateControlOnChangeValue,
  getDateControlValue,
} from "@/components/ui/rich-cal";
import { parse } from "date-fns";
import { useEffect } from "react";
import { Item } from "react-stately";
import { useGetPatient } from "../apis/get-patient";
import { ethnicitiesDropdown } from "../types/ethnicities";
import { racesDropdown } from "../types/races";
import { sexesDropdown } from "../types/sexes";

export const patientFormSchema = z.object({
  firstName: z.string().nonempty("First Name is required"),
  lastName: z.string().nonempty("Last Name is required"),
  dateOfBirth: z
    .date({
      required_error: "Date of Birth is required",
    })
    .refine((dob) => dob <= new Date(), {
      message: "Date of Birth must not be in the future.",
    }),
  sex: z.string().nonempty("Sex is required"),
  race: z.string(),
  ethnicity: z.string(),
});

export const FormMode = ["Add", "Edit"] as const;
export function PatientForm({
  onSubmit,
  patientId,
}: {
  onSubmit: (values: z.infer<typeof patientFormSchema>) => void;
  patientId?: string | undefined;
}) {
  const { data: patientData } = useGetPatient(patientId);

  const patientForm = useForm<z.infer<typeof patientFormSchema>>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      sex: "",
      dateOfBirth: undefined,
      race: "Not Given",
      ethnicity: "Not Given",
    },
  });

  useEffect(() => {
    if (patientData === undefined) {
      return;
    }

    const parsedDate = parse(
      patientData?.dateOfBirth?.toString() ?? "",
      "yyyy-MM-dd",
      new Date()
    );
    patientForm.reset({
      ...patientForm.getValues(),
      firstName: patientData?.firstName ?? "",
      lastName: patientData?.lastName ?? "",
      sex: patientData?.sex ?? "",
      dateOfBirth: patientData?.dateOfBirth ? parsedDate : undefined,
      race: patientData?.race ?? "Not Given",
      ethnicity: patientData?.ethnicity ?? "Not Given",
    });
  }, [patientForm, patientData]);

  return (
    <Form {...patientForm}>
      <form
        onSubmit={patientForm.handleSubmit(onSubmit)}
        className="flex flex-col h-full"
      >
        <div className="flex-1 space-y-2">
          <FormField
            control={patientForm.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel required={true}>First Name</FormLabel>
                <FormControl>
                  <Input {...field} autoFocus placeholder="Enter First Name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={patientForm.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel required={true}>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter Last Name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
            <div className="col-span-1">
              <FormField
                control={patientForm.control}
                name="dateOfBirth"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel required={true}>Date of Birth</FormLabel>
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
                control={patientForm.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required={true}>Sex</FormLabel>
                    <FormControl>
                      <Combobox
                        label={field.name}
                        {...field}
                        inputValue={getLabelById({
                          id: field.value,
                          data: sexesDropdown,
                        })}
                        onInputChange={field.onChange}
                        selectedKey={field.value}
                        onSelectionChange={field.onChange}
                      >
                        {sexesDropdown?.map((item) => (
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
                control={patientForm.control}
                name="race"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required={false}>Race</FormLabel>
                    <FormControl>
                      <Combobox
                        label={field.name}
                        {...field}
                        inputValue={getLabelById({
                          id: field.value,
                          data: racesDropdown,
                        })}
                        onInputChange={field.onChange}
                        selectedKey={field.value}
                        onSelectionChange={field.onChange}
                      >
                        {racesDropdown?.map((item) => (
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
                control={patientForm.control}
                name="ethnicity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required={false}>Ethnicity</FormLabel>
                    <FormControl>
                      <Combobox
                        label={field.name}
                        {...field}
                        inputValue={getLabelById({
                          id: field.value,
                          data: ethnicitiesDropdown,
                        })}
                        onInputChange={field.onChange}
                        selectedKey={field.value}
                        onSelectionChange={field.onChange}
                      >
                        {ethnicitiesDropdown?.map((item) => (
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
          </div>
        </div>

        <div className="flex items-center justify-end pt-8">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}

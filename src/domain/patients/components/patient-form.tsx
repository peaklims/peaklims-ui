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
import { useSetAccessionPatient } from "@/domain/accessions/apis/set-accession-patient";
import { useDebounce } from "@/hooks/use-debounce";
import { parse } from "date-fns";
import { useEffect } from "react";
import { Item } from "react-stately";
import { useExistingPatientSearch } from "../apis/search-existing-patients";
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
type PatientFormData = {
  id: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  dateOfBirth?: Date;
  internalId: string;
  sex: string;
  race?: string;
  ethnicity?: string;
};
export function PatientForm({
  onSubmit,
  patient,
  accessionId,
  onClose,
}: {
  onSubmit: (values: z.infer<typeof patientFormSchema>) => void;
  patient?: PatientFormData;
  accessionId?: string;
  onClose?: () => void;
}) {
  const parsedDate = parse(
    patient?.dateOfBirth?.toString() ?? "",
    "yyyy-MM-dd",
    new Date()
  );
  const patientForm = useForm<z.infer<typeof patientFormSchema>>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      firstName: patient?.firstName ?? "",
      lastName: patient?.lastName ?? "",
      sex: patient?.sex ?? "",
      dateOfBirth: patient?.dateOfBirth ? parsedDate : undefined,
      race: patient?.race ?? "Not Given",
      ethnicity: patient?.ethnicity ?? "Not Given",
    },
  });

  useEffect(() => {
    if (patient === undefined) {
      return;
    }

    const parsedDate = parse(
      patient?.dateOfBirth?.toString() ?? "",
      "yyyy-MM-dd",
      new Date()
    );
    patientForm.reset({
      ...patientForm.getValues(),
      firstName: patient?.firstName ?? "",
      lastName: patient?.lastName ?? "",
      sex: patient?.sex ?? "",
      dateOfBirth: patient?.dateOfBirth ? parsedDate : undefined,
      race: patient?.race ?? "Not Given",
      ethnicity: patient?.ethnicity ?? "Not Given",
    });
  }, [patientForm, patient]);

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
          <div className="grid w-full grid-cols-1 gap-y-2 gap-x-3 sm:grid-cols-2">
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
        <div className="pt-2">
          <ExistingPatientsDisplay
            patientForm={patientForm}
            accessionId={accessionId}
            patient={patient}
            onClose={onClose}
          />
        </div>

        <div className="flex items-center justify-end pt-8">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}

function ExistingPatientsDisplay({
  patientForm,
  accessionId,
  patient,
  onClose,
}: {
  patientForm: any;
  accessionId: string | undefined;
  patient: PatientFormData | undefined;
  onClose: any;
}) {
  const firstName = patientForm.watch("firstName");
  const lastName = patientForm.watch("lastName");

  const debouncedFirstName = useDebounce(firstName, 300);
  const debouncedLastName = useDebounce(lastName, 300);

  const searchQuery = {
    filters:
      debouncedFirstName && debouncedLastName
        ? `firstName@=*${debouncedFirstName} && lastName@=*${debouncedLastName}`
        : undefined,
    pageSize: 5,
    pageNumber: 1,
  };

  const { data: searchResults } = useExistingPatientSearch(searchQuery);

  const setAccessionPatient = useSetAccessionPatient();
  return (
    <>
      {searchResults?.data &&
        searchResults.data.length > 0 &&
        accessionId !== undefined &&
        patient === undefined && (
          <div className="px-2 py-4 my-2 border-y">
            <div className="mb-2 text-sm font-medium">
              Potential existing patient matches:
            </div>
            <div className="space-y-2">
              {searchResults.data.map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between p-2 border rounded-md cursor-pointer hover:bg-slate-100 border-md"
                  onClick={() => {
                    setAccessionPatient.mutate({
                      accessionId,
                      patientId: match.id,
                    });
                    onClose?.();
                  }}
                >
                  <div>
                    {match.firstName} {match.lastName} ({match.internalId})
                  </div>
                  <div className="text-sm text-slate-500">
                    DOB: {match?.dateOfBirth?.toString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
    </>
  );
}

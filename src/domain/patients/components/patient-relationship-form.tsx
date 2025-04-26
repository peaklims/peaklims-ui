import { QuestionCircle } from "@/components/svgs/question-circle";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useDebounce } from "@/hooks/use-debounce";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tooltip } from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Item } from "react-stately";
import * as z from "zod";
import { useGetSuggestedRelationship } from "../apis/get-suggested-relationship";
import { useExistingPatientSearch } from "../apis/search-existing-patients";
import { relationshipsDropdown } from "../types/patient-relationship";

export const patientRelationshipFormSchema = z.object({
  fromPatientId: z.string({ required_error: "From patient is required" }),
  toPatientId: z.string({ required_error: "To patient is required" }),
  fromRelationship: z.string({
    required_error: "From relationship is required",
  }),
  toRelationship: z.string({ required_error: "To relationship is required" }),
  isConfirmedBidirectional: z.boolean().default(false),
  notes: z.string().optional(),
});

export type PatientRelationshipFormValues = z.infer<
  typeof patientRelationshipFormSchema
>;

interface PatientRelationshipFormProps {
  onSubmit: (values: PatientRelationshipFormValues) => Promise<void> | void;
  fromPatientName: string;
  onCancel?: () => void;
  initialData?: Partial<PatientRelationshipFormValues>;
  isSubmitting?: boolean;
}

export const PatientRelationshipForm = ({
  onSubmit,
  onCancel,
  fromPatientName,
  initialData,
  isSubmitting = false,
}: PatientRelationshipFormProps) => {
  const form = useForm<PatientRelationshipFormValues>({
    resolver: zodResolver(patientRelationshipFormSchema),
    defaultValues: {
      fromPatientId: "",
      toPatientId: "",
      fromRelationship: "",
      toRelationship: "",
      isConfirmedBidirectional: true,
      notes: "",
      ...initialData,
    },
  });
  const [pageSize, setPageSize] = useState(500);
  const [pageNumber, setPageNumber] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const filterValue = useDebounce(inputValue, 300);
  console.log([filterValue]);

  const searchQuery = {
    filters: filterValue ? `fullname@=*"${filterValue}"` : undefined,
    pageSize,
    pageNumber,
  };

  const { data: searchResults } = useExistingPatientSearch({
    ...searchQuery,
    options: { enabled: true },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  const fromPatientOption = [
    {
      value: form.getValues("fromPatientId"),
      label: fromPatientName,
    },
  ];

  const relationship = form.watch("fromRelationship");
  const toPatientId = form.watch("toPatientId");
  const toRelationship = form.watch("toRelationship");

  const suggestionEnabled = !!relationship && !!toPatientId && !toRelationship;
  const suggestionPayload = suggestionEnabled
    ? { relationship, toPatientId }
    : undefined;
  const { data: suggestedToRelationship, error: suggestedError } =
    useGetSuggestedRelationship(suggestionPayload);

  const handleApplySuggestion = () => {
    if (suggestedToRelationship) {
      form.setValue("toRelationship", suggestedToRelationship, {
        shouldValidate: true,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fromPatientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel required={true}>The patient</FormLabel>
                <FormControl>
                  <Combobox
                    hideButton={true}
                    isDisabled={true}
                    label={field.name}
                    {...field}
                    inputValue={getLabelById({
                      id: field.value,
                      data: fromPatientOption,
                    })}
                    onInputChange={field.onChange}
                    selectedKey={field.value}
                    onSelectionChange={field.onChange}
                  >
                    {fromPatientOption?.map((item) => (
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
            control={form.control}
            name="fromRelationship"
            render={({ field }) => (
              <FormItem>
                <FormLabel required={true}>Is the</FormLabel>
                <FormControl>
                  <Combobox
                    clearable={true}
                    autoFocus={true}
                    label={field.name}
                    {...field}
                    inputValue={getLabelById({
                      id: field.value,
                      data: relationshipsDropdown,
                    })}
                    onInputChange={field.onChange}
                    selectedKey={field.value}
                    onSelectionChange={field.onChange}
                  >
                    {relationshipsDropdown?.map((item) => (
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="toPatientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel required={true}>To patient</FormLabel>
                <FormControl>
                  <Combobox
                    classNames={{
                      wrapper: "w-full",
                      input: "w-full",
                    }}
                    placeholder="Search for a patient"
                    label={field.name}
                    inputValue={inputValue}
                    onInputChange={setInputValue}
                    selectedKey={field.value}
                    onSelectionChange={(key) => {
                      field.onChange(key);
                      const selectedPatient = searchResults?.data.find(
                        (patient) => patient.id === key
                      );
                      if (selectedPatient) {
                        setInputValue(
                          `${selectedPatient.firstName} ${selectedPatient.lastName}`
                        );
                      }
                    }}
                  >
                    {searchResults?.data.map((patient) => (
                      <Item
                        key={patient.id}
                        textValue={`${patient.firstName} ${patient.lastName}`}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {patient.firstName} {patient.lastName}
                          </span>
                          <span className="text-sm text-gray-500">
                            {patient.internalId}
                          </span>
                        </div>
                      </Item>
                    ))}
                  </Combobox>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="toRelationship"
            render={({ field }) => (
              <FormItem>
                <FormLabel required={true}>Who is their</FormLabel>
                <FormControl>
                  <Combobox
                    clearable={true}
                    label={field.name}
                    {...field}
                    inputValue={getLabelById({
                      id: field.value,
                      data: relationshipsDropdown,
                    })}
                    onInputChange={field.onChange}
                    selectedKey={field.value}
                    onSelectionChange={field.onChange}
                  >
                    {relationshipsDropdown?.map((item) => (
                      <Item key={item.value} textValue={item.label}>
                        {item.label}
                      </Item>
                    ))}
                  </Combobox>
                </FormControl>
                {suggestedError && (
                  <div className="mt-1 text-xs text-red-500">
                    Could not fetch suggested relationship
                  </div>
                )}
                {suggestedToRelationship && !toRelationship && (
                  <div className="flex items-center mt-1 space-x-2">
                    <span className="text-xs text-sky-700">
                      Suggested:{" "}
                      <b>
                        {getLabelById({
                          id: suggestedToRelationship,
                          data: relationshipsDropdown,
                        }) || suggestedToRelationship}
                      </b>
                    </span>
                    <Button
                      type="button"
                      size="xs"
                      variant="link"
                      className="h-auto min-w-0 p-0 text-xs"
                      onClick={handleApplySuggestion}
                    >
                      Apply
                    </Button>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isConfirmedBidirectional"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
              <FormControl>
                <Checkbox isSelected={field.value} onChange={field.onChange} />
              </FormControl>
              <div className="flex items-center space-x-2 leading-none">
                <FormLabel>Confirmed Bidirectional</FormLabel>
                <Tooltip
                  placement="bottom"
                  closeDelay={0}
                  delay={600}
                  className="shadow-md bg-slate-100 border-slate-800"
                  content={
                    <p className="max-w-sm bg-slate-100">
                      You can confirm that the relationship is valid in both
                      directions. When true, the inverse relationship will be
                      added to the other patient.
                    </p>
                  }
                >
                  <div className="">
                    <QuestionCircle className="text-sky-600" />
                  </div>
                </Tooltip>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4 space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Relationship"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

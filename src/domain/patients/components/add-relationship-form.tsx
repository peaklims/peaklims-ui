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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Item } from "react-stately";
import * as z from "zod";
import { relationshipsDropdown } from "../types/patient-relationship";

export const patientRelationshipFormSchema = z.object({
  fromPatientId: z.string({ required_error: "From patient is required" }),
  toPatientId: z.string({ required_error: "To patient is required" }),
  fromRelationship: z.string({ required_error: "From relationship is required" }),
  toRelationship: z.string({ required_error: "To relationship is required" }),
  isConfirmedBidirectional: z.boolean().default(false),
  notes: z.string().optional(),
});

export type PatientRelationshipFormValues = z.infer<typeof patientRelationshipFormSchema>;

interface PatientRelationshipFormProps {
  onSubmit: (values: PatientRelationshipFormValues) => Promise<void> | void;
  fromPatinetName: string;
  onCancel?: () => void;
  initialData?: Partial<PatientRelationshipFormValues>;
  isSubmitting?: boolean;
}

export const PatientRelationshipForm = ({
  onSubmit,
  onCancel,
  fromPatinetName,
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
      isConfirmedBidirectional: false,
      notes: "",
      ...initialData,
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  const fromPatientOption = [
    {
      value: form.getValues("fromPatientId"),
      label: fromPatinetName,
    },
  ];

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
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    autoFocus={true}
                  />
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
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Bidirectional</FormLabel>
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

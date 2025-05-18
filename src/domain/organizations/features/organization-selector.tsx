// OrganizationSelector.tsx
import { Combobox, getLabelById } from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useGetAccessionForEdit } from "@/domain/accessions";
import { useClearAccessionOrganization } from "@/domain/accessions/apis/clear-accession-org";
import { useSetAccessionOrganization } from "@/domain/accessions/apis/set-accession-org";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Item } from "react-stately";
import { z } from "zod";

const orgFormSchema = z.object({
  organization: z.string().min(1, "Organization is required"),
});
type OrgFormData = z.infer<typeof orgFormSchema>;

interface OrganizationSelectorProps {
  accessionId?: string;
  organizationId?: string;
  orgs?: { value: string; label: string; disabled?: boolean }[];
  orgsAreLoading: boolean;
}

export function OrganizationSelector({
  accessionId,
  organizationId,
  orgs,
  orgsAreLoading,
}: OrganizationSelectorProps) {
  const { data: accession } = useGetAccessionForEdit(accessionId);
  const isDraft = accession?.status === "Draft";

  const options = orgs?.filter(
    (o) => !o.disabled || o.value === organizationId
  );

  // derive the label for the current organization
  const deriveLabel = (id?: string) =>
    id ? getLabelById({ id, data: options ?? [] }) ?? "" : "";

  const [inputValue, setInputValue] = useState(() =>
    deriveLabel(organizationId)
  );

  useEffect(() => {
    setInputValue(deriveLabel(organizationId));
  }, [organizationId, options]);

  const form = useForm<OrgFormData>({
    resolver: zodResolver(orgFormSchema),
    values: { organization: organizationId ?? "" },
  });

  const setOrg = useSetAccessionOrganization();
  const clearOrg = useClearAccessionOrganization();

  const onSubmit = ({ organization }: OrgFormData) => {
    if (!accessionId) return;
    return setOrg.mutateAsync({ accessionId, organizationId: organization });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization</FormLabel>
              <FormControl>
                <Combobox
                  classNames={{ wrapper: "w-full md:w-[25rem]" }}
                  autoFocus
                  label={field.name}
                  clearable
                  inputValue={inputValue}
                  onInputChange={setInputValue}
                  isDisabled={orgsAreLoading || !isDraft}
                  onClear={() => {
                    field.onChange("");
                    setInputValue("");
                    if (accessionId) clearOrg.mutateAsync({ accessionId });
                  }}
                  selectedKey={field.value}
                  onSelectionChange={(key) => {
                    field.onChange(key);
                    setInputValue(
                      getLabelById({
                        id: key?.toString() ?? "",
                        data: options ?? [],
                      }) ?? ""
                    );
                    form.handleSubmit(onSubmit)();
                  }}
                  disabledKeys={orgs
                    ?.filter((o) => o.disabled)
                    .map((o) => o.value)}
                >
                  {options?.map((o) => (
                    <Item key={o.value} textValue={o.label}>
                      {o.label}
                    </Item>
                  ))}
                </Combobox>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

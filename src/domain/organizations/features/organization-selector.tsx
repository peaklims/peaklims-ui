// OrganizationSelector.tsx
import { Autocomplete } from "@/components/ui/autocomplete";
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
import { useForm } from "react-hook-form";
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
              <FormLabel htmlFor="organization">Organization</FormLabel>
              <FormControl>
                <Autocomplete
                  inputId="organization"
                  items={options ?? []}
                  selectedValue={field.value}
                  placeholder="Select an organization"
                  setSelectedValue={(value) => {
                    field.onChange(value);
                    form.handleSubmit(onSubmit)();
                  }}
                  mapValue={(item) => item.value}
                  onFilterAsync={async ({ searchTerm }) => {
                    return (
                      orgs?.filter((o) =>
                        o.label.toLowerCase().includes(searchTerm.toLowerCase())
                      ) ?? []
                    );
                  }}
                  onClearAsync={async () => {
                    field.onChange(undefined);
                    if (accessionId)
                      await clearOrg.mutateAsync({ accessionId });
                  }}
                  itemToString={(item) => item.label}
                  disabled={orgsAreLoading || !isDraft}
                  label="Organization"
                  asyncDebounceMs={300}
                  isItemDisabled={(o) => o.disabled ?? false}
                  labelSrOnly={true}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

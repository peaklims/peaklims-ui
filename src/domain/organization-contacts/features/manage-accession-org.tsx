import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSetAccessionOrganization } from "@/domain/accessions/apis/set-accession-org";
import { useGetAllOrganizationsForDropdown } from "@/domain/organizations/apis/get-all-organizations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const orgFormSchema = z.object({
  organization: z.string().optional(),
});

type OrgFormData = z.infer<typeof orgFormSchema>;

export function AccessionOrganizationForm({
  accessionId,
  organizationId,
}: {
  accessionId: string | undefined;
  organizationId: string | undefined;
}) {
  const { data: orgs, isLoading: orgsAreLoading } =
    useGetAllOrganizationsForDropdown();

  const onlyActiveOrgsThatAreNotSelected = orgs?.filter(
    (org) => !org.disabled || org.value === organizationId
  );

  const organizationForm = useForm<OrgFormData>({
    resolver: zodResolver(orgFormSchema),
    defaultValues: {
      organization: organizationId ?? "",
    },
  });

  const setOrganizationApi = useSetAccessionOrganization();
  const onSubmit = (data: OrgFormData) => {
    console.log("data", data);
    if (!data.organization || accessionId === undefined) return;

    setOrganizationApi.mutateAsync({
      accessionId: accessionId,
      organizationId: data.organization.toString(),
    });
  };

  return (
    <div className="pt-3">
      <Form {...organizationForm}>
        <form onSubmit={organizationForm.handleSubmit(onSubmit)}>
          <FormField
            control={organizationForm.control}
            name="organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel required={false}>Organization</FormLabel>
                <FormControl>
                  <Combobox
                    {...field}
                    items={
                      onlyActiveOrgsThatAreNotSelected as {
                        value: string;
                        label: string;
                        disabled?: boolean;
                      }[]
                    }
                    buttonProps={{
                      className: "w-[25rem]",
                      disabled: orgsAreLoading,
                    }}
                    dropdownProps={{ className: "w-[25rem]" }}
                    onChange={(e) => {
                      field.onChange(e);
                      organizationForm.handleSubmit((data) => onSubmit(data))();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className="flex items-center justify-start w-full pt-4">
        <div className="flex items-center justify-center w-full px-3 h-52 bg-sky-300">
          users for this org
        </div>
        <div className="flex flex-col items-center justify-center px-3 space-y-2 w-52 h-52 bg-sky-400">
          <button>{">>"}</button>
          <button>{">"}</button>
          <button>{"<"}</button>
          <button>{"<<"}</button>
        </div>
        <div className="flex items-center justify-center w-full px-3 h-52 bg-sky-500">
          contacts to send info to
        </div>
      </div>
      <div className="w-full py-3 text-center bg-amber-400">OR</div>
      <div className="flex items-center justify-start w-full ">
        <div className="flex flex-col items-start w-full px-3 py-2 space-y-2 h-52 bg-violet-300">
          <div className="flex w-full px-3 py-2 bg-white rounded-md shadow-md">
            <div className="flex items-center justify-center flex-1">
              user info
            </div>
            <Button
              variant="outline"
              className="flex items-center justify-center"
            >
              + Email
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center"
            >
              + Fax
            </Button>
          </div>
          <div className="flex w-full px-3 py-2 bg-white rounded-md shadow-md">
            <div className="flex items-center justify-center flex-1">
              user info
            </div>
            <Button
              variant="outline"
              className="flex items-center justify-center"
            >
              + Email
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center"
            >
              + Fax
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-start w-full px-3 py-2 space-y-2 h-52 bg-violet-500">
          <div className="flex w-full px-3 py-2 bg-white rounded-md shadow-md">
            <div className="flex items-center justify-center flex-1">
              user and contact info
            </div>
            <Button
              variant="outline"
              className="flex items-center justify-center"
            >
              -
            </Button>
          </div>
          <div className="flex w-full px-3 py-2 bg-white rounded-md shadow-md">
            <div className="flex items-center justify-center flex-1">
              user and contact info
            </div>
            <Button
              variant="outline"
              className="flex items-center justify-center"
            >
              -
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { peakLimsApi } from "@/services/api-client";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { OrganizationContactKeys } from "./organization-contact.keys";

export interface HealthcareOrganizationContactForUpdateDto {
  firstName: string;
  lastName: string;
  email?: string;
  npi?: string;
  organizationId: string;
}

interface UpdateProps {
  id: string;
  data: HealthcareOrganizationContactForUpdateDto;
}

export const updateOrganizationContact = async (
  id: string,
  data: HealthcareOrganizationContactForUpdateDto
) => {
  return peakLimsApi
    .put(`/v1/healthcareorganizationcontacts/${id}`, data)
    .then((response) => response.data);
};

export const useUpdateOrganizationContact = (
  options?: Omit<
    UseMutationOptions<void, AxiosError, UpdateProps, unknown>,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data: updatedContact }: UpdateProps) =>
      updateOrganizationContact(id, updatedContact),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: OrganizationContactKeys.all,
      });
    },
    ...options,
  });
};

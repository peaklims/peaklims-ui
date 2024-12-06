import { peakLimsApi } from "@/services/api-client";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { OrganizationContactDto } from "../types";
import { OrganizationContactKeys } from "./organization-contact.keys";

export interface HealthcareOrganizationContactForCreationDto {
  firstName: string;
  lastName: string;
  email?: string;
  npi?: string;
  healthcareOrganizationId: string;
}

export const addOrganizationContact = async (
  data: HealthcareOrganizationContactForCreationDto
) => {
  return peakLimsApi
    .post(`/v1/healthcareorganizationcontacts`, data)
    .then((response) => response.data);
};

export const useAddOrganizationContact = (
  options?: Omit<
    UseMutationOptions<
      OrganizationContactDto,
      AxiosError,
      HealthcareOrganizationContactForCreationDto,
      unknown
    >,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: HealthcareOrganizationContactForCreationDto) =>
      addOrganizationContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: OrganizationContactKeys.all,
      });
    },
    ...options,
  });
};

import { peakLimsApi } from "@/services/api-client";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { OrganizationKeys } from "./organization.keys";

export type OrganizationForUpdateDto = {
  name: string;
};

type UpdateProps = {
  id: string;
  data: OrganizationForUpdateDto;
};

export const updateOrganization = async (
  id: string,
  data: OrganizationForUpdateDto
) => {
  return peakLimsApi
    .put(`/v1/healthcareOrganizations/${id}`, data)
    .then((response) => response.data);
};

export const useUpdateOrganization = (
  options?: Omit<
    UseMutationOptions<void, AxiosError, UpdateProps, unknown>,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data: updatedOrganization }: UpdateProps) =>
      updateOrganization(id, updatedOrganization),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: OrganizationKeys.all,
      });
    },
    ...options,
  });
};

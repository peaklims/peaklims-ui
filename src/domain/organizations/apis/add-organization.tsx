import { peakLimsApi } from "@/services/api-client";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { OrganizationDto } from "../types";
import { OrganizationKeys } from "./organization.keys";

export type OrganizationForCreationDto = {
  name: string;
};

export const addOrganization = async (data: OrganizationForCreationDto) => {
  return peakLimsApi
    .post(`/v1/healthcareOrganizations`, data)
    .then((response) => response.data);
};

export const useAddOrganization = (
  options?: Omit<
    UseMutationOptions<
      OrganizationDto,
      AxiosError,
      OrganizationForCreationDto,
      unknown
    >,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OrganizationForCreationDto) => addOrganization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: OrganizationKeys.all,
      });
    },
    ...options,
  });
};

import { peakLimsApi } from "@/services/api-client";
import { useAuthUser } from "@/services/auth";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { PeakOrganizationDto } from "../types";
import { PeakOrganizationKeys } from "./peakorganization.keys";

export const getPeakOrganization = async (peakOrganizationId: string) => {
  return peakLimsApi
    .get(`/v1/peakorganizations/${peakOrganizationId}`)
    .then((response: AxiosResponse<PeakOrganizationDto>) => response.data);
};

export const useGetPeakOrganization = (
  peakOrganizationId: string | undefined
) => {
  return useQuery({
    queryKey: PeakOrganizationKeys.detail(peakOrganizationId!),
    queryFn: () => getPeakOrganization(peakOrganizationId!),
    enabled: peakOrganizationId !== null && peakOrganizationId !== undefined,
    gcTime: Infinity,
    staleTime: Infinity,
  });
};

export const useGetUserPeakOrganization = ({
  hasArtificialDelay = false,
  delayInMs = 0,
}: DelayProps = {}) => {
  const { user } = useAuthUser();
  return useGetPeakOrganization(user?.organizationId, {
    hasArtificialDelay,
    delayInMs,
  });
};

import { peakLimsApi } from "@/services/api-client";
import { useAuthUser } from "@/services/auth";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { PeakOrganizationDto } from "../types";
import { PeakOrganizationKeys } from "./peakorganization.keys";

interface DelayProps {
  hasArtificialDelay?: boolean;
  delayInMs?: number;
}

export const getPeakOrganization = async (
  peakOrganizationId: string,
  { hasArtificialDelay = false, delayInMs = 0 }: DelayProps = {}
) => {
  const [data] = await Promise.all([
    peakLimsApi
      .get(`/v1/peakorganizations/${peakOrganizationId}`)
      .then((response: AxiosResponse<PeakOrganizationDto>) => response.data),
    new Promise((resolve) =>
      setTimeout(resolve, hasArtificialDelay ? delayInMs : 0)
    ),
  ]);
  return data;
};

export const useGetPeakOrganization = (
  peakOrganizationId: string | undefined,
  { hasArtificialDelay = false, delayInMs = 0 }: DelayProps = {}
) => {
  return useQuery({
    queryKey: PeakOrganizationKeys.detail(peakOrganizationId!),
    queryFn: () =>
      getPeakOrganization(peakOrganizationId!, {
        hasArtificialDelay,
        delayInMs,
      }),
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

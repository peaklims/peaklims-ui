import { peakLimsApi } from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { SampleDto } from "../types";
import { SampleKeys } from "./sample.keys";

export const getSample = async (sampleId: string) => {
  return peakLimsApi
    .get(`/v1/samples/${sampleId}`)
    .then((response: AxiosResponse<SampleDto>) => response.data);
};

export const useGetSample = (sampleId: string | undefined) => {
  return useQuery({
    queryKey: SampleKeys.detail(sampleId!),
    queryFn: () => getSample(sampleId!),
    enabled: sampleId !== null && sampleId !== undefined,
  });
};

import { peakLimsApi } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { SampleDto } from "../types";
import { SampleKeys } from "./sample.keys";

export const getSample = async (sampleId: string) => {
  return peakLimsApi
    .get(`/samples/${sampleId}`)
    .then((response: AxiosResponse<SampleDto>) => response.data);
};

export const useGetSample = (sampleId: string | undefined) => {
  return useQuery(SampleKeys.detail(sampleId!), () => getSample(sampleId!), {
    enabled: sampleId !== null && sampleId !== undefined,
  });
};

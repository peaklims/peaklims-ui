import { peakLimsApi } from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { SampleDto } from "../types";
import { SampleKeys } from "./sample.keys";

export const getPatientSamples = async ({
  patientId,
}: {
  patientId: string;
}) => {
  return peakLimsApi
    .get(`/v1/samples/byPatient/${patientId}`)
    .then((response: AxiosResponse<SampleDto[]>) => response.data);
};

export const useGetPatientSamples = ({
  patientId,
}: {
  patientId: string | null;
}) => {
  return useQuery({
    queryKey: SampleKeys.byPatient(patientId!),
    queryFn: () => getPatientSamples({ patientId: patientId! }),
    enabled: (patientId?.length ?? 0) > 0,
  });
};

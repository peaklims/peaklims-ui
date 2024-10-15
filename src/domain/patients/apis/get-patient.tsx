import { peakLimsApi } from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { PatientDto } from "../types";
import { PatientKeys } from "./patient.keys";

export const getPatient = async (patientId: string) => {
  return peakLimsApi
    .get(`/v1/patients/${patientId}`)
    .then((response: AxiosResponse<PatientDto>) => response.data);
};

export const useGetPatient = (patientId: string | undefined) => {
  return useQuery({
    queryKey: PatientKeys.detail(patientId!),
    queryFn: () => getPatient(patientId!),
    enabled: patientId !== null && patientId !== undefined,
  });
};

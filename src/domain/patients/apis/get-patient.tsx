import { peakLimsApi } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { PatientDto } from "../types";
import { PatientKeys } from "./patient.keys";

export const getPatient = async (patientId: string) => {
  return peakLimsApi
    .get(`/patients/${patientId}`)
    .then((response: AxiosResponse<PatientDto>) => response.data);
};

export const useGetPatient = (patientId: string | undefined) => {
  return useQuery(
    PatientKeys.detail(patientId!),
    () => getPatient(patientId!),
    {
      enabled: patientId !== null && patientId !== undefined,
    }
  );
};

import { peakLimsApi } from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { PatientRelationshipDto } from "../types/patient-relationship";
import { PatientKeys } from "./patient.keys";

export const getPatientRelationships = async (patientId: string) => {
  return peakLimsApi
    .get(`/v1/patients/${patientId}/relationships`)
    .then((response: AxiosResponse<PatientRelationshipDto[]>) => response.data);
};

export const useGetPatientRelationships = (patientId: string | undefined) => {
  return useQuery({
    queryKey: PatientKeys.relationships(patientId!),
    queryFn: () => getPatientRelationships(patientId!),
    enabled: patientId !== null && patientId !== undefined,
  });
};

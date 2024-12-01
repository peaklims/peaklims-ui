import { AccessionKeys } from "@/domain/accessions/apis/accession.keys";
import { peakLimsApi } from "@/services/api-client";
import { toDateOnly } from "@/utils/dates";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { PatientForUpdateDto } from "../types";
import { PatientKeys } from "./patient.keys";

export const updatePatient = async (id: string, data: PatientForUpdateDto) => {
  data = { ...data, dateOfBirth: toDateOnly(data.dateOfBirth) };
  return peakLimsApi
    .put(`/v1/patients/${id}`, data)
    .then((response) => response.data);
};

export interface UpdateProps {
  id: string;
  data: PatientForUpdateDto;
}

export function useUpdatePatient(
  options?: UseMutationOptions<void, AxiosError, UpdateProps>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data: updatedPatient }: UpdateProps) =>
      updatePatient(id, updatedPatient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PatientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: AccessionKeys.forEdits() });
      queryClient.invalidateQueries({ queryKey: PatientKeys.details() });
      // queryClient.invalidateQueries(PatientKeys.detail(patientId));
    },
    ...options,
  });
}

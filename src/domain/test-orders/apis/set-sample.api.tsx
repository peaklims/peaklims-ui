import { AccessionKeys } from "@/domain/accessions/apis/accession.keys";
import { PatientKeys } from "@/domain/patients/apis/patient.keys";
import { peakLimsApi } from "@/services/api-client";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

export const setSample = async (
  testOrderId: string,
  sampleId: string | null
) => {
  if ((sampleId?.length ?? 0) <= 0) sampleId = null;
  return sampleId === null
    ? peakLimsApi
        .put(`/v1/testOrders/${testOrderId}/clearSample`)
        .then((response) => response.data)
    : peakLimsApi
        .put(`/v1/testOrders/${testOrderId}/setSample/${sampleId}`)
        .then((response) => response.data);
};

export interface UpdateProps {
  testOrderId: string;
  sampleId: string | null;
}

export function useSetSample(
  options?: UseMutationOptions<void, AxiosError, UpdateProps>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ testOrderId, sampleId }: UpdateProps) =>
      setSample(testOrderId, sampleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PatientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: AccessionKeys.forEdits() });
      queryClient.invalidateQueries({ queryKey: PatientKeys.details() });
      // queryClient.invalidateQueries({ queryKey: PatientKeys.detail(patientId) });
    },
    ...options,
  });
}

import { AccessionKeys } from "@/domain/accessions/apis/accession.keys";
import { PatientKeys } from "@/domain/patients/apis/patient.keys";
import { peakLimsApi } from "@/services/api-client";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { TestOrderCancellationDto } from "../types";

export const cancelTestOrder = async (
  testOrderId: string,
  data: TestOrderCancellationDto
) => {
  return peakLimsApi
    .put(`/v1/testOrders/${testOrderId}/cancel`, data)
    .then((response) => response.data);
};

export interface UpdateProps {
  testOrderId: string;
  data: TestOrderCancellationDto;
}

export function useCancelTestOrder(
  options?: UseMutationOptions<void, AxiosError, UpdateProps>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ testOrderId, data }: UpdateProps) =>
      cancelTestOrder(testOrderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(PatientKeys.lists());
      queryClient.invalidateQueries(AccessionKeys.forEdits());
      queryClient.invalidateQueries(PatientKeys.details());
      // queryClient.invalidateQueries(PatientKeys.detail(patientId));
    },
    ...options,
  });
}

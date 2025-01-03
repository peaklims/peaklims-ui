import { peakLimsApi } from "@/services/api-client";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { TestOrderKeys } from "./test-order.keys";
import { PatientKeys } from "@/domain/patients/apis/patient.keys";
import { AccessionKeys } from "@/domain/accessions/apis/accession.keys";

const markTestOrderNormal = async (testOrderId: string) => {
  return await peakLimsApi
    .put(`/v1/testorders/${testOrderId}/marknormal`)
    .then((response) => response.data);
};

export function useMarkTestOrderNormal(
  options?: UseMutationOptions<void, AxiosError, string>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (testOrderId: string) => markTestOrderNormal(testOrderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AccessionKeys.forEdits() });
      queryClient.invalidateQueries({ queryKey: TestOrderKeys.all });
    },
    ...options,
  });
}

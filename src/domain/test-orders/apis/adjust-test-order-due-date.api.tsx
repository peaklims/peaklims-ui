import { peakLimsApi } from "@/services/api-client";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { TestOrderKeys } from "./test-order.keys";
import { PatientKeys } from "@/domain/patients/apis/patient.keys";
import { AccessionKeys } from "@/domain/accessions/apis/accession.keys";

interface AdjustDueDateProps {
  testOrderId: string;
  dueDate: string; // Format: YYYY-MM-DD
}

const adjustTestOrderDueDate = async ({ testOrderId, dueDate }: AdjustDueDateProps) => {
  return await peakLimsApi
    .put(`/v1/testorders/${testOrderId}/duedate`, { dueDate })
    .then((response) => response.data);
};

export function useAdjustTestOrderDueDate(
  options?: UseMutationOptions<void, AxiosError, AdjustDueDateProps>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (props: AdjustDueDateProps) => adjustTestOrderDueDate(props),
    onSuccess: () => {
      queryClient.invalidateQueries(PatientKeys.lists());
      queryClient.invalidateQueries(AccessionKeys.forEdits());
      queryClient.invalidateQueries(PatientKeys.details());
      queryClient.invalidateQueries(TestOrderKeys.all);
    },
    ...options,
  });
}

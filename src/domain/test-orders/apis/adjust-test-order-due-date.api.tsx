import { AccessionKeys } from "@/domain/accessions/apis/accession.keys";
import { peakLimsApi } from "@/services/api-client";
import { toDateOnly } from "@/utils/dates";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { TestOrderKeys } from "./test-order.keys";

interface AdjustDueDateProps {
  testOrderId: string;
  dueDate: Date;
}

const adjustTestOrderDueDate = async ({
  testOrderId,
  dueDate,
}: AdjustDueDateProps) => {
  return await peakLimsApi
    .put(`/v1/testorders/${testOrderId}/adjustDueDate`, {
      dueDate: toDateOnly(dueDate),
    })
    .then((response) => response.data);
};

export function useAdjustTestOrderDueDate(
  options?: UseMutationOptions<void, AxiosError, AdjustDueDateProps>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (props: AdjustDueDateProps) => adjustTestOrderDueDate(props),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TestOrderKeys.all });
      queryClient.invalidateQueries({ queryKey: AccessionKeys.all });
    },
    ...options,
  });
}

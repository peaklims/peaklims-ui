import { AccessionKeys } from "@/domain/accessions/apis/accession.keys";
import { peakLimsApi } from "@/services/api-client";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

const removeTestOrder = async ({
  accessionId,
  testOrderId,
}: {
  accessionId: string;
  testOrderId: string;
}) => {
  return await peakLimsApi
    .put(`/v1/accessions/${accessionId}/removeTestOrder/${testOrderId}`)
    .then((response) => response.data);
};

type MutationContext = {
  accessionId: string;
};

export function useRemoveTestOrder(
  options?: UseMutationOptions<
    unknown,
    AxiosError,
    { accessionId: string; testOrderId: string },
    MutationContext
  >
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      accessionId,
      testOrderId,
    }: {
      accessionId: string;
      testOrderId: string;
    }) => removeTestOrder({ accessionId, testOrderId }),
    onMutate: (variables) => {
      return { accessionId: variables.accessionId };
    },
    onSuccess: (_, __, context: MutationContext | undefined) => {
      if (context) {
        queryClient.invalidateQueries({ queryKey: AccessionKeys.forEdits() });
      }
    },
    ...options,
  });
}

import { peakLimsApi } from "@/services/api-client";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AccessionKeys } from "./accession.keys";

type AbandonAccessionParams = {
  accessionId: string;
  reason: string;
};

const abandonAccession = async ({ accessionId, reason }: AbandonAccessionParams) => {
  await peakLimsApi.put(`/v1/accessions/${accessionId}/abandon?reason=${encodeURIComponent(reason)}`);
};

type MutationContext = {
  accessionId: string;
};

export function useAbandonAccession(
  options?: UseMutationOptions<
    void,
    AxiosError,
    AbandonAccessionParams,
    MutationContext
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError,
    AbandonAccessionParams,
    MutationContext
  >({
    mutationFn: ({ accessionId, reason }: AbandonAccessionParams) => {
      return abandonAccession({ accessionId, reason });
    },
    onMutate: (variables) => {
      // make `data` available for cache key
      return { accessionId: variables.accessionId };
    },
    onSuccess: (_, __, context: MutationContext | undefined) => {
      if (context) {
        queryClient.invalidateQueries({ queryKey: AccessionKeys.lists() });
        queryClient.invalidateQueries({
          queryKey: AccessionKeys.forEdit(context.accessionId),
        });
      }
    },
    ...options,
  });
}

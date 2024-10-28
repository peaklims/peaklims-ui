// import { generateSieveSortOrder } from "@/utils/sorting";
import { peakLimsApi } from "@/services/api-client";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AccessionKeys } from "./accession.keys";

const submitAccession = async ({ accessionId }: { accessionId: string }) => {
  await peakLimsApi.put(`/v1/accessions/${accessionId}/submit`);
};

type MutationContext = {
  accessionId: string;
};

export function useSubmitAccession(
  options?: UseMutationOptions<
    void,
    AxiosError,
    { accessionId: string },
    MutationContext
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError,
    { accessionId: string },
    MutationContext
  >({
    mutationFn: ({
      accessionId,
    }: {
      accessionId: string;
      organizationId: string;
    }) => {
      return submitAccession({ accessionId });
    },
    onMutate: (variables) => {
      // make `data` available for cache key
      return { accessionId: variables.accessionId };
    },
    onSuccess: (_, __, context: MutationContext | undefined) => {
      if (context) {
        queryClient.invalidateQueries(AccessionKeys.lists());
        queryClient.invalidateQueries(
          AccessionKeys.forEdit(context.accessionId)
        );
      }
    },
    ...options,
  });
}

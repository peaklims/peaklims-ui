// import { generateSieveSortOrder } from "@/utils/sorting";
import { peakLimsApi } from "@/services/api-client";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AccessionKeys } from "./accession.keys";

const removeAccessionPatient = async (accessionId: string) => {
  await peakLimsApi.put(`/v1/accessions/${accessionId}/removePatient`);
};

type MutationContext = { accessionId: string };
export function useRemoveAccessionPatient(
  options?: UseMutationOptions<void, AxiosError, string, MutationContext>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accessionId: string) => removeAccessionPatient(accessionId),

    onMutate: (accessionId) => {
      // make `data` available for cache key
      return { accessionId };
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

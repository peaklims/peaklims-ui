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
  await peakLimsApi.put(`/accessions/${accessionId}/removePatient`);
};

type MutationContext = { accessionId: string };
export function useRemoveAccessionPatient(
  options?: UseMutationOptions<void, AxiosError, string, MutationContext>
) {
  const queryClient = useQueryClient();

  return useMutation(
    (accessionId: string) => removeAccessionPatient(accessionId),
    {
      onMutate: (accessionId) => {
        // make `data` available for cache key
        return { accessionId };
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
    }
  );
}

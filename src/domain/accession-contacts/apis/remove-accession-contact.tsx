// import { generateSieveSortOrder } from "@/utils/sorting";
import { peakLimsApi } from "@/services/api-client";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AccessionKeys } from "../../accessions/apis/accession.keys";
import { AccessionContactDto } from "../types";
import { AccessionContactKeys } from "./accession-contact.keys";

const removeAccessionContact = async ({
  accessionId,
  accessionContactId,
}: {
  accessionId: string;
  accessionContactId: string;
}): Promise<AccessionContactDto> => {
  return await peakLimsApi
    .put(`/accessions/${accessionId}/removeContact/${accessionContactId}`)
    .then((response) => response.data as AccessionContactDto);
};

type MutationContext = {
  accessionId: string;
};

export function useRemoveAccessionContact(
  options?: UseMutationOptions<
    AccessionContactDto,
    AxiosError,
    { accessionId: string; accessionContactId: string },
    MutationContext
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    AccessionContactDto,
    AxiosError,
    { accessionId: string; accessionContactId: string },
    MutationContext
  >(
    ({
      accessionId,
      accessionContactId,
    }: {
      accessionId: string;
      accessionContactId: string;
    }) => {
      return removeAccessionContact({ accessionId, accessionContactId });
    },
    {
      onMutate: (variables) => {
        // Make `data` available for cache key
        return { accessionId: variables.accessionId };
      },
      onSuccess: (_, __, context: MutationContext | undefined) => {
        if (context) {
          queryClient.invalidateQueries(AccessionKeys.lists());
          queryClient.invalidateQueries(
            AccessionKeys.forEdit(context.accessionId)
          );
          queryClient.invalidateQueries(
            AccessionContactKeys.byAccession(context.accessionId)
          );
        }
      },
      ...options,
    }
  );
}

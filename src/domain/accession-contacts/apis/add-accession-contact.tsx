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

const addAccessionContact = async ({
  accessionId,
  organizationContactId,
}: {
  accessionId: string;
  organizationContactId: string;
}): Promise<AccessionContactDto> => {
  return await peakLimsApi
    .post(`/accessions/${accessionId}/addContact/${organizationContactId}`)
    .then((response) => response.data as AccessionContactDto);
};

type MutationContext = {
  accessionId: string;
};

export function useAddAccessionContact(
  options?: UseMutationOptions<
    AccessionContactDto,
    AxiosError,
    { accessionId: string; organizationContactId: string },
    MutationContext
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    AccessionContactDto,
    AxiosError,
    { accessionId: string; organizationContactId: string },
    MutationContext
  >({
    mutationFn: ({
      accessionId,
      organizationContactId,
    }: {
      accessionId: string;
      organizationContactId: string;
    }) => {
      return addAccessionContact({ accessionId, organizationContactId });
    },
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
  });
}

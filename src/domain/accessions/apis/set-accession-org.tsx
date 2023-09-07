// import { generateSieveSortOrder } from "@/utils/sorting";
import { peakLimsApi } from "@/services/apiClient";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AccessionKeys } from "./accession.keys";

const setAccessionOrganization = async ({
  accessionId,
  organizationId,
}: {
  accessionId: string;
  organizationId: string;
}) => {
  await peakLimsApi.put(
    `/accessions/${accessionId}/setOrganization/${organizationId}`
  );
};

type MutationContext = {
  accessionId: string;
};

export function useSetAccessionOrganization(
  options?: UseMutationOptions<
    void,
    AxiosError,
    { accessionId: string; organizationId: string },
    MutationContext
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    AxiosError,
    { accessionId: string; organizationId: string },
    MutationContext
  >(
    ({
      accessionId,
      organizationId,
    }: {
      accessionId: string;
      organizationId: string;
    }) => {
      return setAccessionOrganization({ accessionId, organizationId });
    },
    {
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
    }
  );
}

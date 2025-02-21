// import { generateSieveSortOrder } from "@/utils/sorting";
import { peakLimsApi } from "@/services/api-client";
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
    `/v1/accessions/${accessionId}/setOrganization/${organizationId}`
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
  >({
    mutationFn: ({
      accessionId,
      organizationId,
    }: {
      accessionId: string;
      organizationId: string;
    }) => {
      return setAccessionOrganization({ accessionId, organizationId });
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

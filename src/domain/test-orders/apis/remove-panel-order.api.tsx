import { AccessionKeys } from "@/domain/accessions/apis/accession.keys";
import { peakLimsApi } from "@/services/api-client";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

const removePanelOrder = async ({
  accessionId,
  panelOrderId,
}: {
  accessionId: string;
  panelOrderId: string;
}) => {
  return await peakLimsApi
    .put(`/accessions/${accessionId}/removePanelOrder/${panelOrderId}`)
    .then((response) => response.data);
};

type MutationContext = {
  accessionId: string;
};

export function useRemovePanelOrder(
  options?: UseMutationOptions<
    unknown,
    AxiosError,
    { accessionId: string; panelOrderId: string },
    MutationContext
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    AxiosError,
    { accessionId: string; panelOrderId: string },
    MutationContext
  >(
    ({
      accessionId,
      panelOrderId,
    }: {
      accessionId: string;
      panelOrderId: string;
    }) => removePanelOrder({ accessionId, panelOrderId }),
    {
      onMutate: (variables) => {
        return { accessionId: variables.accessionId };
      },
      onSuccess: (_, __, context: MutationContext | undefined) => {
        if (context) {
          queryClient.invalidateQueries(AccessionKeys.forEdits());
        }
      },
      ...options,
    }
  );
}

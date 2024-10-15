import { AccessionKeys } from "@/domain/accessions/apis/accession.keys";
import { peakLimsApi } from "@/services/api-client";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

async function deleteAccessionAttachment({
  attachmentId,
}: {
  attachmentId: string;
}) {
  return peakLimsApi
    .delete(`/v1/accessionAttachments/${attachmentId}`)
    .then(() => {});
}

type AccessionAttachmentMutationContext = {
  attachmentId: string;
  accessionId: string;
};

export function useDeleteAccessionAttachment(
  options?: UseMutationOptions<
    void,
    AxiosError,
    { attachmentId: string; accessionId: string },
    AccessionAttachmentMutationContext
  >
) {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    AxiosError,
    { attachmentId: string; accessionId: string },
    AccessionAttachmentMutationContext
  >({
    mutationFn: ({ attachmentId }) =>
      deleteAccessionAttachment({ attachmentId }),
    onMutate: ({ attachmentId, accessionId }) => {
      return { attachmentId, accessionId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(AccessionKeys.forEdits());
    },
    ...options,
  });
}

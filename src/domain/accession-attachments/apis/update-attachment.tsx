import { AccessionKeys } from "@/domain/accessions/apis/accession.keys";
import { peakLimsApi } from "@/services/api-client";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AccessionAttachmentForUpdateDto } from "../accession-attachments.types";

export const updateAccessionAttachment = async (
  id: string,
  data: AccessionAttachmentForUpdateDto
) => {
  return peakLimsApi
    .put(`/accessionAttachments/${id}`, data)
    .then((response) => response.data);
};

export interface UpdateProps {
  id: string;
  data: AccessionAttachmentForUpdateDto;
}

export function useUpdateAccessionAttachment(
  options?: UseMutationOptions<void, AxiosError, UpdateProps>
) {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, data: updatedAccessionAttachment }: UpdateProps) =>
      updateAccessionAttachment(id, updatedAccessionAttachment),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(AccessionKeys.forEdits());
        // queryClient.invalidateQueries(AccessionAttachmentKeys.detail(patientId));
      },
      ...options,
    }
  );
}

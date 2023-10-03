import { peakLimsApi } from "@/services/api-client";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

export const uploadAccessionAttachment = async (
  accessionId: string,
  file: File
) => {
  const formData = new FormData();
  formData.append("file", file);

  return await peakLimsApi
    .post(`/accessionAttachments/uploadTo/${accessionId}`, formData)
    .then((response: AxiosResponse) => {
      if (response.status !== 204) {
        throw new Error("Failed to upload the attachment");
      }
      return response;
    });
};

export const useUploadAccessionAttachment = () => {
  return useMutation((params: { accessionId: string; file: File }) =>
    uploadAccessionAttachment(params.accessionId, params.file)
  );
};

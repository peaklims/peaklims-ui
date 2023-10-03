import { peakLimsApi } from "@/services/api-client";
import { useMutation } from "@tanstack/react-query";
import { AxiosProgressEvent, AxiosResponse } from "axios";

export const uploadAccessionAttachment = async (
  accessionId: string,
  file: File,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  const formData = new FormData();
  formData.append("file", file);

  return await peakLimsApi
    .post(`/accessionAttachments/uploadTo/${accessionId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    })
    .then((response: AxiosResponse) => {
      if (response.status !== 204) {
        throw new Error("Failed to upload the attachment");
      }
      return response;
    });
};

export const useUploadAccessionAttachment = () => {
  return useMutation(
    (params: {
      accessionId: string;
      file: File;
      onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
    }) =>
      uploadAccessionAttachment(
        params.accessionId,
        params.file,
        params.onUploadProgress
      )
  );
};

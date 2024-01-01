import { AccessionKeys } from "@/domain/accessions/apis/accession.keys";
import { peakLimsApi } from "@/services/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      accessionId: string;
      file: File;
      onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
      skipQueryInvalidation?: boolean;
    }) =>
      uploadAccessionAttachment(
        params.accessionId,
        params.file,
        params.onUploadProgress
      ),
    onMutate: (variables) => {
      return {
        accessionId: variables.accessionId,
        skipQueryInvalidation: variables.skipQueryInvalidation,
      };
    },
    onSettled: (_, __, context: MutationContext | undefined) => {
      if (context && !context.skipQueryInvalidation) {
        queryClient.invalidateQueries(AccessionKeys.lists());
        queryClient.invalidateQueries(
          AccessionKeys.forEdit(context.accessionId)
        );
      }
    },
  });
};

type MutationContext = {
  accessionId: string;
  skipQueryInvalidation?: boolean;
};

// **NOTE** this works as a single batch call for all the promises so
// you can do a single invalidateQueries call, but the progress tracker breaks
export const useUploadAccessionAttachments = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (params: {
      accessionId: string;
      files: File[];
      onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
    }) => {
      const promises = params.files.map((file) =>
        uploadAccessionAttachment(
          params.accessionId,
          file,
          params.onUploadProgress
        )
      );
      return Promise.allSettled(promises);
    },
    {
      onMutate: (variables) => {
        return { accessionId: variables.accessionId };
      },
      onSettled: (_, __, context: MutationContext | undefined) => {
        if (context) {
          queryClient.invalidateQueries(AccessionKeys.lists());
          queryClient.invalidateQueries(
            AccessionKeys.forEdit(context.accessionId)
          );
        }
      },
    }
  );
};

import { peakLimsApi } from "@/services/api-client";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AccessionCommentForCreationDto } from "../types";
import { AccessionCommentKeys } from "./accession-comment.keys";

export const addAccessionComment = async (
  data: AccessionCommentForCreationDto
) => {
  return peakLimsApi
    .post(`/v1/accessionComments`, data)
    .then((response) => response.data);
};

type CommentMutationContext = {
  accessionId: string;
};

export interface AddCommentProps {
  data: AccessionCommentForCreationDto;
}

export function useAddAccessionComment(
  options?: UseMutationOptions<
    void,
    AxiosError,
    AddCommentProps,
    CommentMutationContext
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data }: AddCommentProps) => addAccessionComment(data),
    onMutate: (variables) => {
      return { accessionId: variables.data.accessionId };
    },
    onSuccess: (_, __, context: CommentMutationContext | undefined) => {
      if (context) {
        queryClient.invalidateQueries({
          queryKey: AccessionCommentKeys.byAccession(context.accessionId!)
        });
      }
    },
    ...options,
  });
}

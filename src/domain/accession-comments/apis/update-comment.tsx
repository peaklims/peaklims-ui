import { peakLimsApi } from "@/services/api-client";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AccessionCommentKeys } from "./accession-comment.keys";

export const updateAccessionComment = async (
  commentId: string,
  newComment: string
) => {
  return peakLimsApi
    .put(`/accessionComments/${commentId}`, { comment: newComment })
    .then((response) => response.data);
};

type CommentMutationContext = {
  accessionId: string;
};

export interface AddCommentProps {
  accessionId: string;
  commentId: string;
  newComment: string;
}

export function useUpdateAccessionComment(
  options?: UseMutationOptions<
    void,
    AxiosError,
    AddCommentProps,
    CommentMutationContext
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ accessionId, commentId, newComment }: AddCommentProps) =>
      updateAccessionComment(commentId, newComment),
    onMutate: (variables) => {
      return { accessionId: variables.accessionId };
    },
    onSuccess: (_, __, context: CommentMutationContext | undefined) => {
      if (context) {
        queryClient.invalidateQueries(
          AccessionCommentKeys.byAccession(context.accessionId!)
        );
      }
    },
    ...options,
  });
}

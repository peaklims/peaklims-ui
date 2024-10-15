import { peakLimsApi } from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { AccessionCommentViewDto } from "../types";
import { AccessionCommentKeys } from "./accession-comment.keys";

export const getAccessionComment = async (accessionId: string) => {
  return peakLimsApi
    .get(`/v1/accessionComments/byAccession/${accessionId}`)
    .then((response: AxiosResponse<AccessionCommentViewDto>) => response.data);
};

export const useGetAccessionComment = (accessionId: string | undefined) => {
  return useQuery({
    queryKey: AccessionCommentKeys.byAccession(accessionId!),
    queryFn: () => getAccessionComment(accessionId!),
    enabled: accessionId !== null && accessionId !== undefined,
  });
};

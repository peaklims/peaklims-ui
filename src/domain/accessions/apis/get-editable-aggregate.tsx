import { peakLimsApi } from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { EditableAccessionDto } from "../types";
import { AccessionKeys } from "./accession.keys";

export const getAccessionForEdit = async (id: string) => {
  return peakLimsApi
    .get(`/accessions/${id}/forAggregateEdit`)
    .then((response: AxiosResponse<EditableAccessionDto>) => response.data);
};

export const useGetAccessionForEdit = (
  accessionId: string | null | undefined
) => {
  return useQuery({
    queryKey: AccessionKeys.forEdit(accessionId!),
    queryFn: () => getAccessionForEdit(accessionId!),
    enabled: accessionId !== null && accessionId !== undefined,
    staleTime: 3000,
    gcTime: 3000,
  });
};

import { peakLimsApi } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { EditableAccessionDto } from "../types";
import { AccessionKeys } from "./accession.keys";

export const getAccessionForEdit = async (id: string) => {
  return peakLimsApi
    .get(`/accessions/${id}/forAggregateEdit`)
    .then((response: AxiosResponse<EditableAccessionDto>) => response.data);
};

export const useGetAccessionForEdit = (id: string | null | undefined) => {
  return useQuery(AccessionKeys.detail(id!), () => getAccessionForEdit(id!), {
    enabled: id !== null && id !== undefined,
  });
};

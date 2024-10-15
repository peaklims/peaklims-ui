import { AccessionKeys } from "@/domain/accessions/apis/accession.keys";
import { peakLimsApi } from "@/services/api-client";
import { toDateOnly } from "@/utils/dates";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { SampleForUpdateDto } from "../types";
import { SampleKeys } from "./sample.keys";

export const updateSample = async (id: string, data: SampleForUpdateDto) => {
  data = {
    ...data,
    collectionDate: toDateOnly(data.collectionDate),
    receivedDate: toDateOnly(data.receivedDate),
  };
  return peakLimsApi
    .put(`/v1/samples/${id}`, data)
    .then((response) => response.data);
};

export interface UpdateProps {
  id: string;
  data: SampleForUpdateDto;
}

export function useUpdateSample(
  options?: UseMutationOptions<void, AxiosError, UpdateProps>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data: updatedSample }: UpdateProps) =>
      updateSample(id, updatedSample),
    onSuccess: () => {
      queryClient.invalidateQueries(SampleKeys.lists());
      queryClient.invalidateQueries(AccessionKeys.forEdits());
      queryClient.invalidateQueries(SampleKeys.details());
      // queryClient.invalidateQueries(SampleKeys.detail(sampleId));
    },
    ...options,
  });
}

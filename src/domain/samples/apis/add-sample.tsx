import { AccessionKeys } from "@/domain/accessions/apis/accession.keys";
import { peakLimsApi } from "@/services/apiClient";
import { toDateOnly } from "@/utils/dates";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { SampleForCreationDto } from "../types";
import { SampleKeys } from "./sample.keys";

export const addSample = async (data: SampleForCreationDto) => {
  const collectionDate =
    data.collectionDate !== undefined && data.collectionDate !== null
      ? toDateOnly(data.collectionDate)
      : undefined;
  const receivedDate =
    data.receivedDate !== undefined && data.receivedDate !== null
      ? toDateOnly(data.receivedDate)
      : undefined;
  data = {
    ...data,
    collectionDate: collectionDate,
    receivedDate: receivedDate,
  };
  return peakLimsApi.post(`/samples`, data).then((response) => response.data);
};

export interface AddProps {
  data: SampleForCreationDto;
}

export function useAddSample(
  options?: UseMutationOptions<void, AxiosError, AddProps>
) {
  const queryClient = useQueryClient();

  return useMutation(
    ({ data: sampleData }: AddProps) => addSample(sampleData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(SampleKeys.lists());
        queryClient.invalidateQueries(AccessionKeys.forEdits());
        queryClient.invalidateQueries(SampleKeys.details());
        // queryClient.invalidateQueries(SampleKeys.detail(patientId));
      },
      ...options,
    }
  );
}

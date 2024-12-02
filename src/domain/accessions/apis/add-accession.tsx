// import { generateSieveSortOrder } from "@/utils/sorting";
import { peakLimsApi } from "@/services/api-client";
import {
  UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AccessionDto } from "../types";
import { AccessionKeys } from "./accession.keys";

const addAccession = async () => {
  return peakLimsApi
    .post("/v1/accessions")
    .then((response) => response.data as AccessionDto);
};

export function useAddAccession(
  options?: UseMutationOptions<AccessionDto, AxiosError>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => addAccession(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AccessionKeys.lists() });
    },
    ...options,
  });
}

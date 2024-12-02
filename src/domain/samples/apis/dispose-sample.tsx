import { AccessionKeys } from "@/domain/accessions/apis/accession.keys";
import { peakLimsApi } from "@/services/api-client";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { SampleKeys } from "./sample.keys";

async function disposeSample({ sampleId }: { sampleId: string }) {
  return peakLimsApi.put(`/v1/samples/${sampleId}/dispose`).then(() => {});
}

type SampleMutationContext = {
  sampleId: string;
  patientId: string;
};

export function useDisposeSample(
  options?: UseMutationOptions<
    void,
    AxiosError,
    { sampleId: string; patientId: string },
    SampleMutationContext
  >
) {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    AxiosError,
    { sampleId: string; patientId: string },
    SampleMutationContext
  >({
    mutationFn: ({ sampleId }) => disposeSample({ sampleId }),
    onMutate: ({ sampleId, patientId }) => {
      return { sampleId, patientId };
    },
    onSuccess: (_, __, context: SampleMutationContext | undefined) => {
      queryClient.invalidateQueries({ queryKey: SampleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: SampleKeys.details() });
      queryClient.invalidateQueries({ queryKey: AccessionKeys.forEdits() });

      if (context?.patientId) {
        queryClient.invalidateQueries({ queryKey: SampleKeys.byPatient(context.patientId) });
      }
    },
    ...options,
  });
}

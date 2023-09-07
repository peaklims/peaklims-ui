import { AccessionKeys } from "@/domain/accessions/apis/accession.keys";
import { peakLimsApi } from "@/services/api-client";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { SampleKeys } from "./sample.keys";

async function deleteSample({ sampleId }: { sampleId: string }) {
  return peakLimsApi.delete(`/samples/${sampleId}`).then(() => {});
}

type SampleMutationContext = {
  sampleId: string;
  patientId: string;
};

export function useDeleteSample(
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
  >(({ sampleId }) => deleteSample({ sampleId }), {
    onMutate: ({ sampleId, patientId }) => {
      return { sampleId, patientId };
    },
    onSuccess: (_, __, context: SampleMutationContext | undefined) => {
      queryClient.invalidateQueries(SampleKeys.lists());
      queryClient.invalidateQueries(SampleKeys.details());
      queryClient.invalidateQueries(AccessionKeys.forEdits());

      if (context) {
        queryClient.invalidateQueries(SampleKeys.byPatient(context.patientId));
      }
    },
    ...options,
  });
}

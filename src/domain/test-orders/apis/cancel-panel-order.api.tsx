import { AccessionKeys } from "@/domain/accessions/apis/accession.keys";
import { PatientKeys } from "@/domain/patients/apis/patient.keys";
import { peakLimsApi } from "@/services/api-client";
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
interface PanelOrderCancellationDto {
  reason: string;
  comments: string;
}

interface UpdateProps {
  panelOrderId: string;
  data: PanelOrderCancellationDto;
}

export const cancelPanelOrder = async (
  panelOrderId: string,
  data: PanelOrderCancellationDto
) => {
  return peakLimsApi
    .put(`/v1/panelorders/${panelOrderId}/cancel`, data)
    .then((response) => response.data);
};

export function useCancelPanelOrder(
  options?: UseMutationOptions<void, AxiosError, UpdateProps>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ panelOrderId, data }: UpdateProps) =>
      cancelPanelOrder(panelOrderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PatientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: AccessionKeys.forEdits() });
      queryClient.invalidateQueries({ queryKey: PatientKeys.details() });
    },
    ...options,
  });
}

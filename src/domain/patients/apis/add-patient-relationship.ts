import { peakLimsApi } from "@/services/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PatientKeys } from "./patient.keys";

export interface AddPatientRelationshipDto {
  fromPatientId: string;
  toPatientId: string;
  fromRelationship: string;
  toRelationship: string;
  isConfirmedBidirectional: boolean;
  notes?: string;
}

export const useAddPatientRelationship = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (relationship: AddPatientRelationshipDto) => {
      return peakLimsApi.post("/v1/patients/relationship", relationship);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: PatientKeys.relationships(),
      });
    },
  });
};

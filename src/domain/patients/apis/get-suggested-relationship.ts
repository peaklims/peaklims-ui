import { peakLimsApi } from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { PatientKeys } from "./patient.keys";

export interface GetSuggestedMatchingRoleRequestDto {
  relationship: string;
  toPatientId: string;
}

export const getSuggestedRelationship = async (
  payload: GetSuggestedMatchingRoleRequestDto
): Promise<string> => {
  return peakLimsApi
    .post("/v1/patients/relationship/suggested", payload)
    .then((response: AxiosResponse<any>) => {
      if (response.data && typeof response.data.relationship === "string") {
        return response.data.relationship;
      }
      return "";
    });
};

export const useGetSuggestedRelationship = (
  payload: GetSuggestedMatchingRoleRequestDto | undefined
) => {
  return useQuery({
    queryKey: PatientKeys.suggestedRelationship(payload),
    queryFn: () => getSuggestedRelationship(payload!),
    enabled: !!payload?.relationship && !!payload?.toPatientId,
  });
};

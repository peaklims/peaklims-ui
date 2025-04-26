import { GetSuggestedMatchingRoleRequestDto } from "./get-suggested-relationship";

const PatientKeys = {
  all: ["Patients"] as const,
  lists: () => [...PatientKeys.all, "list"] as const,
  list: (queryParams: string) =>
    [...PatientKeys.lists(), { queryParams }] as const,
  details: () => [...PatientKeys.all, "detail"] as const,
  detail: (patientId: string) => [...PatientKeys.details(), patientId] as const,
  relationships: () => [...PatientKeys.all, "relationships"] as const,
  relationship: (patientId: string) =>
    [...PatientKeys.relationships(), patientId] as const,
  searchExistingPatients: () =>
    [...PatientKeys.all, "searchExistingPatient"] as const,
  searchExistingPatient: (queryParams: string) =>
    [...PatientKeys.searchExistingPatients(), { queryParams }] as const,
  suggestedRelationship: (payload: GetSuggestedMatchingRoleRequestDto) =>
    [...PatientKeys.all, "suggestedRelationship", payload] as const,
};

export { PatientKeys };

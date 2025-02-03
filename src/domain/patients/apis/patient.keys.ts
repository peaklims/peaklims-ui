const PatientKeys = {
  all: ["Patients"] as const,
  lists: () => [...PatientKeys.all, "list"] as const,
  list: (queryParams: string) =>
    [...PatientKeys.lists(), { queryParams }] as const,
  details: () => [...PatientKeys.all, "detail"] as const,
  detail: (PatientId: string) => [...PatientKeys.details(), PatientId] as const,
  relationships: (patientId: string) =>
    [...PatientKeys.all, "relationships", patientId] as const,
  searchExistingPatients: () =>
    [...PatientKeys.all, "searchExistingPatient"] as const,
  searchExistingPatient: (queryParams: string) =>
    [...PatientKeys.searchExistingPatients(), queryParams] as const,
};

export { PatientKeys };

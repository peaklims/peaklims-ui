const SampleKeys = {
  all: ["Samples"] as const,
  lists: () => [...SampleKeys.all, "list"] as const,
  list: (queryParams: string) =>
    [...SampleKeys.lists(), { queryParams }] as const,
  full: () => [...SampleKeys.lists(), "full"] as const,
  details: () => [...SampleKeys.all, "detail"] as const,
  detail: (SampleId: string) => [...SampleKeys.details(), SampleId] as const,
  byPatients: () => [...SampleKeys.all, "byPatient"] as const,
  byPatient: (PatientId: string) =>
    [...SampleKeys.byPatients(), PatientId] as const,
};

export { SampleKeys };

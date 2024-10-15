const PeakOrganizationKeys = {
  all: ["PeakOrganizations"] as const,
  details: () => [...PeakOrganizationKeys.all, "detail"] as const,
  detail: (PeakOrganizationId: string) =>
    [...PeakOrganizationKeys.details(), PeakOrganizationId] as const,
};

export { PeakOrganizationKeys };

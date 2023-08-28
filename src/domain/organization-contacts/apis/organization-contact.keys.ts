const OrganizationContactKeys = {
  all: ["OrganizationContacts"] as const,
  lists: () => [...OrganizationContactKeys.all, "list"] as const,
  list: (queryParams: string) =>
    [...OrganizationContactKeys.lists(), { queryParams }] as const,
  byOrgs: () => [...OrganizationContactKeys.lists(), "byOrg"] as const,
  byOrg: (OrganizationId: string) =>
    [...OrganizationContactKeys.byOrgs(), OrganizationId] as const,
  byOrgDropdown: (OrganizationId: string) =>
    [...OrganizationContactKeys.byOrgs(), OrganizationId, "dropdown"] as const,
  details: () => [...OrganizationContactKeys.all, "detail"] as const,
  detail: (OrganizationContactId: string) =>
    [...OrganizationContactKeys.details(), OrganizationContactId] as const,
};

export { OrganizationContactKeys };

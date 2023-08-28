const OrganizationKeys = {
  all: ["Organizations"] as const,
  lists: () => [...OrganizationKeys.all, "list"] as const,
  list: (queryParams: string) =>
    [...OrganizationKeys.lists(), { queryParams }] as const,
  full: () => [...OrganizationKeys.lists(), "full"] as const,
  fullDropdown: () => [...OrganizationKeys.full(), "dropdown"] as const,
  details: () => [...OrganizationKeys.all, "detail"] as const,
  detail: (OrganizationId: string) =>
    [...OrganizationKeys.details(), OrganizationId] as const,
};

export { OrganizationKeys };

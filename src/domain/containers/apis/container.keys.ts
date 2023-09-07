const ContainerKeys = {
  all: ["Containers"] as const,
  lists: () => [...ContainerKeys.all, "list"] as const,
  list: (queryParams: string) =>
    [...ContainerKeys.lists(), { queryParams }] as const,
  full: () => [...ContainerKeys.lists(), "full"] as const,
  fullDropdown: () => [...ContainerKeys.full(), "dropdown"] as const,
  details: () => [...ContainerKeys.all, "detail"] as const,
  detail: (ContainerId: string) =>
    [...ContainerKeys.details(), ContainerId] as const,
};

export { ContainerKeys };

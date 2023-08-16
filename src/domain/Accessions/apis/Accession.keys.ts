const AccessionKeys = {
  all: ["Accessions"] as const,
  lists: () => [...AccessionKeys.all, "list"] as const,
  list: (queryParams: string) =>
    [...AccessionKeys.lists(), { queryParams }] as const,
  details: () => [...AccessionKeys.all, "detail"] as const,
  detail: (id: string) => [...AccessionKeys.details(), id] as const,
};

export { AccessionKeys };

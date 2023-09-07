const AccessionKeys = {
  all: ["Accessions"] as const,
  lists: () => [...AccessionKeys.all, "list"] as const,
  list: (queryParams: string) =>
    [...AccessionKeys.lists(), { queryParams }] as const,
  details: () => [...AccessionKeys.all, "detail"] as const,
  detail: (accessionId: string) =>
    [...AccessionKeys.details(), accessionId] as const,
  forEdits: () => [...AccessionKeys.all, "forEdit"] as const,
  forEdit: (accessionId: string) =>
    [...AccessionKeys.forEdits(), accessionId] as const,
};

export { AccessionKeys };

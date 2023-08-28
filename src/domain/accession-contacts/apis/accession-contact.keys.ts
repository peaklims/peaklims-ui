const AccessionContactKeys = {
  all: ["AccessionContacts"] as const,
  lists: () => [...AccessionContactKeys.all, "list"] as const,
  list: (queryParams: string) =>
    [...AccessionContactKeys.lists(), { queryParams }] as const,
  byAccessions: () => [...AccessionContactKeys.lists(), "byAccession"] as const,
  byAccession: (AccessionId: string) =>
    [...AccessionContactKeys.byAccessions(), AccessionId] as const,
  details: () => [...AccessionContactKeys.all, "detail"] as const,
  detail: (AccessionContactId: string) =>
    [...AccessionContactKeys.details(), AccessionContactId] as const,
};

export { AccessionContactKeys };

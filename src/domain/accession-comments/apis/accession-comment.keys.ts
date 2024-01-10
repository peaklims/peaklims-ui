const AccessionCommentKeys = {
  all: ["AccessionComments"] as const,
  byAccessions: () => [...AccessionCommentKeys.all, "byAccession"] as const,
  byAccession: (accessionId: string) =>
    [...AccessionCommentKeys.byAccessions(), accessionId] as const,
};

export { AccessionCommentKeys };

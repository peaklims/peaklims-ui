const TestOrderKeys = {
  all: ["TestOrders"] as const,
  lists: () => [...TestOrderKeys.all, "list"] as const,
  list: (queryParams: string) =>
    [...TestOrderKeys.lists(), { queryParams }] as const,
  orderables: () => [...TestOrderKeys.lists(), "orderables"] as const,
  details: () => [...TestOrderKeys.all, "detail"] as const,
  detail: (TestOrderId: string) =>
    [...TestOrderKeys.details(), TestOrderId] as const,
};

export { TestOrderKeys };

import { peakLimsApi } from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { TestOrderKeys } from "./test-order.keys";

export const GetTestOrderCancellationReasons = async () => {
  return peakLimsApi
    .get(`/testOrders/cancellationReasons`)
    .then((response: AxiosResponse<string[]>) => response.data);
};

export const useGetTestOrderCancellationReasons = () => {
  return useQuery({
    queryKey: TestOrderKeys.testOrderCancellationReasons(),
    queryFn: () => GetTestOrderCancellationReasons(),
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

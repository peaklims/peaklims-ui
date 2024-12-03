import { peakLimsApi } from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { TestOrderKeys } from "./test-order.keys";

export const GetPanelOrderCancellationReasons = async () => {
  return peakLimsApi
    .get(`/v1/panelOrders/cancellationReasons`)
    .then((response: AxiosResponse<string[]>) => response.data);
};

export const useGetPanelOrderCancellationReasons = () => {
  return useQuery({
    queryKey: TestOrderKeys.panelOrderCancellationReasons(),
    queryFn: () => GetPanelOrderCancellationReasons(),
    staleTime: Infinity,
    gcTime: Infinity,
  });
};

import { peakLimsApi } from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { TestOrderKeys } from "./test-order.keys";

export const GetOrderables = async () => {
  return peakLimsApi
    .get(`/v1/testOrders/orderablePanelsAndTests`)
    .then(
      (response: AxiosResponse<OrderablePanelsAndTestsDto>) => response.data
    );
};

export const useGetOrderables = () => {
  return useQuery({
    queryKey: TestOrderKeys.orderables(),
    queryFn: () => GetOrderables(),
  });
};

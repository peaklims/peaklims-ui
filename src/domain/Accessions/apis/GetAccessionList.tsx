import { PagedResponse, Pagination } from "@/types/apis";
// import { generateSieveSortOrder } from "@/utils/sorting";
import { peakLimsApi } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import queryString from "query-string";
import { AccessionDto, QueryParams } from "../types";
import { AccessionKeys } from "./Accession.keys";

interface delayProps {
  hasArtificialDelay?: boolean;
  delayInMs?: number;
}

interface AccessionListApiProps extends delayProps {
  queryString: string;
}
const getAccessions = async ({
  queryString,
  hasArtificialDelay,
  delayInMs,
}: AccessionListApiProps) => {
  queryString = queryString?.length <= 0 ? queryString : `?${queryString}`;

  delayInMs = hasArtificialDelay ? delayInMs : 0;

  const [json] = await Promise.all([
    peakLimsApi
      .get(`/accessions${queryString}`)
      .then((response: AxiosResponse<AccessionDto[]>) => {
        return {
          data: response.data as AccessionDto[],
          pagination: JSON.parse(
            response.headers["x-pagination"] ?? ""
          ) as Pagination,
        } as PagedResponse<AccessionDto>;
      }),
    new Promise((resolve) => setTimeout(resolve, delayInMs)),
  ]);
  return json;
};

interface AccessionListHookProps extends QueryParams, delayProps {}
export const useAccessions = ({
  pageNumber,
  pageSize,
  filters,
  sortOrder,
  delayInMs = 0,
}: AccessionListHookProps = {}) => {
  const sortOrderString = undefined; // generateSieveSortOrder(sortOrder);
  const queryParams = queryString.stringify({
    pageNumber,
    pageSize,
    filters,
    sortOrder: sortOrderString,
  });
  const hasArtificialDelay = delayInMs > 0;

  return useQuery(AccessionKeys.list(queryParams ?? ""), () =>
    getAccessions({ queryString: queryParams, hasArtificialDelay, delayInMs })
  );
};

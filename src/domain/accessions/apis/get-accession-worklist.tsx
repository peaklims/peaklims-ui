import { PagedResponse, Pagination } from "@/types/apis";
// import { generateSieveSortOrder } from "@/utils/sorting";
import { peakLimsApi } from "@/services/api-client";
import { useQuery } from "@tanstack/react-query";
import { SortingState } from "@tanstack/react-table";
import { AxiosResponse } from "axios";
import queryString from "query-string";
import { AccessionWorklistDto, QueryParams } from "../types";
import { AccessionKeys } from "./accession.keys";

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
      .get(`/accessions/worklist${queryString}`)
      .then((response: AxiosResponse<AccessionWorklistDto[]>) => {
        return {
          data: response.data as AccessionWorklistDto[],
          pagination: JSON.parse(
            response.headers["x-pagination"] ?? ""
          ) as Pagination,
        } as PagedResponse<AccessionWorklistDto>;
      }),
    new Promise((resolve) => setTimeout(resolve, delayInMs)),
  ]);
  return json;
};

interface AccessionListHookProps extends QueryParams, delayProps {}
export const useAccessioningWorklist = ({
  pageNumber,
  pageSize,
  filters,
  sortOrder,
  delayInMs = 0,
}: AccessionListHookProps = {}) => {
  const sortOrderString = generateSieveSortOrder(sortOrder);
  const queryParams = queryString.stringify({
    pageNumber,
    pageSize,
    filters,
    sortOrder: sortOrderString,
  });
  const hasArtificialDelay = delayInMs > 0;

  return useQuery(
    AccessionKeys.list(queryParams ?? ""),
    () =>
      getAccessions({
        queryString: queryParams,
        hasArtificialDelay,
        delayInMs,
      }),
    {
      cacheTime: 1000 * 60 * 0.125,
    }
  );
};

// TODO: add tests
export const generateSieveSortOrder = (sortOrder: SortingState | undefined) =>
  sortOrder && sortOrder.length > 0
    ? sortOrder?.map((s) => (s.desc ? `-${s.id}` : s.id)).join(",")
    : undefined;

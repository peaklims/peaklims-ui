import { PagedResponse, Pagination } from "@/types/apis";
// import { generateSieveSortOrder } from "@/utils/sorting";
import { peakLimsApi } from "@/services/apiClient";
import { useQuery } from "@tanstack/react-query";
import { SortingState } from "@tanstack/react-table";
import { AxiosResponse } from "axios";
import queryString from "query-string";
import { PatientSearchResultDto, QueryParams } from "../types";
import { PatientKeys } from "./patient.keys";

interface delayProps {
  hasArtificialDelay?: boolean;
  delayInMs?: number;
}

interface PatientListApiProps extends delayProps {
  queryString: string;
}
const getExistingPatientSearch = async ({
  queryString,
  hasArtificialDelay,
  delayInMs,
}: PatientListApiProps) => {
  queryString = queryString?.length <= 0 ? queryString : `?${queryString}`;

  delayInMs = hasArtificialDelay ? delayInMs : 0;

  const [json] = await Promise.all([
    peakLimsApi
      .get(`/patients/searchExistingPatients${queryString}`)
      .then((response: AxiosResponse<PatientSearchResultDto[]>) => {
        return {
          data: response.data as PatientSearchResultDto[],
          pagination: JSON.parse(
            response.headers["x-pagination"] ?? ""
          ) as Pagination,
        } as PagedResponse<PatientSearchResultDto>;
      }),
    new Promise((resolve) => setTimeout(resolve, delayInMs)),
  ]);
  return json;
};

interface PatientListHookProps extends QueryParams, delayProps {}
export const useExistingPatientSearch = ({
  pageNumber,
  pageSize,
  filters,
  sortOrder,
  delayInMs = 0,
}: PatientListHookProps = {}) => {
  const sortOrderString = generateSieveSortOrder(sortOrder);
  const queryParams = queryString.stringify({
    pageNumber,
    pageSize,
    filters,
    sortOrder: sortOrderString,
  });
  const hasArtificialDelay = delayInMs > 0;

  return useQuery(
    PatientKeys.searchExistingPatient(queryParams ?? ""),
    () =>
      getExistingPatientSearch({
        queryString: queryParams,
        hasArtificialDelay,
        delayInMs,
      }),
    {
      enabled: filters !== undefined && (filters?.length ?? 0) > 0,
    }
  );
};

// TODO: add tests
export const generateSieveSortOrder = (sortOrder: SortingState | undefined) =>
  sortOrder && sortOrder.length > 0
    ? sortOrder?.map((s) => (s.desc ? `-${s.id}` : s.id)).join(",")
    : undefined;

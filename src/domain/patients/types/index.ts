import { SortingState } from "@tanstack/react-table";

export interface QueryParams {
  pageNumber?: number;
  pageSize?: number;
  filters?: string;
  sortOrder?: SortingState;
}

export type PatientSearchResultDto = {
  id: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  dateOfBirth?: Date;
  internalId: string;
  sex: string;

  accessions: {
    id: string;
    accessionNumber: string;
  }[];
};

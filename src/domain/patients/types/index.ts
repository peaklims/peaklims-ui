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

export type PatientDto = {
  id: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  dateOfBirth?: Date;
  internalId: string;
  sex: string;
  race?: string;
  ethnicity?: string;
};

export type PatientForUpdateDto = {
  id: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date | undefined;
  sex: string;
  race?: string;
  ethnicity?: string;
};

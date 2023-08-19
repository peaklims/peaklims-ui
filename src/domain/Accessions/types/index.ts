import { SortingState } from "@tanstack/react-table";

export interface QueryParams {
  pageNumber?: number;
  pageSize?: number;
  filters?: string;
  sortOrder?: SortingState;
}

export type AccessionWorklistDto = {
  id: string;
  accessionNumber: string;
  status: string;
  patient: {
    firstName?: string;
    lastName?: string;
    age?: number;
  };
};

export type AccessionDto = {
  id: string;
  accessionNumber: string;
  status: string;
};

// need a string enum list?
// const StatusList = ['Status1', 'Status2', null] as const;
// export type Status = typeof StatusList[number];
// Then use as --> status: Status;

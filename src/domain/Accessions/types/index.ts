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
  organizationName: string;
  patient: {
    firstName?: string;
    lastName?: string;
    age?: number;
  };
};

export type EditableAccessionDto = {
  id: string;
  accessionNumber: string;
  status: string;
  organizationId: string | undefined;
  patient:
    | {
        id: string;
        firstName?: string;
        lastName?: string;
        age?: number;
        dateOfBirth?: Date;
        race?: string;
        ethnicity?: string;
        internalId: string;
        sex: string;
      }
    | undefined;
};

export type AccessionDto = {
  id: string;
  accessionNumber: string;
  status: string;
};

export type AccessionStatus =
  | "Draft"
  | "Ready For Testing"
  | "Testing"
  | "Testing Complete"
  | "Report Pending"
  | "Report Complete"
  | "Completed"
  | "Abandoned"
  | "Cancelled"
  | "Qns";

// need a string enum list?
// const StatusList = ['Status1', 'Status2', null] as const;
// export type Status = typeof StatusList[number];
// Then use as --> status: Status;

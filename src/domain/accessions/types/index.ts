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
  accessionContacts: AccessionContactDto[];
  testOrders: TestOrderDto[];
  attachments: AccessionAttachmentDto[];
};

export type AccessionAttachmentDto = {
  id: string;
  type?: string | null;
  filename: string;
  comments?: string | null;
  displayName: string;
  preSignedUrl: string;
};

export type TestOrderDto = {
  id: string;
  testId: string;
  testName: string;
  panel: {
    id: string;
    panelCode: string;
    panelName: string;
    type: string;
    version: number;
    panelOrderId: string;
  };
  testCode: string;
  status: string;
  dueDate: Date | null;
  tat: number | null;
  cancellationReason: string | null;
  cancellationComments: string | null;
  isPartOfPanel: boolean;
};

export type AccessionContactDto = {
  id: string;
  firstName: string;
  lastName: string;
  targetType: string;
  targetValue: string;
  npi: string;
  organizationContactId: string;
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

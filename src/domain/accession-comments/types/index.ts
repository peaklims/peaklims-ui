export type AccessionCommentViewDto = {
  accessionComments: AccessionCommentItemDto[];
};

export type AccessionCommentItemDto = {
  id: string;
  comment: string;
  createdDate: Date;
  createdByFirstName: string;
  createdByLastName: string;
  createdById: string;
  ownedByCurrentUser: boolean;
  originalCommentAt: Date;
  history: AccessionCommentHistoryRecordDto[];
};

export type AccessionCommentHistoryRecordDto = {
  id: string;
  comment: string;
  createdDate: Date;
  createdByFirstName: string;
  createdByLastName: string;
  createdById: string;
  ownedByCurrentUser: boolean;
};

export type AccessionCommentForCreationDto = {
  comment: string;
  accessionId: string;
};

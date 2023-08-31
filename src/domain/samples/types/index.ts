export type SampleDto = {
  id: string;
  sampleNumber: string;
  status: string;
  type: string;
  collectionDate: Date;
  receivedDate: Date | undefined | null;
  collectionSite: string | undefined | null;
  containerId: string | undefined | null;
  patientId: string;
};

export type SampleForCreationDto = {
  type: string;
  quantity?: number | undefined | null;
  collectionDate?: Date | null;
  receivedDate?: Date | null;
  collectionSite?: string | undefined | null;
  containerId?: string | undefined | null;
  patientId: string;
};

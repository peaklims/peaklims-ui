export type SampleDto = {
  id: string;
  sampleNumber: string;
  externalId?: string | null;
  status: string;
  type: string;
  collectionDate: Date | undefined | null;
  receivedDate: Date | undefined | null;
  collectionSite: string | undefined | null;
  containerId: string | undefined | null;
  containerType: string | undefined | null;
  patientId: string;
};

export type SampleForCreationDto = {
  type: string;
  quantity?: number | undefined | null;
  externalId?: string | null;
  collectionDate?: Date | null;
  receivedDate?: Date | null;
  collectionSite?: string | undefined | null;
  containerId?: string | undefined | null;
  patientId: string;
};

export type SampleForUpdateDto = {
  type: string;
  quantity?: number | undefined | null;
  externalId?: string | null;
  collectionDate?: Date | null;
  receivedDate?: Date | null;
  collectionSite?: string | undefined | null;
  containerId?: string | undefined | null;
};

export type SampleStatus = "Disposed" | "Received" | "Rejected";

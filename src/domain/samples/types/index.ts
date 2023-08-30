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

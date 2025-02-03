export interface PatientData {
  id: string;
  firstName: string;
  lastName: string;
}

export interface PatientRelationshipDto {
  id: string;
  fromPatient: PatientData;
  toPatient: PatientData;
  fromRelationship: string;
  toRelationship: string;
  notes?: string;
  isBidirectional: boolean;
}

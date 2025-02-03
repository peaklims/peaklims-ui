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

export const relationshipsDropdown = [
  { value: "Son", label: "Son" },
  { value: "Daughter", label: "Daughter" },
  { value: "Father", label: "Father" },
  { value: "Mother", label: "Mother" },
  { value: "Brother", label: "Brother" },
  { value: "Sister", label: "Sister" },
  { value: "Half Brother", label: "Half Brother" },
  { value: "Half Sister", label: "Half Sister" },
  { value: "Half Brother (Maternal)", label: "Half Brother (Maternal)" },
  { value: "Half Sister (Maternal)", label: "Half Sister (Maternal)" },
  { value: "Half Brother (Paternal)", label: "Half Brother (Paternal)" },
  { value: "Half Sister (Paternal)", label: "Half Sister (Paternal)" },
  { value: "Grandfather", label: "Grandfather" },
  { value: "Grandmother", label: "Grandmother" },
  { value: "Grandfather (Maternal)", label: "Grandfather (Maternal)" },
  { value: "Grandmother (Maternal)", label: "Grandmother (Maternal)" },
  { value: "Grandfather (Paternal)", label: "Grandfather (Paternal)" },
  { value: "Grandmother (Paternal)", label: "Grandmother (Paternal)" },
  { value: "Uncle", label: "Uncle" },
  { value: "Aunt", label: "Aunt" },
  { value: "Uncle (Maternal)", label: "Uncle (Maternal)" },
  { value: "Aunt (Maternal)", label: "Aunt (Maternal)" },
  { value: "Uncle (Paternal)", label: "Uncle (Paternal)" },
  { value: "Aunt (Paternal)", label: "Aunt (Paternal)" },
  { value: "Cousin", label: "Cousin" },
  { value: "Cousin (Maternal)", label: "Cousin (Maternal)" },
  { value: "Cousin (Paternal)", label: "Cousin (Paternal)" },
  { value: "Nephew", label: "Nephew" },
  { value: "Niece", label: "Niece" },
];

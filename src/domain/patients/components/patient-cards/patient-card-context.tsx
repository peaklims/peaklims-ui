import { createContext, useContext, useState } from "react";

interface PatientCardContextResponse {
  accessionId: string | undefined;
  setAccessionId: React.Dispatch<React.SetStateAction<string | undefined>>;
  addPatientDialogIsOpen: boolean;
  setAddPatientDialogIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchExistingPatientsDialogIsOpen: boolean;
  setSearchExistingPatientsDialogIsOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

const PatientCardContext = createContext<PatientCardContextResponse>(
  {} as PatientCardContextResponse
);

interface PatientCardProviderProps {
  accessionId: string | undefined;
  children: React.ReactNode;
  props?: any;
}

export function PatientCardProvider({
  accessionId: givenAccessionId,
  props,
  children,
}: PatientCardProviderProps) {
  const [accessionId, setAccessionId] = useState<string | undefined>(
    givenAccessionId
  );
  const [addPatientDialogIsOpen, setAddPatientDialogIsOpen] = useState(false);
  const [
    searchExistingPatientsDialogIsOpen,
    setSearchExistingPatientsDialogIsOpen,
  ] = useState(false);

  const value = {
    accessionId,
    setAccessionId,
    addPatientDialogIsOpen,
    setAddPatientDialogIsOpen,
    searchExistingPatientsDialogIsOpen,
    setSearchExistingPatientsDialogIsOpen,
  };

  return (
    <PatientCardContext.Provider value={value} {...props}>
      {children}
    </PatientCardContext.Provider>
  );
}

export function usePatientCardContext() {
  const context = useContext(PatientCardContext);
  if (Object.keys(context).length === 0)
    throw new Error(
      "usePatientCardContext must be used within a PatientCardProvider"
    );
  return context;
}

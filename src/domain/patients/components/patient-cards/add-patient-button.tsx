import { Button } from "@/components/ui/button";
import {
  SetAccessionPatient,
  useSetAccessionPatient,
} from "@/domain/accessions/apis/set-accession-patient";
import { usePatientCardContext } from "@/domain/patients/components/patient-cards";
import { Modal, ModalContent, ModalHeader } from "@nextui-org/react";
import { PlusCircleIcon } from "lucide-react";
import { PatientForm } from "../patient-form";

export type PatientForCard = {
  id: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  dateOfBirth?: Date;
  race?: string;
  ethnicity?: string;
  internalId: string;
  sex: string;
};

export function AddPatientButton() {
  const { accessionId, addPatientDialogIsOpen, setAddPatientDialogIsOpen } =
    usePatientCardContext();
  const setPatientApi = useSetAccessionPatient();
  return (
    <>
      <Modal
        size="xl"
        isOpen={addPatientDialogIsOpen}
        onOpenChange={setAddPatientDialogIsOpen}
      >
        <ModalContent>
          <ModalHeader className="text-2xl font-semibold scroll-m-20">
            Add a Patient
          </ModalHeader>
          <div className="px-6 pb-2 overflow-y-auto grow gap-y-5">
            <div className="pt-0">
              <PatientForm
                onSubmit={(value) => {
                  const dto = {
                    accessionId,
                    patientForCreation: {
                      ...value,
                    },
                  } as SetAccessionPatient;
                  setPatientApi
                    .mutateAsync(dto)
                    .then(() => {
                      setAddPatientDialogIsOpen(false);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}
              />
            </div>
          </div>
        </ModalContent>
      </Modal>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setAddPatientDialogIsOpen(true)}
      >
        <PlusCircleIcon className="w-4.5 h-4.5" />
      </Button>
    </>
  );
}

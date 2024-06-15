import { Button } from "@/components/ui/button";
import { usePatientCardContext } from "@/domain/patients/components/patient-cards";
import { Modal, ModalContent, ModalHeader } from "@nextui-org/react";
import { useGetPatient } from "../../apis/get-patient";
import { useUpdatePatient } from "../../apis/update-patient";
import { PatientForUpdateDto } from "../../types/index";
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

export function EditPatientButton({ patientId }: { patientId: string }) {
  const { addPatientDialogIsOpen, setAddPatientDialogIsOpen } =
    usePatientCardContext();
  const updatePatientApi = useUpdatePatient();
  const { data: patientData } = useGetPatient(patientId);
  return (
    <>
      <Modal
        className="w-full max-w-3xl"
        isOpen={addPatientDialogIsOpen}
        onOpenChange={setAddPatientDialogIsOpen}
      >
        <div className="relative inset-0 flex">
          <ModalContent>
            <ModalHeader className="text-2xl font-semibold scroll-m-20">
              Edit Patient
            </ModalHeader>
            <div className="px-6 pb-6 overflow-y-auto grow">
              <PatientForm
                patient={patientData}
                onSubmit={(value) => {
                  const dto = { ...value } as PatientForUpdateDto;
                  updatePatientApi
                    .mutateAsync({ data: dto, id: patientId })
                    .then(() => {
                      setAddPatientDialogIsOpen(false);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}
              />
            </div>
          </ModalContent>
        </div>
      </Modal>
      <Button
        size="sm"
        variant="outline"
        className="w-[48%] sm:w-full"
        onClick={() => setAddPatientDialogIsOpen(true)}
      >
        Edit
      </Button>
    </>
  );
}

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { usePatientCardContext } from "@/domain/patients/components/patient-cards";
import { DialogTitle } from "@radix-ui/react-dialog";
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
  return (
    <>
      <div className="w-full transition-opacity">
        <Dialog
          open={addPatientDialogIsOpen}
          onOpenChange={setAddPatientDialogIsOpen}
        >
          <div className="relative inset-0 flex">
            <DialogContent>
              <div className="px-6 pb-2 -mt-8 overflow-y-auto grow gap-y-5">
                <DialogTitle className="text-2xl font-semibold scroll-m-20">
                  Edit Patient
                </DialogTitle>
                <div className="pt-6">
                  <PatientForm
                    patientId={patientId}
                    onSubmit={(value) => {
                      const dto = {
                        firstName: value.firstName,
                        lastName: value.lastName,
                        dateOfBirth: value.dateOfBirth,
                        sex: value.sex,
                        race: value.race,
                        ethnicity: value.ethnicity,
                      } as PatientForUpdateDto;
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
              </div>
            </DialogContent>
          </div>

          <DialogTrigger>
            <Button size="sm" variant="outline" className="w-full">
              Edit
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
    </>
  );
}

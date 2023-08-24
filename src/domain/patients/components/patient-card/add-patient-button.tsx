import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  SetAccessionPatient,
  useSetAccessionPatient,
} from "@/domain/accessions/apis/set-accession-patient";
import { DialogTitle } from "@radix-ui/react-dialog";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
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

export function AddPatientButton({ accessionId }: { accessionId: string }) {
  const setPatientApi = useSetAccessionPatient();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="transition-opacity">
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <div className="relative inset-0 flex">
                  <DialogContent>
                    <div className="px-6 pb-2 -mt-8 overflow-y-auto grow gap-y-5">
                      <DialogTitle className="text-2xl font-semibold scroll-m-20">
                        Add a Patient
                      </DialogTitle>
                      <div className="pt-6">
                        <PatientForm
                          onSubmit={(value) => {
                            const dto = {
                              accessionId,
                              patientForCreation: {
                                firstName: value.firstName,
                                lastName: value.lastName,
                                dateOfBirth: value.dateOfBirth,
                                sex: value.sex,
                                race: value.race,
                                ethnicity: value.ethnicity,
                              },
                            } as SetAccessionPatient;
                            setPatientApi
                              .mutateAsync(dto)
                              .then(() => {
                                setIsOpen(false);
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
                  <Button size="sm" variant="outline">
                    <PlusCircleIcon className="w-5 h-5" />
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add a patient</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}

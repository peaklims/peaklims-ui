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
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { PatientForm } from "./patient-form";
export function PatientCard() {
  return (
    <div className="group flex min-h-[5rem] overflow-hidden rounded-lg border border-emerald-500 shadow-md max-w-lg">
      <div className="flex items-center justify-center px-2 py-2 border shadow-sm border-emerald-500 bg-emerald-500 shadow-emerald-700">
        <div className="p-1 border border-white rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </div>
      </div>
      <div className="flex items-stretch flex-1 px-4 py-3 bg-slate-50">
        <div>
          <div className="items-center justify-between sm:flex">
            <p className="text-2xl text-slate-800">Paul DeVito</p>
            <p className="max-w-[7rem] rounded bg-gradient-to-r from-emerald-400 to-emerald-600 px-1 py-1 text-xs font-bold text-white shadow-md">
              PAT-776321343
            </p>
          </div>
          <div className="sm:flex sm:items-end sm:justify-end">
            <div className="space-y-1 pt-0.5">
              <p className="text-slate-600">32 year old Male</p>
              <div className="flex items-center justify-start space-x-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4 text-slate-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z"
                  />
                </svg>
                <p className="text-xs font-medium text-slate-600">06/18/1991</p>
              </div>
              <p className="text-xs font-medium text-slate-600">
                White - Not of Hispanic, Spanish, or Latino origin with more
                text here
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 space-x-2 sm:pt-0 sm:justify-end sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
              <Button className="w-[48%]" size="sm" variant="outline">
                Edit
              </Button>
              <Button className="w-[48%]" size="sm" variant="outline">
                Remove
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EmptyPatientCard({
  accessionId,
}: {
  accessionId: string | undefined;
}) {
  return (
    <div className="group flex min-h-[5rem] overflow-hidden rounded-lg border border-emerald-500 shadow-md max-w-lg">
      <div className="flex items-center justify-center px-2 py-2 border shadow-sm border-emerald-500 bg-emerald-500 shadow-emerald-700">
        <div className="p-1 border border-white rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </div>
      </div>
      <div className="flex items-center flex-1 px-4 py-3 bg-slate-50">
        <div className="flex items-center justify-between w-full">
          <p className="select-none text-slate-800">No patient selected</p>
          <div className="flex space-x-2">
            <SearchExistingPatientsButton />
            {accessionId && <AddPatientButton accessionId={accessionId} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function AddPatientButton({ accessionId }: { accessionId: string }) {
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
                                console.log("Patient added");
                              })
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

function SearchExistingPatientsButton() {
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="transition-opacity">
              <Dialog>
                <div className="relative inset-0 flex">
                  <DialogContent>
                    <div className="px-6 pb-2 -mt-8 overflow-y-auto grow gap-y-5">
                      <DialogTitle className="text-2xl font-semibold scroll-m-20">
                        Find a Patient
                      </DialogTitle>
                      <div className="pt-6">TODO Form</div>
                    </div>
                  </DialogContent>
                </div>

                <DialogTrigger>
                  <Button size="sm" variant="outline">
                    <SearchIcon className="w-5 h-5" />
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Search for an existing patient</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}

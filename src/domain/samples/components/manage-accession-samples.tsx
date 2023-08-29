import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useGetPatientSamples } from "@/domain/samples/apis/get-patient-samples";
import { DialogTitle } from "@radix-ui/react-dialog";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { SampleForm } from "./sample-form";

export function ManageAccessionSamples({
  patientId,
}: {
  patientId: string | undefined;
}) {
  const { data: samples } = useGetPatientSamples({
    patientId: patientId ?? "",
  });
  console.log("samples", samples);
  return (
    <div className="flex items-center justify-between w-full">
      <h3 className="text-xl font-semibold tracking-tight">
        Manage Patient Samples
      </h3>
      <AddSampleButton patientId={patientId} />
    </div>
  );
}

export type SampleForCard = {
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

export function AddSampleButton({
  patientId,
}: {
  patientId: string | undefined;
}) {
  const [sampleFormIsOpen, setSampleFormIsOpen] = useState(false);
  return (
    <>
      <div className="transition-opacity">
        <Dialog open={sampleFormIsOpen} onOpenChange={setSampleFormIsOpen}>
          <div className="relative inset-0 flex">
            <DialogContent>
              <div className="px-6 pb-2 -mt-8 overflow-y-auto grow gap-y-5">
                <DialogTitle className="text-2xl font-semibold scroll-m-20">
                  Add a Sample
                </DialogTitle>
                <div className="pt-6">
                  <SampleForm
                    onSubmit={(value) => {
                      // const dto = {
                      //   accessionId,
                      //   patientForCreation: {
                      //     firstName: value.firstName,
                      //     lastName: value.lastName,
                      //     dateOfBirth: value.dateOfBirth,
                      //     sex: value.sex,
                      //     race: value.race,
                      //     ethnicity: value.ethnicity,
                      //   },
                      // } as SetAccessionSample;
                      // setSampleApi
                      //   .mutateAsync(dto)
                      //   .then(() => {
                      //     setSampleFormIsOpen(false);
                      //   })
                      //   .catch((err) => {
                      //     console.log(err);
                      //   });
                    }}
                  />
                </div>
              </div>
            </DialogContent>
          </div>

          <DialogTrigger asChild>
            <Button size="sm" variant="outline" aria-description="Add a Sample">
              <PlusCircleIcon className="w-5 h-5" />
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
    </>
  );
}

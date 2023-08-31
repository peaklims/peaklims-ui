import { Notification } from "@/components/notifications";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { useAddSample } from "../apis/add-sample";
import { SampleForCreationDto } from "../types/index";
import { SampleForm } from "./sample-form";

export function ManageAccessionSamples({
  patientId,
  samples,
}: {
  patientId: string | undefined;
  samples: SampleDto[] | undefined;
}) {
  return (
    <div className="">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-xl font-semibold tracking-tight">
          Manage Patient Samples
        </h3>
        <AddSampleButton patientId={patientId} />
      </div>

      <div className="space-y-4">
        {(samples?.length ?? 0) > 0 ? (
          <>
            {samples!.map((sample) => (
              <div key={sample.id} className="">
                <p>{sample.sampleNumber}</p>
                <p>Sample Type: {sample.type}</p>
                <p>Collection Date: {sample.collectionDate}</p>
                <p>Received Date: {sample.receivedDate}</p>
              </div>
            ))}
          </>
        ) : (
          <div>No samples have been added for this patient</div>
        )}
      </div>
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
  const addSampleApi = useAddSample();
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
                      if (patientId === undefined) return;

                      const dto = {
                        type: value.type,
                        collectionDate: value.collectionDate,
                        receivedDate: value.receivedDate,
                        patientId: patientId,
                      } as SampleForCreationDto;
                      addSampleApi
                        .mutateAsync({ data: dto })
                        .then(() => {
                          setSampleFormIsOpen(false);
                        })
                        .catch((err) => {
                          Notification.error("Error adding sample");
                          console.log(err);
                        });
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

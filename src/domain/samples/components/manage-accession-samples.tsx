import { Notification } from "@/components/notifications";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Row } from "@tanstack/react-table";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { useAddSample } from "../apis/add-sample";
import { useDeleteSample } from "../apis/delete-sample";
import { SampleDto, SampleForCreationDto } from "../types/index";
import { SampleForm } from "./sample-form";
import { PatientSamples } from "./worklist/patient-samples";
import { createColumns } from "./worklist/patient-samples-columns";

export function ManageAccessionSamples({
  patientId,
  samples,
}: {
  patientId: string | undefined;
  samples: SampleDto[] | undefined;
}) {
  const deleteSampleApi = useDeleteSample();
  function deleteSample({ sampleId }: { sampleId: string }) {
    if (patientId === undefined) {
      Notification.error("Invalid patientId");
      return;
    }

    deleteSampleApi.mutateAsync({ sampleId, patientId }).catch((e) => {
      Notification.error("There was an error deleting the Sample");
      console.error(e);
    });
  }
  const onDeleteAction = (row: Row<SampleDto>) => {
    // TODO are you sure modal
    // openDeleteModal({
    //   onConfirm: () => deleteSample(row.getValue()),
    // });
    deleteSample({ sampleId: row.getValue("id") });
  };
  const columns = createColumns(onDeleteAction);

  return (
    <div className="">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-xl font-semibold tracking-tight">
          Manage Patient Samples
        </h3>
        <AddSampleButton patientId={patientId} />
      </div>

      <div className="pt-3">
        <PatientSamples
          columns={columns}
          data={samples ?? []}
          isLoading={false}
        />
      </div>
    </div>
  );
}

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
                        ...value,
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

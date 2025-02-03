import { ConfirmModal } from "@/components/confirm-modal";
import { Notification } from "@/components/notifications";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Row } from "@tanstack/react-table";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { useAddSample } from "../apis/add-sample";
import { useDeleteSample } from "../apis/delete-sample";
import { useDisposeSample } from "../apis/dispose-sample";
import { SampleDto, SampleForCreationDto } from "../types/index";
import { SampleForm } from "./sample-form";
import { PatientSamples } from "./worklist/patient-samples";
import { sampleTableColumns } from "./worklist/patient-samples-columns";

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
  const {
    isOpen: deleteModalIsOpen,
    onOpen: onDeleteModalOpen,
    onOpenChange: onDeleteModalOpenChange,
  } = useDisclosure();
  const onDeleteAction = (row: Row<SampleDto>) => {
    onDeleteModalOpen();
    setSampleIdToEdit(row.getValue("id"));
  };
  const disposeSampleApi = useDisposeSample();
  function disposeSample({ sampleId }: { sampleId: string }) {
    if (patientId === undefined) {
      Notification.error("Invalid patientId");
      return;
    }

    disposeSampleApi.mutateAsync({ sampleId, patientId }).catch((e) => {
      Notification.error("There was an error disposing the Sample");
      console.error(e);
    });
  }
  const {
    isOpen: disposeModalIsOpen,
    onOpen: onDisposeModalOpen,
    onOpenChange: onDisposeModalOpenChange,
  } = useDisclosure();
  const onDisposeAction = (row: Row<SampleDto>) => {
    onDisposeModalOpen();
    setSampleIdToEdit(row.getValue("id"));
  };

  const columns = sampleTableColumns(onDeleteAction, onDisposeAction);

  const [sampleIdToEdit, setSampleIdToEdit] = useState<string | undefined>(
    undefined
  );

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
      <ConfirmModal
        content={<p>Are you sure you want to dispose this sample?</p>}
        labels={{
          confirm: "Dispose",
          cancel: "Cancel",
        }}
        confirmationType="danger"
        onConfirm={() => {
          disposeSample({ sampleId: sampleIdToEdit! });
        }}
        onCancel={() => {}}
        isOpen={disposeModalIsOpen}
        onOpenChange={onDisposeModalOpenChange}
        title="Dispose Sample?"
      />
      <ConfirmModal
        content={<p>Are you sure you want to delete this sample?</p>}
        labels={{
          confirm: "Delete",
          cancel: "Cancel",
        }}
        confirmationType="danger"
        onConfirm={() => {
          deleteSample({ sampleId: sampleIdToEdit! });
        }}
        onCancel={() => {}}
        isOpen={deleteModalIsOpen}
        onOpenChange={onDeleteModalOpenChange}
        title="Delete Sample?"
      />
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
      <Modal
        className="w-full max-w-3xl"
        isOpen={sampleFormIsOpen}
        onOpenChange={setSampleFormIsOpen}
        classNames={{
          base: "overflow-y-visible",
        }}
      >
        <div className="relative inset-0 flex">
          <ModalContent>
            <ModalHeader className="text-2xl font-semibold scroll-m-20">
              Add a Sample
            </ModalHeader>
            <div className="px-6 pb-2 grow gap-y-5">
              <SampleForm
                onSubmit={(value) => {
                  if (patientId === undefined) return;

                  const dto = {
                    ...value,
                    patientId: patientId,
                  } as SampleForCreationDto;
                  addSampleApi.mutateAsync({ data: dto }).then(() => {
                    setSampleFormIsOpen(false);
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
        aria-description="Add a Sample"
        onClick={() => setSampleFormIsOpen(true)}
      >
        <PlusCircleIcon className="w-4.5 h-4.5" />
      </Button>
    </>
  );
}

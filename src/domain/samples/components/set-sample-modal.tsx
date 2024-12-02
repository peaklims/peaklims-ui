import { useGetPatientSamples } from "@/domain/samples/apis/get-patient-samples";
import { cn } from "@/lib/utils";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { SetSampleForm } from "../../test-orders/components/set-sample-form";

export function SetSampleModal({
  isEditModalOpen,
  onEditModalOpenChange,
  testOrderId,
  sampleId,
  patientId,
  classNames,
}: {
  isEditModalOpen: boolean;
  onEditModalOpenChange: (isOpen: boolean) => void;
  testOrderId: string;
  sampleId: string | null;
  patientId: string | null;
  classNames?: {
    base?: string;
    backdrop?: string;
  };
}) {
  const { data } = useGetPatientSamples({ patientId });
  const patientSamples = data ?? [];
  const patientSamplesForDropdown = patientSamples.map((sample) => {
    return { value: sample.id, label: sample.sampleNumber };
  });

  return (
    <Modal
      isOpen={isEditModalOpen}
      onOpenChange={onEditModalOpenChange}
      classNames={{
        base: cn("overflow-y-visible", classNames?.base),

        // adding because motion has a weird effect on the backdrop for the test order modal under panel orders
        backdrop: cn("bg-slate-900 bg-opacity-50", classNames?.backdrop),
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Set Sample
            </ModalHeader>

            <ModalBody className="px-6 pb-2 grow gap-y-5">
              <SetSampleForm
                sampleOptions={patientSamplesForDropdown}
                testOrderId={testOrderId}
                sampleId={sampleId}
                afterSubmit={() => {
                  onClose();
                }}
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

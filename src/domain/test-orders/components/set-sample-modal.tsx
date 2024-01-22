import { useGetPatientSamples } from "@/domain/samples/apis/get-patient-samples";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { SetSampleForm } from "./set-sample-form";

export function SetSampleModalAction({
  isSampleModalOpen,
  onSampleModalOpenChange,
  testOrderId,
  sampleId,
  patientId,
}: {
  isSampleModalOpen: boolean;
  onSampleModalOpenChange: (isOpen: boolean) => void;
  testOrderId: string;
  sampleId: string | null;
  patientId: string | null;
}) {
  const { data } = useGetPatientSamples({ patientId });
  const patientSamples = data ?? [];
  const patientSamplesForDropdown = patientSamples.map((sample) => {
    return { value: sample.id, label: sample.sampleNumber };
  });

  return (
    <Modal isOpen={isSampleModalOpen} onOpenChange={onSampleModalOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Set Sample
            </ModalHeader>

            <ModalBody className="px-6 pb-2 overflow-y-auto grow gap-y-5">
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

import { useGetPatientSamples } from "@/domain/samples/apis/get-patient-samples";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import React, { ReactNode, useState } from "react";
import { SetSampleForm } from "./set-sample-form";

const SetSampleModalContext = React.createContext({
  setSetSampleDialogIsOpen: (isOpen: boolean) => {},
  sampleId: null as string | null,
  testName: null as string | null,
  testOrderId: null as string | null,
  patientId: null as string | null,
});

type SetSampleModalProps = {
  children: ReactNode;
  sampleId: string | null;
  testOrderId: string | null;
  testName: string | null;
  patientId: string | null;
  initialIsOpen?: boolean;
};

export const SetSampleModal = ({
  children,
  sampleId,
  testName,
  testOrderId,
  patientId,
  initialIsOpen = false,
}: SetSampleModalProps) => {
  const [SetSampleDialogIsOpen, setSetSampleDialogIsOpen] =
    useState(initialIsOpen);

  const { data } = useGetPatientSamples({ patientId });
  const patientSamples = data ?? [];
  const patientSamplesForDropdown = patientSamples.map((sample) => {
    return { value: sample.id, label: sample.sampleNumber };
  });

  return (
    <SetSampleModalContext.Provider
      value={{
        setSetSampleDialogIsOpen,
        sampleId,
        testName,
        patientId,
        testOrderId,
      }}
    >
      <Modal
        size="sm"
        isOpen={SetSampleDialogIsOpen}
        onOpenChange={setSetSampleDialogIsOpen}
      >
        <ModalContent>
          <ModalHeader className="text-2xl font-semibold scroll-m-20">
            Set Sample
          </ModalHeader>
          <ModalBody className="px-6 pb-2 overflow-y-auto grow gap-y-5">
            <SetSampleForm
              sampleOptions={patientSamplesForDropdown}
              testOrderId={testOrderId}
              sampleId={sampleId}
              afterSubmit={() => {
                setSetSampleDialogIsOpen(false);
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      {children}
    </SetSampleModalContext.Provider>
  );
};

type SetSampleButtonProps = {
  children?: ReactNode;
  className?: string;
};

export const SetSampleButton = ({
  children,
  className,
}: SetSampleButtonProps) => {
  const { setSetSampleDialogIsOpen } = React.useContext(SetSampleModalContext);

  return (
    <button
      className={className}
      onClick={() => setSetSampleDialogIsOpen(true)}
    >
      {children}
    </button>
  );
};

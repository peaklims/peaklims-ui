import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { AdjustDueDateForm } from "./adjust-due-date-form";

export function AdjustDueDateModal({
  isOpen,
  onOpenChange,
  testOrder,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  testOrder: {
    id: string;
    dueDate: Date | null;
  };
}) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        base: "overflow-y-visible",
      }}
    >
      <ModalContent>
        <ModalHeader className="text-xl font-semibold">
          Adjust Due Date
        </ModalHeader>
        <ModalBody className="pb-6">
          <AdjustDueDateForm
            testOrderId={testOrder.id}
            onClose={onOpenChange}
            startingDueDate={testOrder.dueDate}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

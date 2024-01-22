import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { useGetTestOrderCancellationReasons } from "../apis/get-test-order-cancellation-reasons.api";
import { CancelTestOrderForm } from "./cancel-test-order-form";

export function CancelModalAction({
  isCancelModalOpen,
  onCancelModalOpenChange,
  testOrderId,
}: {
  isCancelModalOpen: boolean;
  onCancelModalOpenChange: (isOpen: boolean) => void;
  testOrderId: string;
}) {
  const { data } = useGetTestOrderCancellationReasons();
  const reasons = data ?? [];
  const reasonsForDropdown = reasons.map((reason) => {
    return { value: reason, label: reason };
  });

  return (
    <Modal isOpen={isCancelModalOpen} onOpenChange={onCancelModalOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Cancel Test Order
            </ModalHeader>

            <ModalBody className="px-6 pb-2 overflow-y-auto grow gap-y-5">
              <CancelTestOrderForm
                cancellationReasonOptions={reasonsForDropdown}
                testOrderId={testOrderId}
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

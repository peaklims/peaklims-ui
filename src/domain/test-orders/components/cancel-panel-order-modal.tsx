import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { useGetTestOrderCancellationReasons } from "../apis/get-test-order-cancellation-reasons.api";
import { CancelPanelOrderForm } from "./cancel-panel-order-form";

export function CancelPanelOrderModal({
  isCancelModalOpen,
  onCancelModalOpenChange,
  panelOrderId,
}: {
  isCancelModalOpen: boolean;
  onCancelModalOpenChange: (isOpen: boolean) => void;
  panelOrderId: string;
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
              Cancel Panel Order
            </ModalHeader>

            <ModalBody className="px-6 pb-2 overflow-y-auto grow gap-y-5">
              <CancelPanelOrderForm
                cancellationReasonOptions={reasonsForDropdown}
                panelOrderId={panelOrderId}
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

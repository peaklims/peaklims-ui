import { cn } from "@/lib/utils";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React from "react";

type ConfirmModalProps = {
  content: React.ReactNode;
  labels: {
    confirm: string;
    cancel: string;
  };
  title: string;
  confirmationType: "primary" | "danger";
  onCancel?: () => void;
  onConfirm: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isConfirmDisabled?: boolean;
};

export const ConfirmModal = ({
  content,
  labels,
  confirmationType = "primary",
  onCancel,
  title,
  onConfirm,
  isOpen,
  onOpenChange,
  isConfirmDisabled,
}: ConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>{content}</ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={() => {
                  if (onCancel) {
                    onCancel();
                  }
                  onClose();
                }}
              >
                {labels.cancel}
              </Button>
              <Button
                color={confirmationType}
                isDisabled={isConfirmDisabled}
                onPress={() => {
                  onConfirm();
                  onClose();
                }}
                className={cn(
                  confirmationType === "primary" && "hover:bg-primary-600",
                  confirmationType === "danger" && "hover:bg-danger-600"
                )}
              >
                {labels.confirm}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

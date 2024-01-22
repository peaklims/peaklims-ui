import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";

export function CancellationInfoButton({
  cancellationReason,
  cancellationComments,
}: {
  cancellationReason: string;
  cancellationComments: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Modal size="2xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="text-2xl font-semibold scroll-m-20">
            Cancellation Info
          </ModalHeader>
          <ModalBody className="px-6 py-3 overflow-y-auto grow gap-y-2">
            <h3 className="pl-6 font-semibold">{cancellationReason}</h3>
            <div className="flex items-start justify-start space-x-3 group">
              <CopyButton
                textToCopy={cancellationComments}
                className="rounded-full"
              />
              <p className="text-gray-400 whitespace-break-spaces">
                {cancellationComments}
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              autoFocus
              onClick={() => {
                onOpenChange();
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <button onClick={onOpen} className="">
        <svg
          width={512}
          height={512}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-sky-500"
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1m-.5 5a1 1 0 1 0 0 2h.5a1 1 0 1 0 0-2zM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </>
  );
}

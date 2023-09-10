import { Button } from "@/components/ui/button";
import { usePatientCardContext } from "@/domain/patients/components/patient-cards";
import { Modal, ModalContent, ModalHeader } from "@nextui-org/react";
import { SearchIcon } from "lucide-react";
import { SearchExistingPatients } from "../search-existing-patients";

export function SearchExistingPatientsButton() {
  const {
    searchExistingPatientsDialogIsOpen,
    setSearchExistingPatientsDialogIsOpen,
  } = usePatientCardContext();

  return (
    <>
      <Modal
        className="w-full max-w-xl"
        isOpen={searchExistingPatientsDialogIsOpen}
        onOpenChange={setSearchExistingPatientsDialogIsOpen}
      >
        <ModalContent>
          <ModalHeader className="text-2xl font-semibold scroll-m-20">
            Find a Patient
          </ModalHeader>
          <div className="px-6 pb-6 overflow-y-auto grow">
            <SearchExistingPatients />
          </div>
        </ModalContent>
      </Modal>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setSearchExistingPatientsDialogIsOpen(true)}
      >
        <SearchIcon className="w-5 h-5" />
      </Button>
    </>
  );
}

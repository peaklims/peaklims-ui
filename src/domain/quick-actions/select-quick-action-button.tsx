import { PatientAvatar } from "@/components/svgs";
import { useNewAccession } from "@/domain/accessions";
import { Modal, ModalContent, ModalHeader } from "@nextui-org/react";
import { PackageOpen } from "lucide-react";
import { ReactNode } from "react";

export type PatientForCard = {
  id: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  dateOfBirth?: Date;
  race?: string;
  ethnicity?: string;
  internalId: string;
  sex: string;
};

export function SelectQuickActionButton({
  isOpen,
  setIsOpen,
  children,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: ReactNode;
}) {
  const createAccession = useNewAccession();
  const createAccessionAndClose = async () => {
    await createAccession();
    setIsOpen(false);
  };

  return (
    <>
      <Modal
        classNames={{
          base: "w-full md:w-[28rem] max-w-none",
        }}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        isDismissable={true}
        isKeyboardDismissDisabled={false}
      >
        <ModalContent>
          <ModalHeader className="flex items-center justify-between px-4 py-2 text-lg font-normal border-b border-zinc-100">
            <span>Create a new...</span>
          </ModalHeader>

          <div>
            <div className="flex flex-col items-center justify-between gap-3 p-4 md:flex-row">
              <button
                className="flex flex-row items-center w-full px-3 space-x-1 transition bg-white border rounded-md border-zinc-100 md:w-52 h-14 drop-shadow-sm hover:drop-shadow group hover:bg-emerald-500 hover:border-emerald-500"
                onClick={() => createAccessionAndClose()}
              >
                <div className="flex flex-row gap-x-2">
                  <PackageOpen
                    data-slot="icon"
                    aria-hidden="true"
                    className="text-slate-600 h-4 w-4 relative mt-0.5 group-hover:text-white"
                  />
                  <div className="flex flex-col items-start space-y-1">
                    <span className="text-sm font-medium leading-none text-dark group-hover:text-white">
                      New Accession
                    </span>
                    <span className="text-xs leading-none text-lighter group-hover:text-white">
                      Jump to a new accession
                    </span>
                  </div>
                  <div className="text-xs bg-white border border-zinc-100 p-0.5 rounded-sm leading-none text-zinc-800 min-w-4 shadow-sm absolute right-2 top-2">
                    A
                  </div>
                </div>
              </button>
              <button
                className="flex flex-row items-center w-full px-3 space-x-1 transition bg-white border rounded-md border-zinc-100 md:w-52 h-14 drop-shadow-sm hover:drop-shadow group hover:bg-emerald-500 hover:border-emerald-500"
                type="button"
              >
                <div className="flex flex-row gap-x-2">
                  <PatientAvatar
                    data-slot="icon"
                    aria-hidden="true"
                    className="text-slate-500 h-4 w-4 relative mt-0.5 group-hover:text-white"
                  />
                  <div className="flex flex-col items-start space-y-1">
                    <span className="text-sm font-medium leading-none text-dark group-hover:text-white">
                      New Patient
                    </span>
                    <span className="text-xs leading-none text-lighter group-hover:text-white">
                      Quickly add a new patient
                    </span>
                  </div>
                  <div className="text-xs bg-white border border-zinc-100 p-0.5 rounded-sm leading-none text-zinc-800 min-w-4 shadow-sm absolute right-2 top-2">
                    P
                  </div>
                </div>
              </button>
            </div>
          </div>
        </ModalContent>
      </Modal>
      {children}
    </>
  );
}

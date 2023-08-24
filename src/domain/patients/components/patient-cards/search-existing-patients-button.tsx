import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { usePatientCardContext } from "@/domain/patients/components/patient-cards";
import { DialogTitle } from "@radix-ui/react-dialog";
import { SearchIcon } from "lucide-react";
import { SearchExistingPatients } from "../search-existing-patients";

export function SearchExistingPatientsButton() {
  const {
    searchExistingPatientsDialogIsOpen,
    setSearchExistingPatientsDialogIsOpen,
  } = usePatientCardContext();
  return (
    <>
      <div className="transition-opacity">
        <Dialog
          open={searchExistingPatientsDialogIsOpen}
          onOpenChange={setSearchExistingPatientsDialogIsOpen}
        >
          <div className="relative inset-0 flex">
            <DialogContent>
              <div className="px-6 pb-2 -mt-8 overflow-y-auto grow gap-y-5">
                <DialogTitle className="text-2xl font-semibold scroll-m-20">
                  Find a Patient
                </DialogTitle>
                <SearchExistingPatients />
              </div>
            </DialogContent>
          </div>

          <DialogTrigger>
            <Button size="sm" variant="outline">
              <SearchIcon className="w-5 h-5" />
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
    </>
  );
}

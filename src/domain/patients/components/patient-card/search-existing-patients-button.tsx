import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DialogTitle } from "@radix-ui/react-dialog";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { SearchExistingPatients } from "../search-existing-patients";

export function SearchExistingPatientsButton({
  accessionId,
  openAddPatient,
}: {
  accessionId: string;
  openAddPatient: () => void;
}) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="transition-opacity">
              <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
                <div className="relative inset-0 flex">
                  <DialogContent>
                    <div className="px-6 pb-2 -mt-8 overflow-y-auto grow gap-y-5">
                      <DialogTitle className="text-2xl font-semibold scroll-m-20">
                        Find a Patient
                      </DialogTitle>
                      <SearchExistingPatients
                        onClose={() => setDialogIsOpen(false)}
                        openAddPatient={openAddPatient}
                        accessionId={accessionId}
                      />
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
          </TooltipTrigger>
          <TooltipContent>
            <p>Search for an existing patient</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}

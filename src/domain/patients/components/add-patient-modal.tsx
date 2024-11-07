import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PatientForm } from "./patient-form";

function AddPatientModal({
  accessionId,
  isOpen,
  onClose,
}: {
  accessionId: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Patient</DialogTitle>
        </DialogHeader>
        <PatientForm
          accessionId={accessionId}
          onClose={onClose}
          onSubmit={(data) => {
            // handle new patient creation
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

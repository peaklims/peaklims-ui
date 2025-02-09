import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalHeader } from "@nextui-org/react";
import { useState } from "react";
import { useAddPatientRelationship } from "../apis/add-patient-relationship";
import { useGetPatient } from "../apis/get-patient";
import { useGetPatientRelationships } from "../apis/get-patient-relationships";
import {
  PatientRelationshipForm,
  PatientRelationshipFormValues,
} from "../components/add-relationship-form";
import { PatientRelationships } from "../components/relationships/patient-relationships";
import { relationshipTableColumns } from "../components/relationships/patient-relationships-columns";

interface PatientRelationshipsTabProps {
  patientId: string;
}

export function PatientRelationshipsTab({
  patientId,
}: PatientRelationshipsTabProps) {
  const { data: relationships, isLoading } =
    useGetPatientRelationships(patientId);
  const columns = relationshipTableColumns(patientId);

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center p-4">Loading...</div>
  //   );
  // }

  // if (!relationships?.length) {
  //   return (
  //     <div className="flex items-center justify-center p-4">
  //       No relationships found for this patient.
  //     </div>
  //   );
  // }

  return (
    <div className="">
      <div className="flex items-center justify-between w-full">
        <h3 className="text-xl font-semibold tracking-tight">
          Manage Patient Relationships
        </h3>
        <AddRelationshipButton patientId={patientId} />
      </div>

      <div className="pt-3">
        <PatientRelationships
          columns={columns}
          data={relationships ?? []}
          isLoading={isLoading}
        />
        {/* <PatientRelationshipsTable patientId={patientId} /> */}
      </div>
    </div>
  );
}

interface AddRelationshipButtonProps {
  patientId: string;
}

export function AddRelationshipButton({
  patientId,
}: AddRelationshipButtonProps) {
  const [relationshipFormIsOpen, setRelationshipFormIsOpen] = useState(false);
  const { mutate, isPending } = useAddPatientRelationship();

  const handleSubmit = async (values: PatientRelationshipFormValues) => {
    await mutate(values, {
      onSuccess: () => {
        setRelationshipFormIsOpen(false);
      },
    });
  };

  const { data: patientInfo } = useGetPatient(patientId);

  return (
    <>
      <Modal
        className="w-full max-w-3xl"
        isOpen={relationshipFormIsOpen}
        onOpenChange={setRelationshipFormIsOpen}
        classNames={{
          base: "overflow-y-visible",
        }}
      >
        <div className="relative inset-0 flex">
          <ModalContent>
            <ModalHeader className="text-2xl font-semibold scroll-m-20">
              Add a Relationship
            </ModalHeader>
            <div className="px-6 pb-2 grow gap-y-5">
              <PatientRelationshipForm
                onSubmit={handleSubmit}
                fromPatientName={`${patientInfo?.firstName} ${patientInfo?.lastName}`}
                onCancel={() => setRelationshipFormIsOpen(false)}
                initialData={{ fromPatientId: patientId }}
                isSubmitting={isPending}
              />
            </div>
          </ModalContent>
        </div>
      </Modal>

      <Button onClick={() => setRelationshipFormIsOpen(true)} variant="default">
        Add Relationship
      </Button>
    </>
  );
}

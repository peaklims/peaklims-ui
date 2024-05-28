import { Notification } from "@/components/notifications";
import { useAddAccession } from "@/domain/accessions/apis/add-accession";
import { RegisteredRoutesInfo, useNavigate } from "@tanstack/react-router";

export function useNewAccession() {
  const navigate = useNavigate();
  const createAccessionApi = useAddAccession();
  return function createAccession() {
    createAccessionApi
      .mutateAsync()
      .then((data) => {
        // formMode = "Edit";
        // AccessionData = data;
        navigate({
          to: `/accessions/${data.id}` as RegisteredRoutesInfo["routePaths"],
        });
      })
      .then(() => {
        Notification.success("Accession created successfully");
      })
      .catch((e) => {
        Notification.error("There was an error creating the Accession");
        console.error(e);
      });
  };
}

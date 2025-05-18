import { Notification } from "@/components/notifications";
import { Button } from "@/components/ui/button";
import { useRemoveAccessionContact } from "@/domain/accession-contacts/apis/remove-accession-contact";
import { AccessionContactDto } from "@/domain/accessions/types";
import { MailMinus } from "lucide-react";

export function AccessionContacts({
  accessionContacts,
  accessionId,
}: {
  accessionContacts: AccessionContactDto[] | undefined;
  accessionId: string;
}) {
  const removeAccessionContactApi = useRemoveAccessionContact();

  return (
    <>
      {accessionContacts !== undefined &&
      (accessionContacts?.length ?? 0) > 0 ? (
        <div className="flex flex-col items-start w-full h-full space-y-2 ">
          {accessionContacts.map((contact) => {
            const name = [contact.firstName, contact.lastName].join(" ").trim();
            return (
              <div
                key={contact.id}
                className="flex flex-col w-full px-3 py-2 space-y-3 bg-white border rounded-md sm:flex-row sm:space-y-0"
              >
                <div className="flex items-center justify-start flex-1 pr-2">
                  <div className="">
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-xs">{contact.targetValue}</p>
                    {contact.npi?.length ?? 0 > 0 ? (
                      <p className="text-xs text-slate-400">
                        <span>#</span>
                        {contact.npi}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center justify-center w-full h-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="flex items-center justify-center w-full sm:w-auto"
                    onClick={() => {
                      removeAccessionContactApi
                        .mutateAsync({
                          accessionId: accessionId ?? "",
                          accessionContactId: contact.id,
                        })
                        .catch((err) => {
                          Notification.error(
                            "There was an error removing this contact from the Accession"
                          );
                          console.error(err);
                        });
                    }}
                  >
                    <MailMinus className="w-4 h-4 shrink-0" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-center">
            No one has been assigned as a contact for this accession yet
          </p>
        </div>
      )}
    </>
  );
}

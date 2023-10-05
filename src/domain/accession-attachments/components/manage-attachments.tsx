"use client";

import { ConfirmModal } from "@/components/confirm-modal";
import {
  MultiFileDropzone,
  type FileState,
} from "@/components/file-upload/multi-file-dropzone";
import { Notification } from "@/components/notifications";
import { Combobox } from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { AccessionKeys } from "@/domain/accessions/apis/accession.keys";
import { AccessionAttachmentDto } from "@/domain/accessions/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Modal, ModalContent, ModalHeader } from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { EditIcon, ExternalLink, FileIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AccessionAttachmentForUpdateDto } from "../accession-attachments.types";
import { useDeleteAccessionAttachment } from "../apis/delete-attachment";
import { useUpdateAccessionAttachment } from "../apis/update-attachment";
import { useUploadAccessionAttachment } from "../apis/upload-attachment";
import { attachmentTypesDropdown } from "../attachment-types.types";

export function ManageAttachments({
  accessionId,
  attachments,
}: {
  accessionId: string;
  attachments: AccessionAttachmentDto[];
}) {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const attachmentDeleter = useDeleteAccessionAttachment();
  const attachmentUploader = useUploadAccessionAttachment();
  const queryClient = useQueryClient();

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const updatedStates = fileStates.map((fileState) =>
        fileState.key === key ? { ...fileState, progress } : fileState
      );

      return updatedStates;
    });
  }

  function removeCompletedUploads() {
    setTimeout(() => {
      setFileStates((fileStates) =>
        fileStates.filter((fileState) => fileState.progress !== "COMPLETE")
      );
    }, 2000);
  }

  const [deleteAttachmentModalIsOpen, setDeleteAttachmentModalIsOpen] =
    useState(false);
  const [attachmentToDelete, setAttachmentToDelete] = useState<{
    id: string;
    filename: string;
  }>({});

  return (
    <div>
      <h3 className="h-0 sr-only">Manage Accession Attachments</h3>
      <div className="">
        <MultiFileDropzone
          className="w-full"
          value={fileStates}
          onChange={(files) => {
            setFileStates(files);
          }}
          onFilesAdded={async (addedFiles) => {
            setFileStates((prevFileStates) => [
              ...prevFileStates,
              ...addedFiles,
            ]);
            await Promise.all(
              addedFiles.map(async (addedFileState) => {
                try {
                  updateFileProgress(addedFileState.key, "PENDING");

                  await attachmentUploader.mutateAsync({
                    accessionId: accessionId,
                    file: addedFileState.file,
                    skipQueryInvalidation: true,
                    onUploadProgress: (progressEvent) => {
                      const total =
                        progressEvent.total || addedFileState.file.size;
                      const progress = Math.round(
                        (progressEvent.loaded * 100) / total
                      );
                      updateFileProgress(addedFileState.key, progress);
                    },
                  });

                  await new Promise((resolve) => setTimeout(resolve, 500));

                  updateFileProgress(addedFileState.key, "COMPLETE");
                } catch (err) {
                  console.error(err);
                  updateFileProgress(addedFileState.key, "ERROR");
                }
              })
            );
            removeCompletedUploads();

            // doing invalidation here because the batch api call isn't able to track
            // progress independently as is and refactoring to it was taking too long
            queryClient.invalidateQueries(AccessionKeys.lists());
            queryClient.invalidateQueries(AccessionKeys.forEdit(accessionId));
          }}
        />
      </div>

      <h3 className="pt-4 text-xl font-semibold tracking-tight">
        Uploaded Attachments
      </h3>
      {attachments && attachments.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 pt-4 overflow-y-auto max-h-[48rem]">
          {attachments.map((attachment) => {
            const isImage = /\.(jpg|jpeg|png)$/i.test(attachment.filename);

            return (
              <div
                key={attachment.id}
                className="flex p-3 transition-shadow duration-300 border rounded-lg shadow-sm group"
              >
                {isImage ? (
                  <img
                    src={attachment.preSignedUrl}
                    alt={attachment.filename}
                    className="w-20 h-20 rounded-lg aspect-square"
                  />
                ) : (
                  <div className="flex items-center justify-center w-20 h-20 border border-gray-300 rounded-lg shadow aspect-square bg-gray-200/60">
                    <FileIcon className="w-8 h-8" />
                  </div>
                )}
                <div className="flex flex-col w-full pl-6">
                  <div className="flex w-full">
                    <div className="flex flex-1 text-lg font-medium">
                      {attachment.filename}
                    </div>
                    <div className="flex items-center pr-2 space-x-5 transition-all duration-200 opacity-0 group-hover:opacity-100">
                      <a
                        href={attachment.preSignedUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink className="w-5 h-5 transition-colors duration-200 hover:text-sky-600" />
                      </a>

                      <EditAccessionAttachmentButton
                        attachmentId={attachment.id}
                        attachmentData={{
                          type: attachment.type,
                          comments: attachment.comments,
                        }}
                      />

                      <button
                        className="flex items-center justify-center transition-colors duration-200 rounded-lg shadow aspect-square hover:text-rose-700 hover:outline-none"
                        onClick={() => {
                          setAttachmentToDelete({
                            id: attachment.id,
                            filename: attachment.filename,
                          });
                          setDeleteAttachmentModalIsOpen(true);
                        }}
                      >
                        <Trash2Icon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  {attachment.type && (
                    <p className="pt-1 text-sm text-gray-500">
                      {attachment.type}
                    </p>
                  )}
                  {attachment.comments && (
                    <p className="text-sm italic text-gray-700">
                      {attachment.comments}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="pt-4">No attachments uploaded yet.</p>
      )}

      <ConfirmModal
        content={
          <p>
            Are you sure you want to delete the '{attachmentToDelete.filename}'
            attachment?
          </p>
        }
        labels={{
          confirm: "Delete",
          cancel: "Cancel",
        }}
        confirmationType="danger"
        onConfirm={() => {
          attachmentDeleter.mutate({
            accessionId: accessionId,
            attachmentId: attachmentToDelete.id,
          });
        }}
        onCancel={() => {}}
        isOpen={deleteAttachmentModalIsOpen}
        onOpenChange={setDeleteAttachmentModalIsOpen}
        title="Delete Attachment"
      />
    </div>
  );
}

export type AccessionAttachmentForUpdateCard = {
  type?: string;
  comments?: string;
};

export function EditAccessionAttachmentButton({
  attachmentId,
  attachmentData,
}: {
  attachmentId: string;
  attachmentData: AccessionAttachmentForUpdateCard;
}) {
  const [
    updateAccessionAttachmentDialogIsOpen,
    setUpdateAccessionAttachmentDialogIsOpen,
  ] = useState(false);
  const updateAccessionAttachmentApi = useUpdateAccessionAttachment();
  return (
    <>
      <Modal
        className="w-full max-w-3xl"
        isOpen={updateAccessionAttachmentDialogIsOpen}
        onOpenChange={setUpdateAccessionAttachmentDialogIsOpen}
      >
        <div className="relative inset-0 flex">
          <ModalContent>
            <ModalHeader className="text-2xl font-semibold scroll-m-20">
              Edit Accession Attachment
            </ModalHeader>
            <div className="px-6 pb-6 overflow-y-auto grow">
              <AccessionAttachmentForm
                attachmentData={attachmentData}
                onSubmit={(value) => {
                  const dto = { ...value } as AccessionAttachmentForUpdateDto;
                  updateAccessionAttachmentApi
                    .mutateAsync({ data: dto, id: attachmentId })
                    .then(() => {
                      setUpdateAccessionAttachmentDialogIsOpen(false);
                    })
                    .catch((err) => {
                      Notification.error("Error updating accession attachment");
                      console.log(err);
                    });
                }}
              />
            </div>
          </ModalContent>
        </div>
      </Modal>
      <button
        className="flex items-center justify-center transition-colors duration-200 rounded-lg shadow aspect-square hover:outline-none hover:text-slate-500"
        onClick={() => setUpdateAccessionAttachmentDialogIsOpen(true)}
      >
        <EditIcon className="w-5 h-5" />
      </button>
    </>
  );
}

const attachmentFormSchema = z.object({
  comments: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
});

function AccessionAttachmentForm({
  onSubmit,
  attachmentData,
}: {
  onSubmit: (values: z.infer<typeof attachmentFormSchema>) => void;
  attachmentData: AccessionAttachmentForUpdateCard;
}) {
  const attachmentForm = useForm<z.infer<typeof attachmentFormSchema>>({
    resolver: zodResolver(attachmentFormSchema),
    defaultValues: {
      comments: attachmentData.comments,
      type: attachmentData.type,
    },
  });

  return (
    <Form {...attachmentForm}>
      <form
        onSubmit={attachmentForm.handleSubmit(onSubmit)}
        className="flex flex-col h-full"
      >
        <div className="flex-1 space-y-4">
          <FormField
            control={attachmentForm.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel required={false}>Type</FormLabel>
                <FormControl>
                  <Combobox items={attachmentTypesDropdown} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={attachmentForm.control}
            name="comments"
            render={({ field }) => (
              <FormItem>
                <FormLabel required={false}>Comments</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={5} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-end pt-8">
          <Button type="submit" color="primary">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}

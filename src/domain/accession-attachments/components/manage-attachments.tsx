"use client";

import {
  MultiFileDropzone,
  type FileState,
} from "@/components/file-upload/multi-file-dropzone";
import { AccessionAttachmentDto } from "@/domain/accessions/types";
import { ExternalLink, FileIcon } from "lucide-react";
import { useState } from "react";
import { useUploadAccessionAttachment } from "../apis/upload-attachment";

export function ManageAttachments({
  accessionId,
  attachments,
}: {
  accessionId: string;
  attachments: AccessionAttachmentDto[];
}) {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const attachmentUploader = useUploadAccessionAttachment();

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const updatedStates = fileStates.map((fileState) =>
        fileState.key === key ? { ...fileState, progress } : fileState
      );

      if (progress === "COMPLETE") {
        setTimeout(() => {
          setFileStates(
            fileStates.filter((fileState) => fileState.key !== key)
          );
        }, 2000);
      }

      return updatedStates;
    });
  }

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
          }}
        />
      </div>
      {attachments && (
        <div className="pt-4">
          <h3 className="text-xl font-semibold tracking-tight">
            Uploaded Attachments
          </h3>
          <div className="grid grid-cols-1 gap-4 pt-4">
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
                      className="object-cover w-20 h-20 rounded-lg"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-20 h-20 border border-gray-300 rounded-lg shadow bg-gray-200/60">
                      <FileIcon className="w-8 h-8" />
                    </div>
                  )}
                  <div className="flex flex-col pl-6">
                    <div className="flex">
                      <div className="flex flex-1 text-lg font-medium">
                        {attachment.filename}
                      </div>
                      <div className="pr-2 transition-all duration-200 opacity-0 group-hover:opacity-100">
                        <a
                          href={attachment.preSignedUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ExternalLink className="w-5 h-5 transition-colors duration-200 hover:text-sky-600" />
                        </a>
                      </div>
                    </div>
                    {attachment.type && (
                      <p className="pt-2 text-sm text-gray-500">
                        {attachment.type}
                      </p>
                    )}
                    {/* {attachment.comments && ( */}
                    <p className="pt-2 text-sm italic text-gray-700">
                      {/* {attachment.comments} */}
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Obcaecati ipsa culpa dolor rem natus saepe asperiores,
                      similique suscipit, adipisci distinctio neque deserunt
                      voluptatibus architecto mollitia voluptas necessitatibus.
                      Quibusdam, necessitatibus voluptas?
                    </p>
                    {/* )} */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

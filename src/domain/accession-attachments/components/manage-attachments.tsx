"use client";

import {
  MultiFileDropzone,
  type FileState,
} from "@/components/file-upload/multi-file-dropzone";
import { useState } from "react";
import { useUploadAccessionAttachment } from "../apis/upload-attachment";

export function ManageAttachments({ accessionId }: { accessionId: string }) {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const mutation = useUploadAccessionAttachment();

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      return fileStates.map((fileState) =>
        fileState.key === key ? { ...fileState, progress } : fileState
      );
    });
  }

  return (
    <div>
      <h3 className="text-xl font-semibold tracking-tight">
        Manage Accession Attachments
      </h3>
      <div className="pt-4">
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

                  // Use the mutation to upload the file.
                  await mutation.mutateAsync({
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

                  updateFileProgress(addedFileState.key, "COMPLETE");
                  console.log(`done uploading ${addedFileState.file.name}`);
                } catch (err) {
                  console.error(err);
                  updateFileProgress(addedFileState.key, "ERROR");
                }
              })
            );
          }}
        />
      </div>
    </div>
  );
}

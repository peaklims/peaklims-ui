"use client";

import {
  MultiFileDropzone,
  type FileState,
} from "@/components/file-upload/multi-file-dropzone";
import { useState } from "react";

export function ManageAttachments() {
  const [fileStates, setFileStates] = useState<FileState[]>([]);

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
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
            setFileStates([...fileStates, ...addedFiles]);
            await Promise.all(
              addedFiles.map(async (addedFileState) => {
                try {
                  // random delay then log done
                  await new Promise<void>((resolve) => {
                    const file = addedFileState.file;
                    updateFileProgress(addedFileState.key, "PENDING");

                    const duration = Math.random() * 5000;
                    const startTime = Date.now();

                    // Set interval to update the progress every 100ms
                    const intervalId = setInterval(() => {
                      const elapsedTime = Date.now() - startTime;
                      const percentage = Math.min(
                        Math.floor((elapsedTime / duration) * 100),
                        100
                      ); // Ensure it does not exceed 100

                      updateFileProgress(addedFileState.key, percentage);

                      // If the duration has been reached or exceeded, clear the interval
                      if (elapsedTime >= duration) {
                        clearInterval(intervalId);

                        // After hitting 100%, wait for 4 hundredths of a second
                        setTimeout(() => {
                          updateFileProgress(addedFileState.key, "COMPLETE");
                          console.log(`done uploading ${file.name}`);
                          resolve();
                        }, 400);
                      }
                    }, 100); // Update every 100ms
                  });
                } catch (err) {
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

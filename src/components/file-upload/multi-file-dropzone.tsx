"use client";

// source: https://edgestore.dev/docs/components/multi-file

import { cn } from "@/lib/utils";
import {
  CheckCircleIcon,
  FileIcon,
  LucideFileWarning,
  Trash2Icon,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import * as React from "react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";

const variants = {
  base: "relative rounded-md p-4 w-96 max-w-[calc(100vw-1rem)] flex justify-center items-center flex-col cursor-pointer border border-dashed border-gray-400 dark:border-gray-300 transition-colors duration-200 ease-in-out  hover:border-gray-600 dark:hover:border-gray-200 group",
  active: "border-2",
  disabled:
    "bg-gray-200 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700 dark:border-gray-600",
  accept: "border border-blue-500 bg-blue-500 bg-opacity-10",
  reject: "border border-rose-700 bg-rose-700 bg-opacity-10",
};

export type FileState = {
  file: File;
  key: string; // used to identify the file in the progress callback
  progress: "PENDING" | "COMPLETE" | "ERROR" | number;
};

type InputProps = {
  className?: string;
  value?: FileState[];
  onChange?: (files: FileState[]) => void | Promise<void>;
  onFilesAdded?: (addedFiles: FileState[]) => void | Promise<void>;
  disabled?: boolean;
  dropzoneOptions?: Omit<DropzoneOptions, "disabled">;
};

const ERROR_MESSAGES = {
  fileTooLarge(maxSize: number) {
    return `The file is too large. Max size is ${formatFileSize(maxSize)}.`;
  },
  fileInvalidType() {
    return "Invalid file type.";
  },
  tooManyFiles(maxFiles: number) {
    return `You can only add ${maxFiles} file(s).`;
  },
  fileNotSupported() {
    return "The file is not supported.";
  },
};

export const MultiFileDropzone = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { dropzoneOptions, value, className, disabled, onFilesAdded, onChange },
    ref
  ) => {
    const [customError, setCustomError] = React.useState<string>();
    if (dropzoneOptions?.maxFiles && value?.length) {
      disabled = disabled ?? value.length >= dropzoneOptions.maxFiles;
    }
    // dropzone configuration
    const {
      getRootProps,
      getInputProps,
      fileRejections,
      isFocused,
      isDragAccept,
      isDragReject,
    } = useDropzone({
      disabled,
      onDrop: (acceptedFiles) => {
        const files = acceptedFiles;
        setCustomError(undefined);
        if (
          dropzoneOptions?.maxFiles &&
          (value?.length ?? 0) + files.length > dropzoneOptions.maxFiles
        ) {
          setCustomError(ERROR_MESSAGES.tooManyFiles(dropzoneOptions.maxFiles));
          return;
        }
        if (files) {
          const addedFiles = files.map<FileState>((file) => ({
            file,
            key: Math.random().toString(36).slice(2),
            progress: "PENDING",
          }));
          void onFilesAdded?.(addedFiles);
          void onChange?.([...(value ?? []), ...addedFiles]);
        }
      },
      ...dropzoneOptions,
    });

    // styling
    const dropZoneClassName = React.useMemo(
      () =>
        cn(
          variants.base,
          isFocused && variants.active,
          disabled && variants.disabled,
          (isDragReject ?? fileRejections[0]) && variants.reject,
          isDragAccept && variants.accept,
          className
        ).trim(),
      [
        isFocused,
        fileRejections,
        isDragAccept,
        isDragReject,
        disabled,
        className,
      ]
    );

    // error validation messages
    const errorMessage = React.useMemo(() => {
      if (fileRejections[0]) {
        const { errors } = fileRejections[0];
        if (errors[0]?.code === "file-too-large") {
          return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0);
        } else if (errors[0]?.code === "file-invalid-type") {
          return ERROR_MESSAGES.fileInvalidType();
        } else if (errors[0]?.code === "too-many-files") {
          return ERROR_MESSAGES.tooManyFiles(dropzoneOptions?.maxFiles ?? 0);
        } else {
          return ERROR_MESSAGES.fileNotSupported();
        }
      }
      return undefined;
    }, [fileRejections, dropzoneOptions]);

    return (
      <div>
        <div className="flex flex-col gap-2">
          <div>
            {/* Main File Input */}
            <div
              {...getRootProps({
                className: dropZoneClassName,
              })}
            >
              <input ref={ref} {...getInputProps()} />
              <div className="flex flex-col items-center justify-center text-xs text-gray-400 transition duration-200 group-hover:text-gray-500 dark:group-hover:text-gray-200">
                <UploadCloudIcon className="mb-1 h-7 w-7" />
                <div className="">drag & drop or click to upload</div>
              </div>
            </div>

            <div className="mt-1 text-xs text-rose-500">
              {customError ?? errorMessage}
            </div>
          </div>

          {/* Selected Files */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {value?.map(({ file, progress }, i) => (
              <div
                key={i}
                className="flex flex-col justify-center w-full h-16 max-w-md col-span-1 px-4 py-2 border border-gray-300 rounded group"
              >
                <div className="flex items-center gap-2 text-gray-500 dark:text-white">
                  {progress === "ERROR" ? (
                    <LucideFileWarning
                      size="30"
                      className="text-rose-600 shrink-0 dark:text-rose-400"
                    />
                  ) : (
                    <FileIcon size="30" className="shrink-0" />
                  )}
                  <div className="min-w-0 text-sm">
                    <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                      {file.name}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                  <div className="grow" />
                  <div className="flex justify-end w-12 text-xs">
                    {progress === "PENDING" ? (
                      <button
                        className="p-1 transition-colors duration-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          void onChange?.(
                            value.filter((_, index) => index !== i)
                          );
                        }}
                      >
                        <Trash2Icon className="shrink-0" />
                      </button>
                    ) : progress === "ERROR" ? (
                      <button
                        className="p-2"
                        onClick={() => {
                          void onChange?.(
                            value.filter((_, index) => index !== i)
                          );
                        }}
                      >
                        <XIcon className="transition-all duration-200 text-rose-600 dark:text-rose-400 md:opacity-0 md:group-hover:opacity-100 hover:text-rose-400" />
                      </button>
                    ) : progress !== "COMPLETE" ? (
                      <div>{Math.round(progress)}%</div>
                    ) : (
                      <CheckCircleIcon className="text-green-600 shrink-0 dark:text-gray-400" />
                    )}
                  </div>
                </div>
                {/* Progress Bar */}
                {typeof progress === "number" && (
                  <div className="relative h-0">
                    <div className="absolute w-full h-1 bg-gray-200 rounded-full top-1 overflow-clip dark:bg-gray-700">
                      <div
                        className="h-full transition-all duration-300 ease-in-out bg-gray-400 dark:bg-white"
                        style={{
                          width: progress ? `${progress}%` : "0%",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);
MultiFileDropzone.displayName = "MultiFileDropzone";

function formatFileSize(bytes?: number) {
  if (!bytes) {
    return "0 Bytes";
  }
  bytes = Number(bytes);
  if (bytes === 0) {
    return "0 Bytes";
  }
  const k = 1024;
  const dm = 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

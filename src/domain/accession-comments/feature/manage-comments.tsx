import { CopyButton } from "@/components/copy-button";
import { Notification } from "@/components/notifications";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, dateTimeToLocal } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAddAccessionComment } from "../apis/add-comment";
import { useGetAccessionComment } from "../apis/get-accession-comments";
import { CommentHistoryModal } from "../components/comment-history-modal";
import { SetCommentForm } from "../components/edit-comment-form";
import { AccessionCommentItemDto } from "../types";

const schema = z.object({
  comment: z.string().min(1, "Comment is required"),
});

export function ManageAccessionComments({
  accessionId,
}: {
  accessionId: string;
}) {
  const { data: comments } = useGetAccessionComment(accessionId);
  const commentsEndRef = useScrollToLocation({ dependencies: [comments] });
  const { register, handleSubmit, reset, watch } = useForm<
    z.infer<typeof schema>
  >({
    resolver: zodResolver(schema),
  });

  const addCommentApi = useAddAccessionComment();
  function onSubmit(values: z.infer<typeof schema>) {
    const accessionCommentForCreation = {
      accessionId,
      comment: values.comment,
    };
    addCommentApi
      .mutateAsync({
        data: accessionCommentForCreation,
      })
      .then(() => {
        reset();
      });
  }

  return (
    <div className="w-full h-full max-w-2xl space-y-3">
      <h3 className="text-xl font-semibold tracking-tight">Comments</h3>
      <div className="">
        <div
          className={cn(
            "w-full h-full p-6 space-y-3 overflow-auto border-2 rounded-tLg max-h-[35rem]"
          )}
        >
          {(comments?.accessionComments?.length ?? 0) <= 0 ? (
            <div className="flex items-center justify-center w-full h-full py-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                No comments have been made for this accession
              </p>
            </div>
          ) : (
            <>
              {comments?.accessionComments?.map((comment) => {
                return (
                  <ChatBubble
                    key={comment.id}
                    bubbleSide={comment.ownedByCurrentUser ? "right" : "left"}
                    comment={comment}
                    accessionId={accessionId}
                  />
                );
              })}
            </>
          )}
          <div ref={commentsEndRef} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <label className="sr-only" htmlFor="comment">
            Add a comment
          </label>
          <textarea
            id="comment"
            rows={4}
            aria-label="Add a comment"
            className={cn(
              "max-h-52 z-20 w-full px-5 py-4 -mt-[2px] border-2 rounded-bLg shadow-md focus:outline-none focus:border-emerald-400"
            )}
            autoFocus={true}
            placeholder="Add a comment"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }
            }}
            {...register("comment")}
          />
          <button type="submit" className="hidden">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

function useScrollToLocation({ dependencies }: { dependencies: any[] }) {
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    if (commentsEndRef.current)
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [dependencies]);
  return commentsEndRef;
}

function ChatBubble({
  bubbleSide,
  accessionId,
  comment,
}: {
  bubbleSide: "left" | "right";
  accessionId: string;
  comment: AccessionCommentItemDto;
}) {
  const isCurrentUser = bubbleSide === "right";
  const getInitial = (letter: string | null | undefined): string => {
    return letter && letter.length > 0 ? letter[0] : "";
  };

  const initials = `${getInitial(comment.createdByFirstName)}${getInitial(
    comment.createdByLastName
  )}`;
  const hasHistory = comment.history.length > 0;

  return (
    <div className="flex group">
      <div className={cn(isCurrentUser && "flex-1")} />
      <div className={cn(`flex items-start gap-1`)}>
        {!isCurrentUser ? (
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        ) : null}

        <div className="">
          <div className={cn(`flex flex-col w-full leading-1.5 pl-2`)}>
            {/* user info */}
            {!isCurrentUser ? (
              <div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {comment.createdByFirstName} {comment.createdByLastName}
                  </span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {dateTimeToLocal({ dateTime: comment.originalCommentAt })}
                  </span>
                </div>

                {hasHistory ? (
                  <div className={cn(`flex flex-col w-full leading-1.5 pt-1`)}>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="text-xs italic font-medium text-gray-500 dark:text-white">
                        Edited on{" "}
                        {dateTimeToLocal({ dateTime: comment.createdDate })}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {dateTimeToLocal({ dateTime: comment.originalCommentAt })}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    (Me)
                  </span>
                </div>

                {hasHistory ? (
                  <div
                    className={cn(`flex flex-col w-full leading-1.5 pl-4 pt-1`)}
                  >
                    <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
                      <span className="text-xs italic font-medium text-gray-500 dark:text-white">
                        Edited on{" "}
                        {dateTimeToLocal({ dateTime: comment.createdDate })}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className={cn(`flex items-start gap-1 pl-2`)}>
            {!isCurrentUser ? null : (
              <>
                <ActionMenu
                  accessionId={accessionId}
                  comment={comment}
                  isCurrentUser={isCurrentUser}
                />
                <CopyButton textToCopy={comment.comment} />
              </>
            )}

            {/* the bubble */}
            <div
              data-iscurrentuser={isCurrentUser ? true : undefined}
              className={cn(
                `flex flex-col w-full max-w-[320px] leading-1.5 p-3
                 border-gray-200 bg-gray-100 rounded-b-xl dark:bg-gray-700 mt-1`,
                !isCurrentUser ? "rounded-tr-xl" : "rounded-tl-xl",
                !isCurrentUser ? "place-items-start" : "place-items-end",
                "data-[iscurrentuser]:bg-emerald-400"
              )}
            >
              <p
                className={cn(
                  "text-sm font-normal whitespace-break-spaces text-gray-900 dark:text-white text-balance"
                )}
              >
                {comment.comment}
              </p>
            </div>
            {!isCurrentUser ? (
              <>
                <CopyButton textToCopy={comment.comment} />
                <ActionMenu
                  accessionId={accessionId}
                  comment={comment}
                  isCurrentUser={isCurrentUser}
                />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionMenu({
  accessionId,
  comment,
  isCurrentUser,
}: {
  accessionId: string;
  comment: AccessionCommentItemDto;
  isCurrentUser: boolean;
}) {
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onOpenChange: onEditModalOpenChange,
  } = useDisclosure();
  const {
    isOpen: isHistoryModalOpen,
    onOpen: onHistoryModalOpen,
    onOpenChange: onHistoryModalOpenChange,
  } = useDisclosure();
  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <button
            className="inline-flex items-center self-center p-2 text-sm font-medium text-center text-gray-900 transition-opacity bg-white rounded-md roundedLg md:opacity-0 hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600 md:group-hover:opacity-100"
            type="button"
          >
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 4 15"
            >
              <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
            </svg>
          </button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Actions"
          onAction={(key) => {
            if (key === "copy") {
              navigator.clipboard.writeText(comment.comment);
              Notification.success("Copied to clipboard");
            }
            if (key === "edit") {
              onEditModalOpen();
            }
            if (key === "history") {
              onHistoryModalOpen();
            }
          }}
        >
          <DropdownItem
            className={cn("rounded-md", !isCurrentUser && "hidden")}
            key="edit"
          >
            <div className="flex items-center space-x-3">
              {/* https://iconbuddy.app/akar-icons/chatedit */}
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                width="512"
                height="512"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g fill="none" stroke="currentColor" strokeWidth="2">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 19c3.771 0 5.657 0 6.828-1.172C22 16.657 22 14.771 22 11c0-3.771 0-5.657-1.172-6.828C19.657 3 17.771 3 14 3h-4C6.229 3 4.343 3 3.172 4.172C2 5.343 2 7.229 2 11c0 3.771 0 5.657 1.172 6.828c.653.654 1.528.943 2.828 1.07"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.207 6.793a1 1 0 0 0-1.418.003l-4.55 4.597a2 2 0 0 0-.54 1.015l-.18.896a1 1 0 0 0 1.177 1.177l.896-.18a2 2 0 0 0 1.015-.54l4.597-4.55a1 1 0 0 0 .003-1.418z"
                  />
                  <path d="m12.5 9.5l1 1" />
                  <path
                    strokeLinecap="round"
                    d="M14 19c-1.236 0-2.598.5-3.841 1.145c-1.998 1.037-2.997 1.556-3.489 1.225c-.492-.33-.399-1.355-.212-3.404L6.5 17.5"
                  />
                </g>
              </svg>
              <p>Edit Comment</p>
            </div>
          </DropdownItem>

          <DropdownItem className={cn("rounded-md")} key="copy">
            <div className="flex items-center space-x-3">
              {/* https://iconbuddy.app/akar-icons/copy */}
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                width="512"
                height="512"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path d="M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.242a2 2 0 0 0-.602-1.43L16.083 2.57A2 2 0 0 0 14.685 2H10a2 2 0 0 0-2 2" />
                  <path d="M16 18v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2" />
                </g>
              </svg>
              <p>Copy Comment</p>
            </div>
          </DropdownItem>

          <DropdownItem
            className={cn(
              "rounded-md",
              comment.history.length <= 0 && "hidden"
            )}
            key="history"
          >
            <div className="flex items-center space-x-3">
              {/* https://iconbuddy.app/akar-icons/history */}
              <svg
                width="512"
                height="512"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.266 16.06a8.923 8.923 0 0 0 3.915 3.978a8.706 8.706 0 0 0 5.471.832a8.795 8.795 0 0 0 4.887-2.64a9.067 9.067 0 0 0 2.388-5.079a9.135 9.135 0 0 0-1.044-5.53a8.903 8.903 0 0 0-4.069-3.815a8.7 8.7 0 0 0-5.5-.608c-1.85.401-3.366 1.313-4.62 2.755c-.151.16-.735.806-1.22 1.781M7.5 8l-3.609.72L3 5m9 4v4l3 2"
                />
              </svg>
              <p>View Edit History</p>
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Modal isOpen={isEditModalOpen} onOpenChange={onEditModalOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Comment
              </ModalHeader>
              <ModalBody>
                <SetCommentForm
                  commentId={comment.id}
                  afterSubmit={() => {
                    onClose();
                  }}
                  initialComment={comment.comment}
                  accessionId={accessionId}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {CommentHistoryModal(
        isHistoryModalOpen,
        onHistoryModalOpenChange,
        comment
      )}
    </>
  );
}

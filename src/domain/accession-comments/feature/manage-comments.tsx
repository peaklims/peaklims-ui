import { Notification } from "@/components/notifications";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { format } from "date-fns";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAddAccessionComment } from "../apis/add-comment";
import { useGetAccessionComment } from "../apis/get-accession-comments";
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
      })
      .catch((err) => {
        const statusCode = err?.response?.status;
        if (statusCode != 422) {
          Notification.error(`Error adding comment`);
        }
      });
  }

  return (
    <div className="w-full h-full max-w-2xl space-y-3">
      <h3 className="text-xl font-semibold tracking-tight">Comments</h3>
      <div className="">
        <div
          className={cn(
            "w-full h-full p-6 space-y-3 overflow-auto border-2 rounded-t-lg max-h-[35rem]"
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
                    bubbleSide={comment.ownedByCurrentUser ? "right" : "left"}
                    commentText={comment.comment}
                    firstName={comment.createdByFirstName}
                    lastName={comment.createdByLastName}
                    createdAt={comment.createdDate}
                    commentId={comment.id}
                    accessionId={accessionId}
                    comment={comment}
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
              "max-h-52 z-20 w-full px-5 py-4 -mt-[2px] border-2 rounded-b-lg shadow-md focus:outline-none focus:border-emerald-400"
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

        {/* user info */}
        <div className="">
          <div className={cn(`flex flex-col w-full leading-1.5 pl-4`)}>
            {!isCurrentUser ? (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {comment.createdByFirstName} {comment.createdByLastName}
                </span>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  {format(comment.originalCommentAt, "yyyy-MM-dd hh:mm a")}
                </span>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {format(comment.originalCommentAt, "yyyy-MM-dd hh:mm a")}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    (Me)
                  </span>
                </div>

                {hasHistory ? (
                  <div
                    className={cn(`flex flex-col w-full leading-1.5 pl-4 pt-1`)}
                  >
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="text-xs italic font-medium text-gray-500 dark:text-white">
                        Edited on{" "}
                        {format(comment.createdDate, "yyyy-MM-dd hh:mm a")}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* the bubble */}
          <div className={cn(`flex items-start gap-1 pl-2`)}>
            {!isCurrentUser ? null : (
              <>
                <EditButton
                  commentId={comment.id}
                  accessionId={accessionId}
                  commentText={comment.comment}
                />
                {/* <ActionMenu commentToCopy={commentText} commentId={commentId} /> */}
                <CopyButton textToCopy={comment.comment} />
              </>
            )}
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
                <EditButton
                  commentId={comment.id}
                  commentText={comment.comment}
                  accessionId={accessionId}
                />
                {/* <ActionMenu commentToCopy={commentText} commentId={commentId} /> */}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionMenu({
  commentToCopy,
  commentId,
}: {
  commentToCopy: string;
  commentId: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <button
            className="inline-flex items-center self-center p-2 text-sm font-medium text-center text-gray-900 transition-opacity bg-white rounded-lg md:opacity-0 hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600 md:group-hover:opacity-100"
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
          aria-label="Static Actions"
          onAction={(key) => {
            if (key === "copy") {
              navigator.clipboard.writeText(commentToCopy);
              Notification.success("Copied to clipboard");
            }
            if (key === "edit") {
              onOpen();
            }
          }}
        >
          <DropdownItem className="rounded-md" key="copy">
            Copy Comment
          </DropdownItem>
          <DropdownItem className="rounded-md" key="edit">
            Edit Comment
          </DropdownItem>
          {/* <DropdownItem
            className="rounded-md text-rose-500 data-[hover=true]:text-white data-[hover=true]:bg-rose-500"
            key="delete"
          >
            Delete Comment
          </DropdownItem> */}
        </DropdownMenu>
      </Dropdown>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Comment
              </ModalHeader>
              <ModalBody>
                <p>Let's edit comment {commentId}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

function EditButton({
  commentId,
  accessionId,
  commentText,
}: {
  commentId: string;
  accessionId: string;
  commentText: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <button
        className="inline-flex items-center self-center p-2 text-sm font-medium text-center text-gray-900 transition-opacity bg-white rounded-lg md:opacity-0 hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600 md:group-hover:opacity-100"
        type="button"
        onClick={onOpen}
      >
        {/* https://iconbuddy.app/akar-icons/chatedit */}
        <svg
          className="w-4 h-4 text-gray-500 dark:text-gray-400"
          width="512"
          height="512"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="none" stroke="currentColor" stroke-width="2">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14 19c3.771 0 5.657 0 6.828-1.172C22 16.657 22 14.771 22 11c0-3.771 0-5.657-1.172-6.828C19.657 3 17.771 3 14 3h-4C6.229 3 4.343 3 3.172 4.172C2 5.343 2 7.229 2 11c0 3.771 0 5.657 1.172 6.828c.653.654 1.528.943 2.828 1.07"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.207 6.793a1 1 0 0 0-1.418.003l-4.55 4.597a2 2 0 0 0-.54 1.015l-.18.896a1 1 0 0 0 1.177 1.177l.896-.18a2 2 0 0 0 1.015-.54l4.597-4.55a1 1 0 0 0 .003-1.418z"
            />
            <path d="m12.5 9.5l1 1" />
            <path
              stroke-linecap="round"
              d="M14 19c-1.236 0-2.598.5-3.841 1.145c-1.998 1.037-2.997 1.556-3.489 1.225c-.492-.33-.399-1.355-.212-3.404L6.5 17.5"
            />
          </g>
        </svg>
      </button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Comment
              </ModalHeader>
              <ModalBody>
                <SetCommentForm
                  commentId={commentId}
                  afterSubmit={() => {
                    onClose();
                  }}
                  initialComment={commentText}
                  accessionId={accessionId}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

function CopyButton({ textToCopy }: { textToCopy: string }) {
  return (
    <button
      className="inline-flex items-center self-center p-2 text-sm font-medium text-center text-gray-900 transition-opacity bg-white rounded-lg md:opacity-0 hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600 md:group-hover:opacity-100"
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(textToCopy);
        Notification.success("Copied to clipboard");
      }}
    >
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
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        >
          <path d="M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.242a2 2 0 0 0-.602-1.43L16.083 2.57A2 2 0 0 0 14.685 2H10a2 2 0 0 0-2 2" />
          <path d="M16 18v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2" />
        </g>
      </svg>
    </button>
  );
}

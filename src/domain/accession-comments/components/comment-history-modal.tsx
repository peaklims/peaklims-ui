import { dateTimeToLocal } from "@/lib/utils";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import ReactDiffViewer from "react-diff-viewer";
import { AccessionCommentItemDto } from "../types";

export function CommentHistoryModal(
  isHistoryModalOpen: boolean,
  onHistoryModalOpenChange: () => void,
  comment: AccessionCommentItemDto
) {
  return (
    <Modal
      isOpen={isHistoryModalOpen}
      onOpenChange={onHistoryModalOpenChange}
      size="5xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Comment History
            </ModalHeader>
            <ModalBody>
              <div className="space-y-10 overflow-y-auto">
                {comment.history.map((historyItem, index) => {
                  return (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-start w-full">
                        <p className="bold font-lg">{index}</p>
                        <div className="flex flex-col w-full gap-1 pl-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {historyItem.createdByFirstName}{" "}
                              {historyItem.createdByLastName}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs italic font-medium text-gray-500 dark:text-white">
                                <span>
                                  {index === 0 ? "Created on" : "Edited on"}
                                </span>
                                <span> </span>
                                {dateTimeToLocal({
                                  dateTime: historyItem.createdDate,
                                })}
                              </span>
                            </div>
                          </div>
                          {index === 0 ? (
                            <ReactDiffViewer
                              oldValue={""}
                              newValue={historyItem.comment}
                              splitView={false}
                              hideLineNumbers={true}
                            />
                          ) : (
                            <div className="">
                              <ReactDiffViewer
                                oldValue={comment.history[index - 1].comment}
                                newValue={historyItem.comment}
                                splitView={true}
                                hideLineNumbers={true}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {
                  <div className="flex flex-col gap-1">
                    <div className="w-full">
                      <h2 className="text-lg font-medium">Current</h2>
                      <div className="flex flex-col w-full gap-1 pt-2">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {comment.createdByFirstName}{" "}
                            {comment.createdByLastName}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs italic font-medium text-gray-500 dark:text-white">
                              <span>Edited on</span>
                              <span> </span>
                              {dateTimeToLocal({
                                dateTime: comment.createdDate,
                              })}
                            </span>
                          </div>
                        </div>
                        <ReactDiffViewer
                          oldValue={
                            comment.history[comment.history.length - 1].comment
                          }
                          newValue={comment.comment}
                          splitView={true}
                          hideLineNumbers={true}
                        />
                      </div>
                    </div>
                  </div>
                }
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

import { Notification } from "@/components/notifications";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetPatientSamples } from "@/domain/samples/apis/get-patient-samples";
import { cn } from "@/lib/utils";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Dropdown as NextDropdown,
  DropdownItem as NextDropdownItem,
  DropdownMenu as NextDropdownMenu,
  DropdownTrigger as NextDropdownTrigger,
  useDisclosure,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { useGetTestOrderCancellationReasons } from "../apis/get-test-order-cancellation-reasons.api";
import { useRemovePanelOrder } from "../apis/remove-panel-order.api";
import { PanelOrderStatus, TestOrderStatus } from "../types";
import { CancelModalAction } from "./cancel-test-order-modal";
import { CancellationInfoButton } from "./cancellation-info-button";
import { SetSampleForm } from "./set-sample-form";
import { SetSampleButton, SetSampleModal } from "./set-sample-modal";
import { PanelOrderStatusBadge, TestOrderStatusBadge } from "./status-badge";

type PanelOrder = {
  id: string;
  panelCode: string;
  panelName: string;
  panelOrderId: string;
  status: string;
  type: string;
  version: number;
  tests: TestOrder[];
};

type TestOrder = {
  id: string;
  testCode: string;
  testName: string;
  status: string;
  cancellationReason: string | null;
  cancellationComments: string | null;
  sample: {
    id: string | null;
    sampleNumber: string | null;
  };
};

export function PanelOrderCard({
  panel: panelOrder,
  accessionId,
  patientId,
}: {
  accessionId: string;
  patientId: string;
  panel: PanelOrder;
}) {
  const removePanelOrderApi = useRemovePanelOrder();
  const [showPanelTestsId, setShowPanelTestsId] = useState<string | undefined>(
    undefined
  );
  return (
    <div
      key={panelOrder.id}
      className="flex items-center py-3 pl-1 pr-3 border rounded-lg shadow-md"
    >
      <div className="flex flex-col w-full">
        <div className="flex items-start justify-between w-full xl:items-center">
          <button
            className={
              "flex items-start xl:items-center h-full px-2 py-1 space-x-2"
            }
            onClick={() =>
              setShowPanelTestsId(
                panelOrder.id === showPanelTestsId ? undefined : panelOrder.id
              )
            }
          >
            <motion.div
              initial={false}
              animate={{
                rotate: panelOrder.id === showPanelTestsId ? 90 : 0,
              }}
            >
              <ChevronRightIcon className="w-6 h-6 hover:text-slate-700 text-slate-900" />
            </motion.div>
            <h4 className="flex flex-col font-medium xl:space-x-2">
              <div className="flex flex-col items-start">
                <span className="hidden pt-1 sm:block text-start xl:pt-0">
                  {panelOrder.panelName}
                </span>

                <p className="block text-xs font-semibold text-gray-400">
                  [{panelOrder.panelCode}]
                </p>
                <div className="flex items-start pt-2">
                  <PanelOrderStatusBadge
                    status={(panelOrder?.status || "-") as PanelOrderStatus}
                  />
                </div>
              </div>
            </h4>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className={cn(
                  "inline-flex items-center px-2 py-2 text-sm font-medium leading-5 transition duration-100 ease-in bg-white rounded-full hover:shadow",
                  "hover:bg-slate-100 hover:text-slate-800 hover:outline-none text-slate-700",
                  "sm:p-3 dark:hover:shadow dark:shadow-slate-400 dark:hover:shadow-slate-300"
                )}
              >
                {/* https://iconbuddy.app/ion/ellipsis-horizontal-sharp */}
                <svg
                  className="w-4 h-4"
                  width={512}
                  height={512}
                  viewBox="0 0 512 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx={256} cy={256} r={48} fill="currentColor" />
                  <circle cx={416} cy={256} r={48} fill="currentColor" />
                  <circle cx={96} cy={256} r={48} fill="currentColor" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" side="right">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    removePanelOrderApi
                      .mutateAsync({
                        accessionId: accessionId,
                        panelOrderId: panelOrder.panelOrderId,
                      })
                      .catch((e) => {
                        Notification.error(
                          "There was an error removing the Panel"
                        );
                        console.error(e);
                      });
                  }}
                >
                  <p>Remove</p>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              {/* <DropdownMenuSeparator /> */}
              {/* <DropdownMenuLabel>Manage Sample</DropdownMenuLabel>
              <DropdownMenuSeparator /> */}
              <DropdownMenuGroup>
                <DropdownMenuItem
                  asChild
                  onClick={(e) => {
                    alert(`Cancel Panel Order ${panelOrder.id}`);
                    e.stopPropagation();
                  }}
                >
                  <p
                    className={cn(
                      "hover:bg-rose-200 hover:text-rose-700 hover:outline-none",
                      "focus:bg-rose-200 focus:text-rose-700 focus:outline-none",
                      "dark:border-slate-900 dark:bg-slate-800 dark:text-white dark:hover:bg-rose-800 dark:hover:text-rose-300 dark:hover:outline-none",
                      "dark:hover:shadow dark:shadow-rose-400 dark:hover:shadow-rose-300",
                      "flex items-center justify-start space-x-2 w-full text-rose-500"
                    )}
                  >
                    Cancel Order
                  </p>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {showPanelTestsId && (
          <TestOrderActions
            panelOrder={panelOrder}
            showPanelTestsId={showPanelTestsId}
            patientId={patientId}
          />
        )}
      </div>
    </div>
  );
}

function TestOrderActions({
  panelOrder,
  showPanelTestsId,
  patientId,
}: {
  panelOrder: PanelOrder;
  showPanelTestsId: string | undefined;
  patientId: string;
}) {
  const detailSectionVariants = {
    open: { opacity: 1, height: "100%" },
    closed: { opacity: 0, height: "0%" },
  };
  return (
    <div className="pt-2">
      {panelOrder.id === showPanelTestsId &&
        panelOrder.tests?.map((testOrder, k) => {
          return (
            <motion.div
              className="flex items-center pt-4 first:pt-0"
              key={k}
              variants={detailSectionVariants}
              initial="closed"
              animate={panelOrder.id === showPanelTestsId ? "open" : "closed"}
            >
              <TestOrderActionMenu
                testOrderId={testOrder.id}
                sampleId={testOrder.sample.id}
                patientId={patientId}
                testOrder={testOrder}
              />

              <div className="flex flex-col w-full pl-2">
                <div className="flex flex-col pl-2 border-indigo-600 border-l-3">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <h5 className="flex-1 text-sm font-semibold tracking-tight">
                        {testOrder.testName}
                      </h5>
                      {/* {test.priority === "High" && (
                      <p className="text-xs font-semibold text-rose-400">
                        High Priority
                      </p>
                    )} */}
                    </div>
                    <p className="block text-xs font-semibold text-gray-400">
                      [{testOrder.testCode}]
                    </p>
                    <div className="flex items-center justify-start pt-2 space-x-3">
                      <TestOrderStatusBadge
                        status={(testOrder.status || "-") as TestOrderStatus}
                      />
                      {testOrder.status === "Cancelled" && (
                        <CancellationInfoButton
                          cancellationReason={
                            testOrder.cancellationReason ?? ""
                          }
                          cancellationComments={
                            testOrder.cancellationComments ?? ""
                          }
                        />
                      )}
                    </div>

                    <SetSampleModal
                      testOrderId={testOrder.id}
                      sampleId={testOrder.sample.id}
                      testName={testOrder.testName}
                      patientId={patientId}
                    >
                      <SetSampleButton className="inline-flex items-center pt-2 group">
                        <>
                          <p className="text-xs font-medium transition-colors group-hover:text-slate-500">
                            {testOrder.sample.sampleNumber ||
                              "Sample not assigned"}
                          </p>
                          {(testOrder?.sample?.sampleNumber?.length ?? 0) <=
                            0 && (
                            <div className="pl-2">
                              <svg
                                width="512"
                                height="512"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4 text-rose-500"
                              >
                                <path
                                  fill="currentColor"
                                  d="M10 2c4.42 0 8 3.58 8 8s-3.58 8-8 8s-8-3.58-8-8s3.58-8 8-8m1.13 9.38l.35-6.46H8.52l.35 6.46zm-.09 3.36c.24-.23.37-.55.37-.96c0-.42-.12-.74-.36-.97s-.59-.35-1.06-.35s-.82.12-1.07.35s-.37.55-.37.97c0 .41.13.73.38.96c.26.23.61.34 1.06.34s.8-.11 1.05-.34"
                                />
                              </svg>
                            </div>
                          )}
                        </>
                      </SetSampleButton>
                    </SetSampleModal>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
    </div>
  );
}

function TestOrderActionMenu({
  sampleId,
  testOrderId,
  patientId,
  testOrder,
}: {
  sampleId: string | null;
  testOrderId: string;
  patientId: string | null;
  testOrder: TestOrder;
}) {
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onOpenChange: onEditModalOpenChange,
  } = useDisclosure();
  const {
    isOpen: isCancelModalOpen,
    onOpen: onCancelModalOpen,
    onOpenChange: onCancelModalOpenChange,
  } = useDisclosure();

  return (
    <>
      <NextDropdown>
        <NextDropdownTrigger>
          <button
            className={cn(
              "inline-flex items-center px-2 py-2 text-sm font-medium leading-5 transition duration-100 ease-in bg-white rounded-full hover:shadow",
              "hover:bg-slate-100 hover:text-slate-800 hover:outline-none text-slate-700",
              "sm:p-3 dark:hover:shadow dark:shadow-slate-400 dark:hover:shadow-slate-300"
            )}
            type="button"
          >
            <svg
              className="w-4 h-4"
              width={512}
              height={512}
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx={256} cy={256} r={48} fill="currentColor" />
              <circle cx={416} cy={256} r={48} fill="currentColor" />
              <circle cx={96} cy={256} r={48} fill="currentColor" />
            </svg>
          </button>
        </NextDropdownTrigger>
        <NextDropdownMenu
          aria-label="Actions"
          onAction={(key) => {
            if (key === "set sample") {
              onEditModalOpen();
            }
            if (key === "cancel test order") {
              onCancelModalOpen();
            }
          }}
        >
          <NextDropdownItem key="set sample" className={cn("rounded-md")}>
            <div className="flex items-center space-x-3">
              <p>Set Sample</p>
            </div>
          </NextDropdownItem>

          <NextDropdownItem
            key="cancel test order"
            className={cn(
              "rounded-md",
              testOrder.status === "Cancelled" && "hidden"
            )}
          >
            <div className="flex items-center space-x-3">
              <p>Cancel Test Order</p>
            </div>
          </NextDropdownItem>
        </NextDropdownMenu>
      </NextDropdown>

      <SetSampleModalAction
        isEditModalOpen={isEditModalOpen}
        onEditModalOpenChange={onEditModalOpenChange}
        testOrderId={testOrderId}
        sampleId={sampleId}
        patientId={patientId}
      />

      <CancelModalAction
        isCancelModalOpen={isCancelModalOpen}
        onCancelModalOpenChange={onCancelModalOpenChange}
        testOrderId={testOrderId}
      />
    </>
  );
}

function SetSampleModalAction({
  isEditModalOpen,
  onEditModalOpenChange,
  testOrderId,
  sampleId,
  patientId,
}: {
  isEditModalOpen: boolean;
  onEditModalOpenChange: (isOpen: boolean) => void;
  testOrderId: string;
  sampleId: string | null;
  patientId: string | null;
}) {
  const { data } = useGetPatientSamples({ patientId });
  const patientSamples = data ?? [];
  const patientSamplesForDropdown = patientSamples.map((sample) => {
    return { value: sample.id, label: sample.sampleNumber };
  });

  return (
    <Modal isOpen={isEditModalOpen} onOpenChange={onEditModalOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Set Sample
            </ModalHeader>

            <ModalBody className="px-6 pb-2 overflow-y-auto grow gap-y-5">
              <SetSampleForm
                sampleOptions={patientSamplesForDropdown}
                testOrderId={testOrderId}
                sampleId={sampleId}
                afterSubmit={() => {
                  onClose();
                }}
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

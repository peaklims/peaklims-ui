import { Kbd } from "@/components";
import { Notification } from "@/components/notifications";
import { Calendar } from "@/components/svgs";
import { ExclamationCircle } from "@/components/svgs/exclamation-circle";
import { Stat } from "@/components/svgs/stat";
import { SetSampleModal } from "@/domain/samples/components/set-sample-modal";
import { cn } from "@/lib/utils";
import {
  Dropdown as NextDropdown,
  DropdownItem as NextDropdownItem,
  DropdownMenu as NextDropdownMenu,
  DropdownTrigger as NextDropdownTrigger,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useMarkTestOrderNormal } from "../apis/mark-test-order-normal.api";
import { useMarkTestOrderStat } from "../apis/mark-test-order-stat.api";
import { useRemoveTestOrder } from "../apis/remove-test-order.api";
import { TestOrderStatus } from "../types";
import { AdjustDueDateModal } from "./adjust-due-date-modal";
import { CancelModalAction } from "./cancel-test-order-modal";
import { CancellationInfoButton } from "./cancellation-info-button";
import { TestOrderStatusBadge } from "./status-badge";

type TestOrder = {
  id: string;
  testCode: string;
  testName: string;
  status: string;
  cancellationReason: string | null;
  cancellationComments: string | null;
  priority: "Normal" | "STAT";
  dueDate: Date | null;
  sample: {
    id: string | null;
    sampleNumber: string | null;
  };
};

export function TestOrderCard({
  test: testOrder,
  patientId,
  accessionId,
}: {
  patientId: string;
  test: TestOrder;
  accessionId: string;
}) {
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onOpenChange: onEditModalOpenChange,
  } = useDisclosure();
  return (
    <div
      key={testOrder.id}
      className={cn(
        "flex items-center py-3 pl-1 pr-3 border rounded-lg bg-white",
        testOrder.priority === "STAT" && "border-amber-500"
      )}
    >
      <div className="flex items-start flex-1 pt-4 first:pt-0">
        <div className="flex flex-col w-full pl-2">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <div className="flex items-center flex-1 space-x-2">
                <h5 className="text-sm font-semibold tracking-tight">
                  {testOrder.testName}
                </h5>
                <p className="block text-xs font-semibold text-gray-400">
                  [{testOrder.testCode}]
                </p>
              </div>

              <div className="flex flex-row items-center space-x-3">
                {testOrder?.dueDate !== null &&
                  testOrder?.dueDate !== undefined && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <p className="text-sm">
                        {testOrder?.dueDate?.toString()}
                      </p>
                    </div>
                  )}
                {testOrder.priority === "STAT" && (
                  <div className="flex items-center space-x-1">
                    <p className="text-xs font-semibold text-amber-500">STAT</p>
                    <Stat className="w-4 h-4 text-amber-500" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-start pt-2 space-x-3">
                <TestOrderStatusBadge
                  status={(testOrder.status || "-") as TestOrderStatus}
                />
                {testOrder.status === "Cancelled" && (
                  <CancellationInfoButton
                    cancellationReason={testOrder.cancellationReason ?? ""}
                    cancellationComments={testOrder.cancellationComments ?? ""}
                  />
                )}
              </div>

              <button
                onClick={onEditModalOpen}
                className="inline-flex items-center pt-2 max-w-28 group"
              >
                <>
                  <p className="text-xs font-medium transition-colors group-hover:text-slate-500">
                    {testOrder.sample.sampleNumber || "Sample not assigned"}
                  </p>
                  {(testOrder?.sample?.sampleNumber?.length ?? 0) <= 0 && (
                    <div className="pl-2">
                      <ExclamationCircle className="w-4 h-4 text-rose-500" />
                    </div>
                  )}
                </>
              </button>

              <SetSampleModal
                isEditModalOpen={isEditModalOpen}
                onEditModalOpenChange={onEditModalOpenChange}
                testOrderId={testOrder.id}
                sampleId={testOrder?.sample?.id}
                patientId={patientId}
              />
            </div>
          </div>
        </div>
        <TestOrderActionMenu
          testOrderId={testOrder.id}
          sampleId={testOrder.sample.id}
          patientId={patientId}
          testOrder={testOrder}
          accessionId={accessionId}
        />
      </div>
    </div>
  );
}

function TestOrderActionMenu({
  sampleId,
  testOrderId,
  patientId,
  testOrder,
  accessionId,
}: {
  sampleId: string | null;
  testOrderId: string;
  patientId: string | null;
  testOrder: TestOrder;
  accessionId: string;
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
  const {
    isOpen: isAdjustDueDateModalOpen,
    onOpen: onAdjustDueDateModalOpen,
    onOpenChange: onAdjustDueDateModalOpenChange,
  } = useDisclosure();

  const markTestOrderStat = useMarkTestOrderStat();
  const markTestOrderNormal = useMarkTestOrderNormal();
  const removeTestOrder = useRemoveTestOrder();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useHotkeys(
    "s",
    () => {
      onEditModalOpen();
      setIsDropdownOpen(false);
    },
    {
      enabled: isDropdownOpen,
    }
  );

  useHotkeys(
    "c",
    () => {
      onCancelModalOpen();
      setIsDropdownOpen(false);
    },
    {
      enabled: isDropdownOpen && testOrder.status !== "Cancelled",
    }
  );

  useHotkeys(
    "t",
    () => {
      markStat();
      setIsDropdownOpen(false);
    },
    {
      enabled: isDropdownOpen && testOrder.priority !== "STAT",
    }
  );

  useHotkeys(
    "n",
    () => {
      markNormal();
      setIsDropdownOpen(false);
    },
    {
      enabled: isDropdownOpen && testOrder.priority !== "Normal",
    }
  );

  useHotkeys(
    "d",
    () => {
      onAdjustDueDateModalOpen();
      setIsDropdownOpen(false);
    },
    {
      enabled: isDropdownOpen,
    }
  );

  useHotkeys(
    "r",
    () => {
      handleRemoveTestOrder();
      setIsDropdownOpen(false);
    },
    {
      enabled: isDropdownOpen,
    }
  );

  function markStat() {
    return markTestOrderStat.mutate(testOrderId, {
      onError: () => {
        Notification.error("Failed to mark test order as STAT");
      },
    });
  }
  function markNormal() {
    return markTestOrderNormal.mutate(testOrderId, {
      onError: () => {
        Notification.error("Failed to mark test order as normal priority");
      },
    });
  }

  function handleRemoveTestOrder() {
    if (!testOrder.id) return;

    return removeTestOrder.mutate(
      { testOrderId: testOrder.id, accessionId },
      {
        onError: () => {
          Notification.error("Failed to remove test order");
        },
      }
    );
  }

  return (
    <>
      <NextDropdown
        isOpen={isDropdownOpen}
        onOpenChange={setIsDropdownOpen}
        placement="bottom-end"
      >
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
            if (key === "mark stat") {
              markStat();
            }
            if (key === "mark normal") {
              markNormal();
            }
            if (key === "adjust due date") {
              onAdjustDueDateModalOpen();
            }
            if (key === "remove") {
              handleRemoveTestOrder();
            }
          }}
        >
          <NextDropdownItem key="set sample" className={cn("rounded-md")}>
            <div className="flex items-center justify-between w-full">
              <p>Set Sample</p>
              <Kbd command="S" />
            </div>
          </NextDropdownItem>

          <NextDropdownItem
            key="cancel test order"
            className={cn(
              "rounded-md",
              testOrder.status === "Cancelled" && "hidden"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <p>Cancel Test Order</p>
              <Kbd command="C" />
            </div>
          </NextDropdownItem>

          <NextDropdownItem
            key="mark stat"
            className={cn(
              "rounded-md",
              testOrder.priority === "STAT" && "hidden"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <p>Mark as STAT</p>
              <Kbd command="T" />
            </div>
          </NextDropdownItem>

          <NextDropdownItem
            key="mark normal"
            className={cn(
              "rounded-md",
              testOrder.priority === "Normal" && "hidden"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <p>Mark Normal Priority</p>
              <Kbd command="N" />
            </div>
          </NextDropdownItem>

          <NextDropdownItem key="adjust due date" className={cn("rounded-md")}>
            <div className="flex items-center justify-between w-full">
              <p>Adjust Due Date</p>
              <Kbd command="D" />
            </div>
          </NextDropdownItem>

          <NextDropdownItem key="remove" onClick={handleRemoveTestOrder}>
            <div className="flex items-center justify-between w-full">
              <p>Remove Test Order</p>
              <Kbd command="R" />
            </div>
          </NextDropdownItem>
        </NextDropdownMenu>
      </NextDropdown>

      <SetSampleModal
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

      <AdjustDueDateModal
        isOpen={isAdjustDueDateModalOpen}
        onOpenChange={onAdjustDueDateModalOpenChange}
        testOrder={{
          id: testOrderId,
          dueDate: testOrder.dueDate,
        }}
      />
    </>
  );
}

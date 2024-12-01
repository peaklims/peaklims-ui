import { Notification } from "@/components/notifications";
import { Calendar } from "@/components/svgs";
import { Stat } from "@/components/svgs/stat";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  RichDatePicker,
  getDateControlOnChangeValue,
  getDateControlValue,
} from "@/components/ui/rich-cal";
import { useGetPatientSamples } from "@/domain/samples/apis/get-patient-samples";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { parse } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAdjustTestOrderDueDate } from "../apis/adjust-test-order-due-date.api";
import { useMarkTestOrderNormal } from "../apis/mark-test-order-normal.api";
import { useMarkTestOrderStat } from "../apis/mark-test-order-stat.api";
import { TestOrderStatus } from "../types";
import { CancelModalAction } from "./cancel-test-order-modal";
import { CancellationInfoButton } from "./cancellation-info-button";
import { SetSampleForm } from "./set-sample-form";
import { SetSampleButton, SetSampleModal } from "./set-sample-modal";
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
}: {
  patientId: string;
  test: TestOrder;
}) {
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

              <SetSampleModal
                testOrderId={testOrder.id}
                sampleId={testOrder.sample.id}
                testName={testOrder.testName}
                patientId={patientId}
              >
                <SetSampleButton className="inline-flex items-center pt-2 group">
                  <>
                    <p className="text-xs font-medium transition-colors group-hover:text-slate-500">
                      {testOrder.sample.sampleNumber || "Sample not assigned"}
                    </p>
                    {(testOrder?.sample?.sampleNumber?.length ?? 0) <= 0 && (
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
        <TestOrderActionMenu
          testOrderId={testOrder.id}
          sampleId={testOrder.sample.id}
          patientId={patientId}
          testOrder={testOrder}
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
  const {
    isOpen: isAdjustDueDateModalOpen,
    onOpen: onAdjustDueDateModalOpen,
    onOpenChange: onAdjustDueDateModalOpenChange,
  } = useDisclosure();

  const markTestOrderStat = useMarkTestOrderStat();
  const markTestOrderNormal = useMarkTestOrderNormal();
  const adjustDueDate = useAdjustTestOrderDueDate();

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
            if (key === "mark stat") {
              markTestOrderStat.mutate(testOrderId, {
                onError: () => {
                  Notification.error("Failed to mark test order as STAT");
                },
              });
            }
            if (key === "mark normal") {
              markTestOrderNormal.mutate(testOrderId, {
                onError: () => {
                  Notification.error(
                    "Failed to mark test order as normal priority"
                  );
                },
              });
            }
            if (key === "adjust due date") {
              onAdjustDueDateModalOpen();
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

          <NextDropdownItem key="mark stat" className={cn("rounded-md")}>
            <div className="flex items-center space-x-3">
              <p>Mark as STAT</p>
            </div>
          </NextDropdownItem>

          <NextDropdownItem key="mark normal" className={cn("rounded-md")}>
            <div className="flex items-center space-x-3">
              <p>Mark as Normal Priority</p>
            </div>
          </NextDropdownItem>

          <NextDropdownItem key="adjust due date" className={cn("rounded-md")}>
            <div className="flex items-center space-x-3">
              <p>Adjust Due Date</p>
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

      <Modal
        isOpen={isAdjustDueDateModalOpen}
        onOpenChange={onAdjustDueDateModalOpenChange}
        classNames={{
          base: "overflow-y-visible",
        }}
      >
        <ModalContent>
          <ModalHeader className="text-xl font-semibold">
            Adjust Due Date
          </ModalHeader>
          <ModalBody className="pb-6">
            <AdjustDueDateForm
              testOrderId={testOrderId}
              onClose={onAdjustDueDateModalOpenChange}
              startingDueDate={testOrder.dueDate}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

function AdjustDueDateForm({
  testOrderId,
  onClose,
  startingDueDate,
}: {
  testOrderId: string;
  startingDueDate: Date | null;
  onClose: () => void;
}) {
  const dueDateFormSchema = z.object({
    dueDate: z.date({
      required_error: "Due date is required",
    }),
  });

  type DueDateForm = z.infer<typeof dueDateFormSchema>;

  const parsedStartingDueDate = parse(
    startingDueDate?.toString() ?? "",
    "yyyy-MM-dd",
    new Date()
  );
  const form = useForm<DueDateForm>({
    resolver: zodResolver(dueDateFormSchema),
    defaultValues: {
      dueDate: parsedStartingDueDate,
    },
  });

  const adjustDueDateApi = useAdjustTestOrderDueDate();

  const onSubmit = (values: DueDateForm) => {
    console.log({ values });
    adjustDueDateApi
      .mutateAsync({
        testOrderId,
        dueDate: values.dueDate,
      })
      .then(() => {
        Notification.success("Due date updated successfully");
        onClose();
        form.reset();
      })
      .catch((err) => {
        const statusCode = err?.response?.status;
        if (statusCode !== 422) {
          Notification.error("Error updating due date");
          onClose();
        }
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel required={true}>Due Date</FormLabel>
              <FormControl>
                <RichDatePicker
                  {...field}
                  value={getDateControlValue(field.value)}
                  onChange={(value) => {
                    field.onChange(getDateControlOnChangeValue(value));
                  }}
                  maxValue={"today"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end pt-8">
          <Button type="submit">Ok</Button>
        </div>
      </form>
    </Form>
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

import { Notification } from "@/components/notifications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TestOrderDto } from "@/domain/accessions/types";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import { useMemo, useState } from "react";
import {
  useAddPanelToAccession,
  useAddTestOrderForTest,
} from "../apis/add-test-order.api";
import { useRemoveTestOrder } from "../apis/remove-test-order.api";
import { PanelOrderCard } from "../components/panel-order-card";
import { OrderablePanelsAndTestsDto } from "../types";

export function ManageAccessionTestOrders({
  orderables,
  accessionId,
  testOrders,
  patientId,
}: {
  orderables: OrderablePanelsAndTestsDto | undefined;
  accessionId: string;
  testOrders: TestOrderDto[] | undefined;
  patientId: string | null;
}) {
  return (
    <div className="flex h-full space-x-12">
      <Orderables orderables={orderables} accessionId={accessionId} />
      <OrdersPlaced
        testOrders={testOrders}
        accessionId={accessionId}
        patientId={patientId}
      />
    </div>
  );
}

function OrdersPlaced({
  testOrders,
  accessionId,
  patientId,
}: {
  testOrders: TestOrderDto[] | undefined;
  accessionId: string;
  patientId: string | null;
}) {
  const panelsArray = useGroupedPanels(testOrders || []);
  const removeTestOrderApi = useRemoveTestOrder();

  return (
    <div className="w-full h-full col-span-1 space-y-4">
      <h3 className="text-xl font-semibold tracking-tight">Selected Orders</h3>

      <div className="p-4 space-y-4 overflow-auto bg-white border rounded-lg shadow">
        {testOrders?.length === 0 || !testOrders ? (
          <div className="flex items-center justify-center h-full text-center">
            No panels or tests have been selected for this accession
          </div>
        ) : (
          <>
            {testOrders
              ?.filter((testOrder) => !testOrder.isPartOfPanel)
              ?.map((testOrder) => {
                return (
                  <Test
                    key={testOrder.id}
                    test={testOrder}
                    actionText="Remove"
                    actionFn={(testId) => {
                      removeTestOrderApi
                        .mutateAsync({
                          accessionId: accessionId,
                          testOrderId: testId,
                        })
                        .catch((e) => {
                          Notification.error(
                            "There was an error removing the Test"
                          );
                          console.error(e);
                        });
                    }}
                  />
                );
              })}

            {panelsArray.map((panel) => (
              <PanelOrderCard
                key={panel.id}
                panel={panel}
                accessionId={accessionId}
                patientId={patientId}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function useGroupedPanels(testOrders: TestOrderDto[]) {
  type GroupedPanel = {
    id: string;
    panelCode: string;
    panelName: string;
    panelOrderId: string;
    type: string;
    version: number;
    tests: {
      id: string;
      testCode: string;
      testName: string;
      sample: {
        id: string | null;
        sampleNumber: string | null;
      };
    }[];
  };
  const groupedPanels = testOrders.reduce((groups, order) => {
    const panel = order.panel;
    if (panel && order.isPartOfPanel) {
      if (!groups[panel.id]) {
        groups[panel.id] = {
          ...panel,
          tests: [order],
        };
      } else {
        groups[panel.id].tests.push(order);
      }
    }
    return groups;
  }, {} as Record<string, GroupedPanel>);
  const panelsArray = Object.values(groupedPanels);
  return panelsArray;
}

function Orderables({
  orderables,
  accessionId,
}: {
  orderables: OrderablePanelsAndTestsDto | undefined;
  accessionId: string;
}) {
  const [liveSearchInput, setLiveSearchInput] = useState<string>("");
  const [debouncedSearchInput] = useDebouncedValue(liveSearchInput, 400);

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLiveSearchInput(event.target.value);
  };

  const filteredItems = useMemo(() => {
    const panels = orderables?.panels || [];
    const tests = orderables?.tests || [];

    const allItems = [
      ...panels.map((panel) => ({ type: "panel", data: panel } as const)),
      ...tests.map((test) => ({ type: "test", data: test } as const)),
    ];

    return allItems
      .filter((item) => {
        const name =
          item.type === "panel" ? item.data.panelName : item.data.testName;
        const code =
          item.type === "panel" ? item.data.panelCode : item.data.testCode;
        return (
          name.toLowerCase().includes(debouncedSearchInput.toLowerCase()) ||
          code.toLowerCase().includes(debouncedSearchInput.toLowerCase())
        );
      })
      .sort((a, b) => {
        const nameA = a.type === "panel" ? a.data.panelName : a.data.testName;
        const nameB = b.type === "panel" ? b.data.panelName : b.data.testName;
        return nameA.localeCompare(nameB);
      });
  }, [orderables, debouncedSearchInput]);
  const orderPanelApi = useAddPanelToAccession();
  const orderTestApi = useAddTestOrderForTest();

  return (
    <div className="w-full h-full col-span-1 space-y-4">
      <h3 className="text-xl font-semibold tracking-tight">
        Orderable Panels and Tests
      </h3>
      <Input
        autoFocus
        placeholder="Search"
        value={liveSearchInput}
        onChange={handleSearchInput}
      />
      <div className="h-full p-4 space-y-4 overflow-auto bg-white border rounded-lg shadow">
        {filteredItems.map((item) => {
          return item.type === "panel" ? (
            <Panel
              key={item.data.id}
              panel={item.data}
              actionText="Assign"
              actionFn={(panelId) =>
                orderPanelApi
                  .mutateAsync({
                    accessionId: accessionId,
                    panelId: panelId,
                  })
                  .catch((e) => {
                    Notification.error(
                      "There was an error assigning the Panel"
                    );
                    console.error(e);
                  })
              }
            />
          ) : (
            <Test
              key={item.data.id}
              test={item.data}
              actionText="Assign"
              actionFn={() => {
                orderTestApi
                  .mutateAsync({
                    accessionId: accessionId,
                    testId: item.data.id,
                  })
                  .catch((e) => {
                    Notification.error("There was an error assigning the Test");
                    console.error(e);
                  });
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function Panel({
  panel,
  actionText,
  actionFn,
}: {
  panel: {
    id: string;
    panelCode: string;
    panelName: string;
    type: string;
    version: number;
    tests: {
      id: string;
      testCode: string;
      testName: string;
    }[];
  };
  actionText: string;
  actionFn: (panelId: string) => void;
}) {
  const [showPanelTestsId, setShowPanelTestsId] = useState<string | undefined>(
    undefined
  );
  const detailSectionVariants = {
    open: { opacity: 1, height: "100%" },
    closed: { opacity: 0, height: "0%" },
  };
  return (
    <div
      key={panel.id}
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
                panel.id === showPanelTestsId ? undefined : panel.id
              )
            }
          >
            <motion.div
              initial={false}
              animate={{
                rotate: panel.id === showPanelTestsId ? 90 : 0,
              }}
            >
              <ChevronRightIcon className="w-6 h-6 hover:text-slate-700 text-slate-900" />
            </motion.div>
            <h4 className="flex flex-col items-start font-medium xl:flex-row xl:flex xl:space-x-2">
              <span
                className={`inline-flex ring-inset ring-1 items-center px-2 py-1 text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 ring-indigo-500/10`}
              >
                {panel.panelCode}
              </span>
              <span className="hidden pt-1 sm:block text-start xl:pt-0">
                {panel.panelName}
              </span>
            </h4>
          </button>

          <Button
            className="max-w-[8rem] w-[48%] md:max-w-[5rem]"
            size="sm"
            variant="outline"
            onClick={() => actionFn(panel.id)}
          >
            {actionText}
          </Button>
        </div>
        {panel.id === showPanelTestsId &&
          panel.tests?.map((test, k) => {
            return (
              <motion.div
                className="flex flex-col pt-2 pl-12 space-y-3"
                key={k}
                variants={detailSectionVariants}
                initial="closed"
                animate={panel.id === showPanelTestsId ? "open" : "closed"}
              >
                <div className="flex flex-col pl-2 space-y-2 border-indigo-600 border-l-3">
                  <h5 className="text-sm font-semibold tracking-tight">
                    <p className="block">{test.testName}</p>
                    <p className="block text-xs text-gray-400">
                      [{test.testCode}]
                    </p>
                  </h5>
                </div>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
}

function Test({
  test,
  actionText,
  actionFn,
}: {
  test: {
    id: string;
    testCode: string;
    testName: string;
  };
  actionText: string;
  actionFn: (testId: string) => void;
}) {
  return (
    <div
      key={test.id}
      className="flex flex-col px-3 py-3 space-y-2 border rounded-lg shadow-md"
    >
      <div className="flex items-start justify-between w-full xl:items-center">
        <h4 className="flex flex-col items-start font-medium xl:flex-row xl:flex xl:space-x-2">
          <span
            className={`inline-flex ring-inset ring-1 items-center px-2 py-1 text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 ring-indigo-500/10`}
          >
            {test.testCode}
          </span>
          <span className="hidden pt-1 sm:inline-flex xl:pt-0">
            {test.testName}
          </span>
        </h4>

        <Button
          className="max-w-[8rem] w-[48%] md:max-w-[5rem]"
          size="sm"
          variant="outline"
          onClick={() => actionFn(test.id)}
        >
          {actionText}
        </Button>
      </div>
    </div>
  );
}

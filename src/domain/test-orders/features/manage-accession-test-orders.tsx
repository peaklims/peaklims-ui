import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useAddTestOrderForTest } from "../apis/add-test-order.api";
import {
  OrderablePanel,
  OrderablePanelsAndTestsDto,
  OrderableTest,
} from "../types";

function ManageAccessionTestOrders({
  orderables,
  accessionId,
}: {
  orderables: OrderablePanelsAndTestsDto | undefined;
  accessionId: string;
}) {
  return (
    <div className="flex h-full space-x-12">
      <Orderables orderables={orderables} accessionId={accessionId} />
      <OrdersPlaced orderables={orderables} />
    </div>
  );
}

function OrdersPlaced({
  orderables,
}: {
  orderables: OrderablePanelsAndTestsDto | undefined;
}) {
  return (
    <div className="w-full h-full col-span-1 space-y-4">
      <h3 className="text-xl font-semibold tracking-tight">Selected Orders</h3>

      <div className="p-4 space-y-10 overflow-auto bg-white border rounded-lg shadow ">
        <div className="flex items-center justify-center h-full text-center">
          No panels or tests have been selected for this accession
        </div>
      </div>
    </div>
  );
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
            <Panel panel={item.data as OrderablePanel} />
          ) : (
            <Test test={item.data as OrderableTest} accessionId={accessionId} />
          );
        })}
      </div>
    </div>
  );
}

function Panel({ panel }: { panel: OrderablePanel }) {
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
        <div className="flex items-center justify-between w-full">
          <button
            className={"flex items-center h-full px-2 py-1 space-x-2"}
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
            <h4 className="flex flex-col items-start font-medium lg:space-x-2 lg:flex-row">
              <span
                className={`inline-flex ring-inset ring-1 items-center px-2 py-1 text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 ring-indigo-500/10`}
              >
                {panel.panelCode}
              </span>
              <span className="hidden sm:inline-flex">{panel.panelName}</span>
            </h4>
          </button>

          <Button
            className="max-w-[8rem] w-[48%] md:max-w-[5rem]"
            size="sm"
            variant="outline"
            onClick={() => alert(`do things to ${panel.panelName}`)}
          >
            Assign
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
  accessionId,
}: {
  test: OrderableTest;
  accessionId: string;
}) {
  const orderTestApi = useAddTestOrderForTest();
  return (
    <div
      key={test.id}
      className="flex flex-col px-3 py-3 space-y-2 border rounded-lg shadow-md"
    >
      <div className="flex items-center justify-between flex-1">
        <h4 className="flex flex-col items-start font-medium lg:space-x-2 lg:flex-row">
          <span
            className={`inline-flex ring-inset ring-1 items-center px-2 py-1 text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 ring-indigo-500/10`}
          >
            {test.testCode}
          </span>
          <span className="hidden sm:inline-flex">{test.testName}</span>
        </h4>

        <Button
          className="max-w-[8rem] w-[48%] md:max-w-[5rem]"
          size="sm"
          variant="outline"
          onClick={() => {
            orderTestApi.mutate({
              accessionId: accessionId,
              testId: test.id,
            });
          }}
        >
          Assign
        </Button>
      </div>
    </div>
  );
}

export default ManageAccessionTestOrders;

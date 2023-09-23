import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";

function ManageAccessionTestOrders({
  orderables,
}: {
  orderables: OrderablePanelsAndTestsDto | undefined;
}) {
  const [showPanelTestsId, setShowPanelTestsId] = useState<string | undefined>(
    undefined
  );
  const detailSectionVariants = {
    open: { opacity: 1, height: "100%" },
    closed: { opacity: 0, height: "0%" },
  };

  const [liveSearchInput, setLiveSearchInput] = useState<string>("");
  const [debouncedSearchInput] = useDebouncedValue(liveSearchInput, 400);

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLiveSearchInput(event.target.value);
  };

  const filteredPanels = orderables?.panels?.filter(
    (panel) =>
      panel.panelName
        .toLowerCase()
        .includes(debouncedSearchInput.toLowerCase()) ||
      panel.panelCode.toLowerCase().includes(debouncedSearchInput.toLowerCase())
  );

  const filteredTests = orderables?.tests?.filter(
    (test) =>
      test.testName
        .toLowerCase()
        .includes(debouncedSearchInput.toLowerCase()) ||
      test.testCode.toLowerCase().includes(debouncedSearchInput.toLowerCase())
  );

  return (
    <div className="w-full md:w-[47%] h-full space-y-2">
      <h3 className="text-xl font-semibold tracking-tight">
        Orderable Panels and Tests
      </h3>

      <Input
        autoFocus
        placeholder="Search"
        value={liveSearchInput}
        onChange={handleSearchInput}
      />

      <div className="h-full space-y-10 overflow-auto">
        <div className="space-y-2 h-[38%]">
          <h4 className="font-medium">Panels</h4>
          <div className="h-full p-4 space-y-2 overflow-auto bg-white border rounded-lg shadow">
            {filteredPanels &&
              filteredPanels?.map((panel) => {
                return (
                  <div
                    key={panel.id}
                    className="flex items-center py-3 pl-1 pr-3 border rounded-lg shadow-md"
                  >
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between w-full">
                        <button
                          className={
                            "flex items-center h-full px-2 py-1 space-x-2"
                          }
                          onClick={() =>
                            setShowPanelTestsId(
                              panel.id === showPanelTestsId
                                ? undefined
                                : panel.id
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
                            <span className="hidden sm:inline-flex">
                              {panel.panelName}
                            </span>
                          </h4>
                        </button>

                        <Button
                          className="max-w-[8rem] w-[48%] md:max-w-[5rem]"
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            alert(`do things to ${panel.panelName}`)
                          }
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
                              animate={
                                panel.id === showPanelTestsId
                                  ? "open"
                                  : "closed"
                              }
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
              })}
          </div>
        </div>

        <div className="h-[38%] space-y-2">
          <h4 className="font-medium">Tests</h4>
          <div className="h-full p-4 space-y-5 overflow-auto bg-white border rounded-lg shadow">
            {filteredTests &&
              filteredTests?.map((test) => {
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
                        <span className="hidden sm:inline-flex">
                          {test.testName}
                        </span>
                      </h4>

                      <Button
                        className="max-w-[8rem] w-[48%] md:max-w-[5rem]"
                        size="sm"
                        variant="outline"
                        onClick={() => alert(`do things to ${test.testName}`)}
                      >
                        Assign
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageAccessionTestOrders;

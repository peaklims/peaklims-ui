import { Notification } from "@/components/notifications";
import { Button } from "@/components/ui/button";
import { Combobox, getLabelById } from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { TestOrderDto } from "@/domain/accessions/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Item } from "react-stately";
import { z } from "zod";
import { Badge } from "../../../components/badge";
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
    <div className="flex-col h-full space-y-6">
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
  const orderPanelApi = useAddPanelToAccession();
  const orderTestApi = useAddTestOrderForTest();

  const orderableFormSchema = z.object({
    orderableId: z.string().min(1, "Please select an orderable"),
    type: z.string().min(1),
  });

  type OrderableFormData = z.infer<typeof orderableFormSchema>;

  const orderableForm = useForm<OrderableFormData>({
    resolver: zodResolver(orderableFormSchema),
    defaultValues: {
      orderableId: "",
      type: "",
    },
    mode: "onSubmit",
  });
  const orderablesForDropdown = useMemo(() => {
    const panels = orderables?.panels || [];
    const tests = orderables?.tests || [];

    const allItems = [
      ...panels.map((panel) => ({ type: "panel", data: panel } as const)),
      ...tests.map((test) => ({ type: "test", data: test } as const)),
    ];

    // Map the items to the desired format
    const mappedItems = allItems.map((item) => ({
      value: item.data.id,
      type: item.type,
      orderCode:
        item.type === "panel" ? item.data.panelCode : item.data.testCode,
      name: item.type === "panel" ? item.data.panelName : item.data.testName,
      label:
        item.type === "panel"
          ? `${item.data.panelCode} - ${item.data.panelName}`
          : `${item.data.testCode} - ${item.data.testName}`,
    }));

    const sortedItems = mappedItems.sort((a, b) => {
      if (a.orderCode < b.orderCode) return -1;
      if (a.orderCode > b.orderCode) return 1;
      return 0;
    });

    return sortedItems;
  }, [orderables]);

  const [inputValue, setInputValue] = useState("");

  const assignOrderable = async (data: OrderableFormData) => {
    try {
      if (data.type === "panel") {
        await orderPanelApi.mutateAsync({
          accessionId: accessionId,
          panelId: data.orderableId,
        });
      } else {
        await orderTestApi.mutateAsync({
          accessionId: accessionId,
          testId: data.orderableId,
        });
      }

      orderableForm.reset({
        orderableId: "",
        type: "",
      });
      setInputValue("");
    } catch (e) {
      Notification.error(`There was an error ordering the ${data.type}`);
      console.error(e);
    }
  };

  return (
    <div className="w-full h-full col-span-1 space-y-2">
      <h3 className="text-xl font-semibold tracking-tight">
        Orderable Panels and Tests
      </h3>
      <Form {...orderableForm}>
        <form
          className="flex items-end justify-between w-full space-x-3"
          onSubmit={orderableForm.handleSubmit(assignOrderable)}
        >
          <FormField
            control={orderableForm.control}
            name="orderableId"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel required={false} className="sr-only text-slate-800">
                  Select a panel or test
                </FormLabel>
                <FormControl>
                  <Combobox
                    autoFocus={true}
                    classNames={{
                      wrapper: "w-full",
                      input: "w-full",
                    }}
                    placeholder="Select a panel or test"
                    label={field.name}
                    inputValue={inputValue}
                    onInputChange={(value) => {
                      setInputValue(value);
                    }}
                    selectedKey={field.value}
                    onSelectionChange={(key) => {
                      field.onChange(key);
                      setInputValue(
                        getLabelById({
                          id: key?.toString() ?? "",
                          data: orderablesForDropdown ?? [],
                        })
                      );

                      // Update the 'type' field in the form state
                      const selectedItem = orderablesForDropdown.find(
                        (item) => item.value === key
                      );
                      if (selectedItem) {
                        orderableForm.setValue("type", selectedItem.type);
                      }
                    }}
                  >
                    {orderablesForDropdown?.map((item) => (
                      <Item key={item.value} textValue={item.label}>
                        <div className="flex space-x-2">
                          <span className="font-bold">{item.orderCode}</span>
                          <span className="">-</span>
                          <p className="">{item.name}</p>
                        </div>
                      </Item>
                    ))}
                  </Combobox>
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant="outline"
            disabled={!orderableForm.watch("orderableId")}
          >
            Assign
          </Button>
        </form>
      </Form>
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
          <Badge text={test.testCode} variant="indigo" />
          <span className="hidden pt-1 text-base sm:inline-flex xl:pt-0">
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

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { CircleIcon, TimerIcon, XCircle } from "lucide-react";
import { FilterControl } from "./filter-control";

interface AccessionWorklistToolbarProps<TData> {
  table: Table<TData>;
}

export function AccessionWorklistToolbar<TData>({
  table,
}: AccessionWorklistToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  // const [filterValues, setFilterValues] = useState<Array<{propertyName: string, filterValue: string|null}>>([]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center flex-1 space-x-2">
        <Input
          placeholder="Filter accessions..."
          value={
            (table.getColumn("accessionNumber")?.getFilterValue() as string) ??
            ""
          }
          onChange={(event) =>
            // table
            //   .getColumn("accessionNumber")
            //   ?.setFilterValue(event.target.value)
            console.log(event.target.value)
          }
          className="w-48 h-8 lg:w-54"
        />
        {table.getColumn("status") && (
          <FilterControl
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <XCircle className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}

const statuses = [
  {
    value: "Draft",
    label: "Draft",
    icon: CircleIcon,
  },
  {
    value: "Ready For Testing",
    label: "Ready For Testing",
    icon: TimerIcon,
  },
];

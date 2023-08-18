"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleIcon, TimerIcon, XCircle } from "lucide-react";
import { FilterControl } from "./filter-control";
import { useAccessioningWorklistTableStore } from "./paginated-data-table";

export function AccessionWorklistToolbar() {
  const {
    filterInput: filter,
    setFilterInput: setFilter,
    isFiltered,
    resetFilters,
  } = useAccessioningWorklistTableStore();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center flex-1 space-x-2">
        <Input
          placeholder="Filter accessions..."
          value={(filter as string) ?? ""}
          onChange={(event) => {
            setFilter(event.target.value);
          }}
          className="w-48 h-8 lg:w-54"
        />
        <FilterControl title="Status" options={statuses} />
        {isFiltered.result() && (
          <Button
            variant="ghost"
            onClick={() => resetFilters()}
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

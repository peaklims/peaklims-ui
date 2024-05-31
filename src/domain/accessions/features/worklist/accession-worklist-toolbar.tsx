"use client";

import { Kbd, TooltipHotkey } from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNewAccession } from "@/domain/accessions";
import { FilterControl } from "@/domain/accessions/features/worklist/accession-worklist-filter-control";
import { useAccessioningWorklistTableStore } from "@/domain/accessions/features/worklist/accession-worklist.store";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Tooltip } from "@nextui-org/react";
import { CircleIcon, PlusCircle, TimerIcon, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { AccessionStatus } from "../../types";

export function AccessionWorklistToolbar() {
  const { filterInput, setFilterInput, isFiltered, resetFilters } =
    useAccessioningWorklistTableStore();
  const [liveValue, setLiveValue] = useState(filterInput);
  const [debouncedFilterInput] = useDebouncedValue(liveValue, 400);

  useEffect(() => {
    setFilterInput(debouncedFilterInput);
    if (debouncedFilterInput === null) {
      resetFilters();
    }
  }, [debouncedFilterInput, resetFilters, setFilterInput]);

  const createAccession = useNewAccession();
  useHotkeys("a", () => {
    createAccession();
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useHotkeys(
    "f",
    (event) => {
      event.preventDefault();
      inputRef.current?.focus();
    },
    { enableOnTags: ["INPUT", "TEXTAREA"] }
  );

  return (
    <div className="flex-col space-y-3 sm:flex-row sm:flex sm:items-center sm:justify-between sm:flex-1 sm:space-y-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 space-x-2">
          <div className="relative">
            <Input
              ref={inputRef}
              placeholder="Filter accessions..."
              value={(liveValue as string) ?? ""}
              onChange={(event) => {
                setLiveValue(event.currentTarget.value);
              }}
              className="w-48 lg:w-54"
            />
            {(liveValue?.length ?? 0) <= 0 && (
              <span className="absolute text-gray-500 transform -translate-y-1/2 pointer-events-none right-2 top-[45%]">
                <Kbd command={"F"} />
              </span>
            )}
          </div>
          <FilterControl title="Status" options={statuses} />
          {isFiltered.result() && (
            <Button
              variant="ghost"
              onClick={() => {
                setLiveValue(null);
                resetFilters();
              }}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <XCircle className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      <Tooltip
        placement="top"
        closeDelay={0}
        delay={600}
        content={
          <TooltipHotkey>
            Create New Accession <Kbd command={"A"} />
          </TooltipHotkey>
        }
      >
        <Button
          className="w-full space-x-2 sm:w-auto"
          onClick={() => createAccession()}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Accession</span>
        </Button>
      </Tooltip>
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
  {
    value: "Testing",
    label: "Testing",
    icon: TimerIcon,
  },
  {
    value: "Testing Complete",
    label: "Testing Complete",
    icon: TimerIcon,
  },
  {
    value: "Report Pending",
    label: "Report Pending",
    icon: TimerIcon,
  },
  {
    value: "Report Complete",
    label: "Report Complete",
    icon: TimerIcon,
  },
  {
    value: "Completed",
    label: "Completed",
    icon: TimerIcon,
  },
  {
    value: "Abandoned",
    label: "Abandoned",
    icon: TimerIcon,
  },
  {
    value: "Cancelled",
    label: "Cancelled",
    icon: TimerIcon,
  },
  {
    value: "Qns",
    label: "QNS",
    icon: TimerIcon,
  },
] as { value: AccessionStatus; label: string; icon: any }[];

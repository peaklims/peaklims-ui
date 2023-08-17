import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Pagination } from "@/types/apis";
import {
  ArrowLeftToLine,
  ArrowRightFromLine,
  Check,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDown,
} from "lucide-react";
import { useState } from "react";
import { PageSizeOptions } from "./BasicAccessioningWorklist";

interface PaginationControlsProps {
  entityPlural: string;
  pageNumber: number;
  apiPagination: Pagination | undefined;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
}

export function PaginationControls({
  entityPlural,
  pageNumber,
  apiPagination,
  pageSize,
  setPageSize,
  setPageNumber,
}: PaginationControlsProps) {
  return (
    <div
      className="flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-700 sm:rounded-b-lg"
      aria-label={`Table navigation for ${entityPlural} table`}
    >
      <div className="flex items-center flex-1 space-x-5">
        <span className="flex text-sm font-normal text-slate-500 dark:text-slate-400 min-w-[4rem]">
          <div>Page</div>
          <span className="pl-1 font-semibold text-slate-900 dark:text-white">
            {pageNumber}{" "}
            {apiPagination?.totalPages
              ? `of ${apiPagination?.totalPages}`
              : null}
          </span>
        </span>

        <div className="w-32">
          <PaginationCombobox
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPageNumber(1);
            }}
          />
        </div>
      </div>

      <div className="inline-flex items-center -space-x-[2px]">
        <button
          aria-label="First page"
          className={cn(
            "ml-0 block rounded-l-lg border border-slate-300 bg-white py-2 px-3 leading-tight text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
            !apiPagination?.hasPrevious
              ? "cursor-not-allowed opacity-50 transition-opacity duration-500"
              : "hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
          )}
          onClick={() => setPageNumber(1)}
          disabled={!apiPagination?.hasPrevious}
        >
          {<ArrowLeftToLine className="w-5 h-5" />}
        </button>
        <button
          aria-label="Previous page"
          className={cn(
            "inline border border-slate-300 bg-white py-2 px-3 leading-tight text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
            !apiPagination?.hasPrevious
              ? "cursor-not-allowed opacity-50 transition-opacity duration-500"
              : "hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
          )}
          onClick={() =>
            setPageNumber(
              apiPagination?.pageNumber ? apiPagination?.pageNumber - 1 : 1
            )
          }
          disabled={!apiPagination?.hasPrevious}
        >
          {<ChevronLeftIcon className="w-5 h-5" />}
        </button>
        <button
          aria-label="Next page"
          className={cn(
            "inline border border-slate-300 bg-white py-2 px-3 leading-tight text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
            !apiPagination?.hasNext
              ? "cursor-not-allowed opacity-50 transition-opacity duration-500"
              : "hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
          )}
          onClick={() =>
            setPageNumber(
              apiPagination?.pageNumber ? apiPagination?.pageNumber + 1 : 1
            )
          }
          disabled={!apiPagination?.hasNext}
        >
          {<ChevronRightIcon className="w-5 h-5" />}
        </button>
        <button
          aria-label="Last page"
          className={cn(
            "block rounded-r-lg border border-slate-300 bg-white py-2 px-3 leading-tight text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
            !apiPagination?.hasNext
              ? "cursor-not-allowed opacity-50 transition-opacity duration-500"
              : "hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
          )}
          onClick={() =>
            setPageNumber(
              apiPagination?.totalPages ? apiPagination?.totalPages : 1
            )
          }
          disabled={!apiPagination?.hasNext}
        >
          {<ArrowRightFromLine className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

function PaginationCombobox({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const pageSizes = PageSizeOptions.map((selectedPageSize) => ({
    value: selectedPageSize.toString(),
    label: `Show ${selectedPageSize}`,
  }));
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[150px] justify-between"
        >
          {value
            ? pageSizes.find((pageSize) => pageSize.value === value)?.label
            : "Select page size..."}
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[150px] p-0">
        <Command>
          <CommandGroup>
            {pageSizes.map((pageSize) => (
              <CommandItem
                key={pageSize.value}
                onSelect={() => {
                  onValueChange(pageSize.value === value ? "" : pageSize.value);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === pageSize.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {pageSize.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

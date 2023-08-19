import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AccessionWorklistToolbar } from "@/domain/accessions/components/worklist/accession-worklist-toolbar";
import { Pagination } from "@/types/apis";
import { RegisteredRoutesInfo, useNavigate } from "@tanstack/react-router";
import { create } from "zustand";
import { PaginationControls } from "./pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: Pagination;
  isLoading?: boolean;
  skeletonRowCount?: number;
}

export const PageSizeOptions = [1, 10, 20, 30, 40, 50] as const;
export type PageSizeNumber = (typeof PageSizeOptions)[number];

export interface PaginatedTableStore {
  setPageNumber: (page: number) => void;
  pageNumber: number;
  pageSize: number;
  setPageSize: (size: number) => void;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  initialPageSize: number;
  isFiltered: { result: () => boolean };
  resetFilters: () => void;
  queryKit: {
    filterValue: () => string;
  };
}

export interface AccessioningWorklistTableStore extends PaginatedTableStore {
  status: string[];
  addStatus: (status: string) => void;
  removeStatus: (status: string) => void;
  clearStatus: () => void;
  filterInput: string | null;
  setFilterInput: (f: string | null) => void;
}

export const useAccessioningWorklistTableStore =
  create<AccessioningWorklistTableStore>((set, get) => ({
    initialPageSize: 10,
    pageNumber: 1,
    setPageNumber: (page) => set({ pageNumber: page }),
    pageSize: 10,
    setPageSize: (size) => set({ pageSize: size }),
    sorting: [],
    setSorting: (sortOrUpdater) => {
      if (typeof sortOrUpdater === "function") {
        set((prevState) => ({ sorting: sortOrUpdater(prevState.sorting) }));
      } else {
        set({ sorting: sortOrUpdater });
      }
    },
    status: [],
    addStatus: (status) =>
      set((prevState) => ({ status: [...prevState.status, status] })),
    removeStatus: (status) =>
      set((prevState) => ({
        status: prevState.status.filter((s) => s !== status),
      })),
    clearStatus: () => set({ status: [] }),
    filterInput: null,
    setFilterInput: (f) => set({ filterInput: f }),
    isFiltered: {
      result: () => get().status.length > 0 || get().filterInput !== null,
    },
    resetFilters: () => set({ status: [], filterInput: null }),
    queryKit: {
      filterValue: () => {
        const statusFilter = get()
          .status.map((status) => `status == "${status}"`)
          .join(" || ");
        const accessionNumberFilter = get().filterInput
          ? `accessionNumber @=* "${get().filterInput}"`
          : "";
        if (statusFilter && accessionNumberFilter) {
          return `${statusFilter} && ${accessionNumberFilter}`;
        }
        if (statusFilter.length > 0) return statusFilter;
        if (accessionNumberFilter.length > 0) return accessionNumberFilter;
        return "";
      },
    },
  }));

export function PaginatedDataTable<TData, TValue>({
  columns,
  data,
  pagination,
  isLoading = false,
  skeletonRowCount = 3,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const {
    sorting,
    setSorting,
    pageSize,
    setPageSize,
    pageNumber,
    setPageNumber,
  } = useAccessioningWorklistTableStore();

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageSize: pageSize ?? 10,
        pageIndex: pageNumber ?? 1,
      },
    },
    manualPagination: true,
    manualSorting: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <AccessionWorklistToolbar />
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              SkeletonRows<TData, TValue>(
                skeletonRowCount,
                columns,
                columnVisibility
              )
            ) : (
              <>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onRowClick={() => {
                        navigate({
                          to: `/accessions/${row.getValue(
                            "id"
                          )}` as RegisteredRoutesInfo["routePaths"],
                        });
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
        <PaginationControls
          entityPlural={"Accessions"}
          pageNumber={pageNumber}
          apiPagination={pagination}
          pageSize={pageSize}
          setPageSize={setPageSize}
          setPageNumber={setPageNumber}
        />
      </div>
    </div>
  );
}

function SkeletonRows<TData, TValue>(
  skeletonRowCount: number,
  columns: ColumnDef<TData, TValue>[],
  columnVisibility: VisibilityState
) {
  return (
    <>
      {Array.from({ length: skeletonRowCount }, (_, rowIndex) => (
        <TableRow className="px-6 py-4" key={rowIndex}>
          {Array.from(
            {
              length:
                columns.length -
                Object.values(columnVisibility).filter(
                  (value) => value === false
                ).length,
            },
            (_, cellIndex) => (
              <TableCell
                key={`row${cellIndex}col${rowIndex}`}
                colSpan={columns.length}
                className="px-6 py-3"
              >
                <div
                  key={`row${cellIndex}col${rowIndex}`}
                  className="w-3/4 h-2 rounded-full bg-input"
                />
              </TableCell>
            )
          )}
        </TableRow>
      ))}
    </>
  );
}

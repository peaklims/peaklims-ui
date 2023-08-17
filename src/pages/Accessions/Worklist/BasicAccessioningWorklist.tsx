import React, { createContext, useContext, useState } from "react";
("use client");

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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/types/apis";
import { PaginationControls } from "./Pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: Pagination;
  isLoading?: boolean;
  skeletonRowCount?: number;
}

interface PaginatedTableContextResponse {
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  pageNumber: number;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  initialPageSize: number;
}

const PaginatedTableContext = createContext<PaginatedTableContextResponse>(
  {} as PaginatedTableContextResponse
);

export const PageSizeOptions = [1, 10, 20, 30, 40, 50] as const;
export type PageSizeNumber = (typeof PageSizeOptions)[number];
interface PaginatedTableProviderProps {
  initialPageSize?: PageSizeNumber;
  children: React.ReactNode;
  props?: any;
}

export function PaginatedTableProvider({
  initialPageSize = 10,
  children,
  props,
}: PaginatedTableProviderProps) {
  const [sorting, setSorting] = useState<SortingState>();
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const value = {
    sorting,
    setSorting,
    pageSize,
    setPageSize,
    pageNumber,
    setPageNumber,
    initialPageSize,
  };

  return (
    <PaginatedTableContext.Provider value={value} {...props}>
      {children}
    </PaginatedTableContext.Provider>
  );
}

export function usePaginatedTableContext() {
  const context = useContext(PaginatedTableContext);
  if (Object.keys(context).length === 0)
    throw new Error(
      "usePaginatedTableContext must be used within a PaginatedTableProvider"
    );
  return context;
}

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
  } = usePaginatedTableContext();

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

  return (
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
            <>
              {Array.from({ length: skeletonRowCount }, (_, rowIndex) => (
                <tr key={`row${rowIndex}`} className="px-6 py-4">
                  {Array.from(
                    {
                      length:
                        columns.length -
                        Object.values(columnVisibility).filter(
                          (value) => value === false
                        ).length,
                    },
                    (_, cellIndex) => (
                      <td
                        key={`row${cellIndex}col${rowIndex}`}
                        className="px-6 py-3"
                      >
                        <div
                          key={`row${cellIndex}col${rowIndex}`}
                          className="w-3/4 h-2 rounded-full bg-slate-200 dark:bg-slate-800"
                        ></div>
                      </td>
                    )
                  )}
                </tr>
              ))}
            </>
          ) : (
            <>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
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
  );
}

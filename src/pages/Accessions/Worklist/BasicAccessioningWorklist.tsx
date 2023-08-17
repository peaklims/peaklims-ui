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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
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

const PageSizeOptions = [1, 10, 20, 30, 40, 50] as const;
export type PageSizeNumber = (typeof PageSizeOptions)[number];
interface PaginatedTableProviderProps {
  initialPageSize?: PageSizeNumber;
  children: React.ReactNode;
  props?: any;
}

export function PaginatedTableProvider({
  initialPageSize = 10,
  props,
  children,
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

function usePaginatedTableContext() {
  const context = useContext(PaginatedTableContext);
  if (Object.keys(context).length === 0)
    throw new Error(
      "usePaginatedTableContext must be used within a PaginatedTableProvider"
    );
  return context;
}

export function BasicAccessioningWorklist<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // const [sorting, setSorting] = useState<SortingState>([]);

  const {
    sorting,
    setSorting,
    pageSize,
    setPageSize,
    pageNumber,
    setPageNumber,
    initialPageSize,
  } = usePaginatedTableContext();

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

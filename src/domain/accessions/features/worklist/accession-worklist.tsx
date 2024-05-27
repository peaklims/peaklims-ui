import {
  ColumnDef,
  ColumnFiltersState,
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
import { AccessionWorklistToolbar } from "@/domain/accessions/features/worklist/accession-worklist-toolbar";
import { Pagination } from "@/types/apis";
import { RegisteredRoutesInfo, useNavigate } from "@tanstack/react-router";
import { PaginationControls } from "../../../../components/data-table/pagination";
import { useAccessioningWorklistTableStore } from "./accession-worklist.store";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: Pagination;
  isLoading?: boolean;
  skeletonRowCount?: number;
}

export function AccessionWorklist<TData, TValue>({
  columns,
  data,
  pagination,
  isLoading = false,
  skeletonRowCount = 3,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
    status: false,
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
                      className="group"
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
                      className="h-16 text-center"
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
                colSpan={1}
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

import { Column } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, SortAsc } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <span>{title}</span>
      <Button
        variant="ghost"
        size="sm"
        className="h-8"
        onClick={() => column.toggleSorting()}
      >
        {column.getIsSorted() === "desc" ? (
          <ArrowDownIcon className="w-4 h-4 text-primary" />
        ) : column.getIsSorted() === "asc" ? (
          <ArrowUpIcon className="w-4 h-4 text-primary" />
        ) : (
          <SortAsc className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
}

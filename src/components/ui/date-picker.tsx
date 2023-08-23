"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function DatePicker({
  value,
  onChange,
  buttonClassName,
  disabled,
}: {
  value?: Date | undefined;
  onChange?: (...event: any[]) => void;
  buttonClassName?: string;
  disabled?: boolean;
}) {
  const [date, setDate] = useState<Date>();
  value ??= date;
  onChange ??= setDate;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "block",
            !value && "text-muted-foreground",
            buttonClassName
          )}
        >
          <div className="flex items-center justify-start font-normal text-left min-w-[7rem]">
            <CalendarIcon className="w-4 h-4 mr-2" />
            {value ? format(value, "PPP") : <span>Pick a date</span>}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

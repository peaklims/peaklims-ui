"use client";

import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { format, isValid, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { IMaskInput } from "react-imask";
export function DateInput({
  value,
  onChange,
  buttonClassName,
  disabled,
  fromYear = 1920,
  toYear = 2030,
}: {
  value?: Date | undefined;
  onChange?: (...event: any[]) => void;
  buttonClassName?: string;
  disabled?: boolean;
  fromYear?: number;
  toYear?: number;
}) {
  const [date, setDate] = useState<Date>();
  value ??= date;
  onChange ??= setDate;

  return (
    <Popover placement="bottom">
      <div className="relative flex items-center">
        <IMaskInput
          mask="0000-00-00"
          lazy={false}
          value={value ? format(value, "yyyy-MM-dd") : ""}
          onAccept={(newValue: any) => {
            const parsedDate = parse(newValue, "yyyy-MM-dd", new Date());
            if (isValid(parsedDate)) {
              if (onChange) {
                onChange(parsedDate);
              }
            } else {
              // reset the input? show an error message?
            }
          }}
          disabled={disabled}
          className={cn(
            "min-h-[40px] flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            "pr-12",
            buttonClassName
          )}
          placeholder="Pick a date"
        />
        <PopoverTrigger>
          <div className="absolute right-4">
            <CalendarIcon className="w-4 h-4 mr-2 hover:opacity-70" />
          </div>
        </PopoverTrigger>
      </div>

      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          defaultMonth={value ?? new Date()}
          onSelect={onChange}
          initialFocus
          captionLayout="dropdown"
          fromYear={fromYear}
          toYear={toYear}
        />
      </PopoverContent>
    </Popover>
  );
}

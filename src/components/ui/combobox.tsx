"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { caseInsensitiveEquals } from "@/utils/string-utilities";

export function Combobox({
  items,
  emptyMessage = "No items found.",
  buttonText = "Select item...",
  dropdownProps,
  buttonProps,
  value,
  onChange,
}: {
  items: { label: string; value: string }[];
  emptyMessage?: string;
  buttonText?: string;
  dropdownProps?: React.ComponentProps<typeof PopoverContent>;
  buttonProps?: React.ComponentProps<typeof Button>;
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-48 block ", buttonProps?.className)}
        >
          <span className="flex items-center justify-between">
            {internalValue
              ? items.find((item) =>
                  caseInsensitiveEquals(item.value, internalValue)
                )?.label
              : buttonText}
            <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-48 p-0", dropdownProps?.className)}>
        <Command>
          <CommandInput placeholder="Search item..." />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup>
            {items.map((item) => (
              <CommandItem
                key={item.value}
                onSelect={(currentValue) => {
                  setInternalValue(
                    currentValue === internalValue ? "" : currentValue
                  );
                  if (onChange)
                    onChange(
                      currentValue === internalValue ? "" : currentValue
                    );
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === item.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

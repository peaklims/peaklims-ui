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
import { caseInsensitiveEquals } from "@/utils/strings";

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

  const selectedItem = items.find((item) =>
    caseInsensitiveEquals(item.value, value)
  );

  const displayText =
    (selectedItem?.label?.length ?? 0) > 0 ? selectedItem!.label : buttonText;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full block hover:bg-transparent ",
            buttonProps?.className
          )}
        >
          <div className="flex">
            <p className="flex items-center justify-between flex-1 truncate">
              {displayText}
            </p>
            <div className="pl-2">
              <ChevronsUpDown className="w-4 h-4 opacity-50 shrink-0" />
            </div>
          </div>
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
                  if (onChange)
                    onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
                className={item.label.length === 0 ? "hidden" : undefined}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    caseInsensitiveEquals(value, item.value)
                      ? "opacity-100"
                      : "opacity-0"
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

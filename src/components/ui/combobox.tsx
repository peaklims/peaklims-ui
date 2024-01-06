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
import { cn } from "@/lib/utils";
import { caseInsensitiveEquals } from "@/utils/strings";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";

export function Combobox({
  items,
  emptyMessage = "No items found.",
  buttonText = "Select item...",
  dropdownProps,
  buttonProps,
  value,
  onChange,
  autoFocus,
}: {
  items: { label: string; value: string; disabled?: boolean }[];
  emptyMessage?: string;
  buttonText?: string;
  dropdownProps?: React.ComponentProps<typeof PopoverContent>;
  buttonProps?: React.ComponentProps<typeof Button>;
  value?: string;
  onChange?: (value: string) => void;
  autoFocus?: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  const selectedItem = items?.find((item) => {
    if (value === undefined) return undefined;

    return caseInsensitiveEquals(item.value, value);
  });

  const displayText =
    (selectedItem?.label?.length ?? 0) > 0 ? selectedItem!.label : buttonText;

  const filterByLabel = (value: string, search: string) => {
    const originalItem = items.find((item) => item.value === value);
    if (originalItem && originalItem.label.toLowerCase().includes(search))
      return 1;
    return 0;
  };

  return (
    <Popover
      placement="bottom"
      isOpen={open}
      onOpenChange={setOpen}
      triggerScaleOnOpen={false}
    >
      <PopoverTrigger>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          {...buttonProps}
          className={cn(
            "w-full block hover:bg-transparent",
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
        <Command filter={filterByLabel}>
          <CommandInput placeholder="Search item..." />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup {...dropdownProps}>
            {items != undefined &&
              items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    if (onChange)
                      onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className={cn(
                    item.label.length === 0 ? "hidden" : undefined,
                    item.disabled ? "opacity-25 cursor-not-allowed" : undefined
                  )}
                  disabled={item?.disabled ?? false}
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

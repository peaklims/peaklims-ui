import {
  AutocompleteItem,
  Autocomplete as NewAutocomplete,
} from "@nextui-org/react";
import { SearchIcon } from "lucide-react";

export function Autocomplete<T>({
  items,
  renderItem,
  placeholder,
  ariaLabel,
  asSearchInput = false,
  autoFocus = false,
  selectedKey,
  onSelectionChange,
}: {
  items: Iterable<T> | undefined;
  renderItem: (item: T) => React.ReactElement<typeof AutocompleteItem>;
  placeholder: string;
  ariaLabel?: string;
  asSearchInput?: boolean;
  autoFocus?: boolean;
  selectedKey?: Key | null | undefined;
  onSelectionChange?: ((key: Key) => any) | undefined;
}) {
  return (
    <NewAutocomplete
      autoFocus={autoFocus}
      classNames={{
        base: "max-w-sm",
        listboxWrapper: "",
        selectorButton: "text-default-500",
      }}
      defaultItems={items}
      inputProps={{
        classNames: {
          input: "ml-1",
          inputWrapper:
            "h-12 rounded-md group-data-[focus=true]:border-emerald-500",
        },
      }}
      listboxProps={{
        itemClasses: {
          base: [
            "rounded-md",
            "h-10",
            "text-default-500",
            "transition-opacity",
            "data-[hover=true]:text-foreground",
            "dark:data-[hover=true]:bg-default-50",
            "data-[pressed=true]:opacity-70",
            "data-[hover=true]:bg-default-200",
            "data-[selectable=true]:focus:bg-default-100",
            "data-[focus-visible=true]:ring-primary-500",
          ],
        },
      }}
      placeholder={placeholder}
      aria-label={ariaLabel ?? placeholder}
      popoverProps={{
        offset: 4,
        classNames: {
          base: "rounded-large",
          content: "p-1 border-small border-default-100 bg-background",
        },
      }}
      startContent={
        asSearchInput && (
          <SearchIcon
            className="text-default-400"
            strokeWidth={2.5}
            size={20}
          />
        )
      }
      variant="bordered"
      selectedKey={selectedKey}
      onSelectionChange={onSelectionChange}
    >
      {(item: T) => renderItem(item)}
    </NewAutocomplete>
  );
}

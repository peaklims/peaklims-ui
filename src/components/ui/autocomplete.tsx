import { cn } from "@/lib/utils";
import { useAutoComplete } from "@wispe/wispe-react";

interface AutocompleteProps<Item, Value extends string | number = string> {
  items: Item[];
  selectedValue?: Value;
  setSelectedValue: (val: Value | undefined) => void;
  mapValue: (item: Item) => Value;
  onFilterAsync: (args: { searchTerm: string }) => Promise<Item[]>;
  onClearAsync?: () => Promise<void>;
  itemToString: (item: Item) => string;
  disabled?: boolean;
  label: string;
  asyncDebounceMs?: number;
  labelSrOnly?: boolean;
  isItemDisabled?: (item: Item) => boolean;
  placeholder?: string;
  autoFocus?: boolean;
  inputId?: string;
}

export function Autocomplete<Item, Value extends string | number = string>({
  items,
  selectedValue,
  setSelectedValue,
  mapValue,
  onFilterAsync,
  onClearAsync,
  itemToString,
  disabled = false,
  label,
  placeholder,
  autoFocus,
  isItemDisabled,
  labelSrOnly,
  asyncDebounceMs = 300,
  inputId,
}: AutocompleteProps<Item, Value>) {
  const {
    getRootProps,
    getLabelProps,
    getInputProps,
    getListProps,
    getItemProps,
    getItemState,
    getSelectedItem,
    getItems,
    getClearProps,
    hasSelectedItem,
    isOpen,
  } = useAutoComplete<Item, Value>({
    items,
    mapValue,
    state: { selectedValue, setSelectedValue, label },
    asyncDebounceMs,
    onFilterAsync,
    onClearAsync,
    isItemDisabled,
    itemToString,
    labelSrOnly,
  });

  return (
    <div className="max-w-md">
      <label {...getLabelProps()} className="block mb-1 font-medium">
        {label}
      </label>
      <div {...getRootProps()} className="relative text-sm">
        <input
          {...getInputProps()}
          id={inputId ?? getInputProps().id}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus ? true : undefined}
          className={cn(
            "w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600",
            disabled ? "bg-gray-100 cursor-not-allowed" : "border-slate-300"
          )}
        />
        {hasSelectedItem() && !disabled && (
          <button
            type="button"
            {...getClearProps()}
            onClick={async (e) => {
              getClearProps().onClick?.(e);
              await onClearAsync?.();
            }}
            className={cn(
              `absolute right-1 cursor-default bg-transparent px-1 -translate-y-1/2 top-1/2`,
              "focus:border-emerald-500 focus:text-emerald-600 focus:border-l-2 focus:outline-emerald-600",
              "hover:text-gray-600",
              "border-slate-300 text-gray-500",
              "disabled:text-slate-400 disabled:cursor-not-allowed"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={200}
              height={200}
              viewBox="0 0 24 24"
              className="w-5 h-5"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth={2}
                d="M17 17L7 7m10 0L7 17"
              />
            </svg>
          </button>
        )}

        {isOpen && (
          <ul
            {...getListProps()}
            className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-60"
          >
            {getItems().length === 0 ? (
              <li className="px-4 py-2 text-gray-500">No results found</li>
            ) : (
              getItems().map((item) => (
                <li
                  key={mapValue(item)}
                  {...getItemProps(item)}
                  className={cn(
                    `flex justify-between items-center px-2 py-1 m-1 text-sm text-gray-700 rounded-md cursor-default outline-none`,
                    "focus:text-emerald-600 focus:bg-emerald-100",
                    "hover:text-emerald-600 hover:bg-emerald-100",
                    getItemState(item).isActive &&
                      "text-emerald-600 bg-emerald-100",
                    getItemState(item).isSelected
                      ? "font-semibold text-emerald-600"
                      : "",
                    getItemState(item).isDisabled
                      ? "opacity-40 cursor-not-allowed text-slate-700"
                      : ""
                  )}
                >
                  <div className="flex items-center justify-between">
                    {itemToString(item)}
                    {getItemState(item).isSelected && (
                      // Checkmark icon
                      <svg
                        aria-hidden="true"
                        className="w-4 h-4 text-emerald-600"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.5 11.7948L8.72144 16.0163C8.86993 16.1666 9.04677 16.286 9.24172 16.3674C9.43668 16.4488 9.64586 16.4908 9.85715 16.4908C10.0685 16.4908 10.2776 16.4488 10.4726 16.3674C10.6675 16.286 10.8443 16.1666 10.9929 16.0163L19.5 7.50916"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

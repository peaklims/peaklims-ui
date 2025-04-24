import { cn } from "@/lib/utils";
import * as React from "react";

import {
  AriaListBoxOptions,
  AriaPopoverProps,
  DismissButton,
  useButton,
  useComboBox,
  useFilter,
  useListBox,
  useListBoxSection,
  useOption,
  usePopover,
} from "react-aria";
import type {
  ComboBoxStateOptions,
  ListState,
  Node,
  OverlayTriggerState,
} from "react-stately";
import { useComboBoxState } from "react-stately";

export const Combobox = React.forwardRef(function Combobox<T extends object>(
  {
    classNames,
    clearable = false,
    onClear,
    hideButton,
    menuTrigger,
    ...props
  }: {
    classNames?: {
      wrapper?: string;
      input?: string;
      button?: string;
      menuTrigger?: "focus" | "manual" | "input";
      // listBox?: string;
      // option?: string;
    };
    clearable?: boolean;
    hideButton?: boolean;
    onClear?: () => void;
  } & ComboBoxStateOptions<T>,
  ref: React.Ref<HTMLDivElement>
) {
  let { contains } = useFilter({ sensitivity: "base" });
  let state = useComboBoxState({ ...props, defaultFilter: contains });

  let buttonRef = React.useRef<HTMLButtonElement>(null);
  let inputRef = React.useRef<HTMLInputElement>(null);
  let listBoxRef = React.useRef(null);
  let popoverRef = React.useRef<HTMLDivElement>(null);

  let {
    buttonProps: triggerProps,
    inputProps,
    listBoxProps,
    labelProps,
  } = useComboBox(
    {
      ...props,
      inputRef,
      buttonRef,
      listBoxRef,
      popoverRef,
      menuTrigger,
    },
    state
  );

  let { buttonProps } = useButton(triggerProps, buttonRef);

  React.useEffect(() => {
    if (inputRef.current && popoverRef.current) {
      popoverRef.current.style.width = `${inputRef.current.offsetWidth}px`;
    }
  }, [state.isOpen, inputRef.current, popoverRef.current]);

  const handleClear = React.useCallback(() => {
    state.setSelectedKey(null);
    state.setInputValue("");
    if (onClear) {
      onClear();
    }
  }, [state, onClear]);

  return (
    <div className={cn("relative flex flex-col w-full", classNames?.wrapper)}>
      <label {...labelProps} className="sr-only">
        {props.label}
      </label>
      <div
        className={cn(
          `relative inline-flex h-8 flex-row overflow-hidden rounded-md border border-slate-300 text-sm shadow-sm placeholder:text-zinc-400`,
          "disabled:cursor-not-allowed disabled:opacity-50",
          state.isFocused
            ? "border-emerald-500 ring-emerald-500 ring-1"
            : "border-slate-300"
        )}
      >
        <input
          {...inputProps}
          ref={inputRef}
          className={cn(
            "w-full px-3 py-1 outline-none",
            "disabled:text-slate-400 disabled:cursor-not-allowed disabled:select-none",
            classNames?.input
          )}
        />
        {clearable && state.inputValue && (
          <button
            onClick={handleClear}
            disabled={props.isDisabled}
            className={cn(
              `cursor-pointer bg-transparent px-1`,
              state.isFocused
                ? "border-emerald-500 text-emerald-600 hover:text-emerald-500"
                : "text-slate-500 hover:text-slate-400",
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
        <button
          {...buttonProps}
          ref={buttonRef}
          className={cn(
            `cursor-default border-l bg-gray-100 px-1`,
            state.isFocused
              ? "border-emerald-500 text-emerald-600 border-l-2"
              : "border-slate-300 text-gray-500",
            "disabled:text-slate-400 disabled:cursor-not-allowed",
            hideButton ? "hidden" : "",
            classNames?.button
          )}
        >
          {/* Dropdown arrow icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={200}
            height={200}
            viewBox="0 0 12 12"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M6 8.825c-.2 0-.4-.1-.5-.2l-3.3-3.3c-.3-.3-.3-.8 0-1.1c.3-.3.8-.3 1.1 0l2.7 2.7l2.7-2.7c.3-.3.8-.3 1.1 0c.3.3.3.8 0 1.1l-3.2 3.2c-.2.2-.4.3-.6.3Z"
            />
          </svg>
        </button>
      </div>
      {state.isOpen && (
        <Popover
          popoverRef={popoverRef}
          triggerRef={inputRef}
          state={state}
          isNonModal
          placement="bottom start"
          // className={cn(classNames?.listBox)}
        >
          <ListBox {...listBoxProps} listBoxRef={listBoxRef} state={state} />
        </Popover>
      )}
    </div>
  );
});

interface ListBoxProps extends AriaListBoxOptions<unknown> {
  listBoxRef?: React.RefObject<HTMLUListElement>;
  state: ListState<unknown>;
}

interface SectionProps {
  section: Node<unknown>;
  state: ListState<unknown>;
}

interface OptionProps {
  item: Node<unknown>;
  state: ListState<unknown>;
}

export function ListBox(props: ListBoxProps) {
  let ref = React.useRef<HTMLUListElement>(null);
  let { listBoxRef = ref, state } = props;
  let { listBoxProps } = useListBox(props, state, listBoxRef);

  return (
    <ul
      {...listBoxProps}
      ref={listBoxRef}
      className="w-full overflow-auto outline-none max-h-72"
    >
      {[...state.collection].map((item) =>
        item.type === "section" ? (
          <ListBoxSection key={item.key} section={item} state={state} />
        ) : (
          <Option key={item.key} item={item} state={state} />
        )
      )}
    </ul>
  );
}

function ListBoxSection({ section, state }: SectionProps) {
  let { itemProps, headingProps, groupProps } = useListBoxSection({
    heading: section.rendered,
    "aria-label": section["aria-label"],
  });

  return (
    <>
      <li {...itemProps} className="pt-2">
        {section.rendered && (
          <span
            {...headingProps}
            className="mx-3 text-xs font-bold text-gray-500 uppercase"
          >
            {section.rendered}
          </span>
        )}
        <ul {...groupProps}>
          {[...section.childNodes].map((node) => (
            <Option key={node.key} item={node} state={state} />
          ))}
        </ul>
      </li>
    </>
  );
}

function Option({ item, state }: OptionProps) {
  let ref = React.useRef<HTMLLIElement>(null);
  let { optionProps, isDisabled, isSelected, isFocused } = useOption(
    {
      key: item.key,
    },
    state,
    ref
  );

  return (
    <li
      {...optionProps}
      ref={ref}
      className={cn(
        `flex justify-between items-center px-2 py-1 m-1 text-sm text-gray-700 rounded-md cursor-default outline-none`,
        isFocused ? "text-emerald-600 bg-emerald-100" : "",
        isSelected ? "font-semibold text-emerald-600" : "",
        isDisabled ? "opacity-40 cursor-not-allowed text-slate-700" : ""
      )}
    >
      {item.rendered}
      {isSelected && (
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
    </li>
  );
}

interface PopoverProps extends Omit<AriaPopoverProps, "popoverRef"> {
  children: React.ReactNode;
  state: OverlayTriggerState;
  className?: string;
  popoverRef?: React.RefObject<HTMLDivElement>;
}

export function Popover(props: PopoverProps) {
  let ref = React.useRef<HTMLDivElement>(null);
  let { popoverRef = ref, state, children, className, isNonModal } = props;

  let { popoverProps, underlayProps } = usePopover(
    {
      ...props,
      popoverRef,
    },
    state
  );

  return (
    <>
      {!isNonModal && <div {...underlayProps} className="fixed inset-0" />}
      <div
        {...popoverProps}
        ref={popoverRef}
        className={`z-500 mt-2 rounded-md border border-gray-300 bg-white shadow-lg ${className}`}
      >
        {!isNonModal && <DismissButton onDismiss={state.close} />}
        {children}
        <DismissButton onDismiss={state.close} />
      </div>
    </>
  );
}

export const getLabelById = ({
  id,
  data,
}: {
  id: string;
  data: { value: string; label: string }[];
}) => {
  const item = data?.find((x) => x.value === id);
  return item ? item.label : "";
};

import { Calendar as CalendarIcon } from "@/components/svgs";
import {
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
  getLocalTimeZone,
  isSameMonth,
  today,
} from "@internationalized/date";
import { isFuture, isToday as isTodayFns } from "date-fns";

import {
  createCalendar,
  endOfMonth,
  getWeeksInMonth,
} from "@internationalized/date";
import {
  useCalendar,
  useCalendarCell,
  useCalendarGrid,
} from "@react-aria/calendar";
import { useFocusRing } from "@react-aria/focus";
import { useLocale } from "@react-aria/i18n";
import { mergeProps } from "@react-aria/utils";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { useDateFormatter } from "@react-aria/i18n";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useCalendarState } from "@react-stately/calendar";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { Button } from "react-aria-components";

import React from "react";
import type { DateValue, PopoverProps } from "react-aria-components";
import {
  DateInput,
  DatePicker,
  DatePickerStateContext,
  DateSegment,
  Group,
  Label,
  Popover,
} from "react-aria-components";

export function RichDatePicker({
  minValue,
  maxValue,
  value,
  onChange,
  srLabel,
  ...props
}: {
  minValue?: DateValue | undefined | "today";
  maxValue?: DateValue | undefined | "today";
  value: CalendarDate | CalendarDateTime | ZonedDateTime | null | undefined;
  srLabel?: string;
  onChange: (
    value: CalendarDate | CalendarDateTime | ZonedDateTime | null | undefined
  ) => void;
}) {
  let { locale } = useLocale();

  const derivedMaxValue =
    maxValue === "today" ? today(getLocalTimeZone()) : maxValue;
  const derivedMinValue =
    minValue === "today" ? today(getLocalTimeZone()) : minValue;
  let state = useCalendarState({
    ...props,
    value,
    onChange,
    maxValue: derivedMaxValue,
    minValue: derivedMinValue,
    visibleDuration: { months: 1 },
    locale,
    createCalendar,
  });

  let ref = useRef<HTMLDivElement>(null);
  let { calendarProps, prevButtonProps, nextButtonProps } = useCalendar(
    props,
    state
  );

  const [isOpen, setIsOpen] = useState(false);

  return (
    <DatePicker
      className="flex flex-col w-full gap-1 text-sm bg-transparent border rounded-md group border-slate-300 ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      value={value}
      onChange={onChange}
      placeholderValue={today(getLocalTimeZone())}
    >
      <Label className="text-white cursor-default sr-only">
        {srLabel ?? "Date"}
      </Label>
      <Group className="flex pl-3 transition rounded-lg text-slate-700 bg-white/90 focus-within:bg-white group-open:bg-white focus-visible:ring-2 ring-black">
        <DateInput className="flex flex-1 py-1.5 h-8 text-sm">
          {(segment) => (
            <DateSegment
              segment={segment}
              className="px-0.5 tabular-nums outline-none rounded-sm focus:bg-emerald-700 focus:text-white caret-transparent data-[placeholder]:italic"
            />
          )}
        </DateInput>
        {value && (
          <div className="flex items-center mr-1">
            <DatePickerClearButton />
          </div>
        )}
        <Button
          onPress={() => setIsOpen(!isOpen)}
          className="flex items-center px-2 transition bg-transparent rounded-r-lg outline-none text-slate-700 border-l-emerald-200 pressed:bg-emerald-100 focus-visible:ring-2 ring-emerald-600"
        >
          <CalendarIcon />
        </Button>
      </Group>
      <DatePickerPopover isOpen={isOpen} onOpenChange={setIsOpen}>
        <div
          {...calendarProps}
          ref={ref}
          // @ts-ignore
          minValue={derivedMinValue}
          maxValue={derivedMaxValue}
          className="px-4 py-2 text-slate-600"
        >
          <CalendarHeader
            state={state}
            calendarProps={calendarProps}
            prevButtonProps={prevButtonProps}
            nextButtonProps={nextButtonProps}
            moveForwardAYear={() =>
              state.setFocusedDate(state.focusedDate.add({ years: 1 }))
            }
            moveBackAYear={() =>
              state.setFocusedDate(state.focusedDate.add({ years: -1 }))
            }
            maxValue={derivedMaxValue}
            minValue={derivedMinValue}
          />
          <div className="flex gap-8">
            <CalendarGrid state={state} setIsOpen={setIsOpen} />
          </div>
          <div className="flex items-center justify-center px-3 py-2">
            <Button
              onPress={() => {
                state.setFocusedDate(today(getLocalTimeZone()));
                state.setValue(today(getLocalTimeZone()));
              }}
              className={cn(
                "text-sm border-0 rounded outline-none text-emerald-600 focus-visible:ring-2 ring-emerald-600 ring-offset-1"
              )}
            >
              Today
            </Button>
          </div>
        </div>
      </DatePickerPopover>
    </DatePicker>
  );
}
export function toCalendarDate(date: Date) {
  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
}

function DatePickerClearButton() {
  let state = React.useContext(DatePickerStateContext)!;
  return (
    <Button
      // Don't inherit default Button behavior from DatePicker.
      slot={null}
      aria-label="Clear"
      onPress={() => state.setValue(null)}
    >
      {/* https://iconbuddy.com/akar-icons/circle-x */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={200}
        height={200}
        viewBox="0 0 24 24"
        className="w-4 h-4"
        aria-hidden="true"
      >
        <g fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" d="M15 15L9 9m6 0l-6 6" />
          <circle cx={12} cy={12} r={10} />
        </g>
      </svg>
    </Button>
  );
}

/**
 * Checks if a given date is in the future.
 *
 * @param {Date | number} date - The date to check.
 * @returns {boolean} - True if the date is in the future, otherwise false.
 */
const isDateInTheFuture = (date: CalendarDate) => {
  const response = isFuture(toJSDate(date));
  return response;
};

function isToday(date: CalendarDate) {
  const jsDate = toJSDate(date);
  return isTodayFns(jsDate);
}

// Convert CalendarDate to a JavaScript Date object
function toJSDate(date: CalendarDate) {
  return new Date(date.year, date.month - 1, date.day);
}

function DatePickerPopover(props: PopoverProps) {
  return (
    <Popover
      {...props}
      className={({ isEntering, isExiting }) => `
        overflow-auto rounded-lg drop-shadow-lg ring-1 ring-black/10 bg-white
        ${
          isEntering
            ? "animate-in fade-in placement-bottom:slide-in-from-top-1 placement-top:slide-in-from-bottom-1 ease-out duration-200"
            : ""
        }
        ${
          isExiting
            ? "animate-out fade-out placement-bottom:slide-out-to-top-1 placement-top:slide-out-to-bottom-1 ease-in duration-150"
            : ""
        }
      `}
    />
  );
}

export function CalendarHeader({
  state,
  calendarProps,
  prevButtonProps,
  nextButtonProps,
  moveForwardAYear,
  moveBackAYear,
  maxValue,
  minValue,
}: {
  state: ReturnType<typeof useCalendarState>;
  calendarProps: any;
  prevButtonProps: any;
  nextButtonProps: any;
  moveForwardAYear: () => void;
  moveBackAYear: () => void;
  maxValue: DateValue | undefined;
  minValue: DateValue | undefined;
}) {
  // let monthDateFormatter = useDateFormatter({
  //   month: "long",
  //   year: "numeric",
  //   timeZone: state.timeZone,
  // });

  // const enableNextButtons =
  //   state.focusedDate.month === today(getLocalTimeZone()).month &&
  //   maxValue > today(getLocalTimeZone());
  const nextButtonWouldBeInFuture = isDateInTheFuture(
    state.focusedDate.add({ months: 1 })
  );
  const enableNextButtons = !nextButtonWouldBeInFuture;

  return (
    <div className="flex items-center w-full py-4">
      {/* Add a screen reader only description of the entire visible range rather than
       * a separate heading above each month grid. This is placed first in the DOM order
       * so that it is the first thing a touch screen reader user encounters.
       * In addition, VoiceOver on iOS does not announce the aria-label of the grid
       * elements, so the aria-label of the Calendar is included here as well. */}
      <VisuallyHidden>
        <h2>{calendarProps["aria-label"]}</h2>
      </VisuallyHidden>
      <Button
        aria-label="Move back a year"
        className={
          "focus-visible:ring-2 ring-emerald-600 ring-offset-1 border-0 outline-none rounded"
        }
        onPress={() => moveBackAYear()}
      >
        <ChevronsLeftIcon className="w-5 h-5" />
      </Button>
      <Button
        {...prevButtonProps}
        className={
          "focus-visible:ring-2 ring-emerald-600 ring-offset-1 border-0 outline-none rounded"
        }
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </Button>
      {/* <h2
        // We have a visually hidden heading describing the entire visible range,
        // and the calendar itself describes the individual month
        // so we don't need to repeat that here for screen reader users.
        aria-hidden
        className="flex-1 text-xl font-bold text-center align-center"
      >
        {monthDateFormatter.format(
          state.visibleRange.start.toDate(state.timeZone)
        )}
      </h2> */}
      <div className={"flex items-center w-full justify-center space-x-4 px-2"}>
        <MonthDropdown state={state} />
        <YearDropdown state={state} maxValue={maxValue} minValue={minValue} />
      </div>
      <Button
        {...nextButtonProps}
        className={cn(
          "focus-visible:ring-2 ring-emerald-600 ring-offset-1 border-0 outline-none rounded",
          enableNextButtons
            ? "cursor-pointer"
            : "cursor-not-allowed text-slate-300"
        )}
      >
        <ChevronRightIcon className="w-5 h-5" />
      </Button>
      <Button
        className={cn(
          "focus-visible:ring-2 ring-emerald-600 ring-offset-1 border-0 outline-none rounded",
          enableNextButtons
            ? "cursor-pointer"
            : "cursor-not-allowed text-slate-300"
        )}
        aria-label="Move forward a year"
        onPress={() => moveForwardAYear()}
      >
        <ChevronsRightIcon className="w-5 h-5" />
      </Button>
    </div>
  );
}

function MonthDropdown({
  state,
}: {
  state: ReturnType<typeof useCalendarState>;
}) {
  let months = [];
  let formatter = useDateFormatter({
    month: "long",
    timeZone: state.timeZone,
  });

  // Format the name of each month in the year according to the
  // current locale and calendar system. Note that in some calendar
  // systems, such as the Hebrew, the number of months may differ
  // between years.
  let numMonths = state.focusedDate.calendar.getMonthsInYear(state.focusedDate);
  for (let i = 1; i <= numMonths; i++) {
    let date = state.focusedDate.set({ month: i });
    months.push(formatter.format(date.toDate(state.timeZone)));
  }

  let onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let value = Number(e.target.value);
    let date = state.focusedDate.set({ month: value });
    state.setFocusedDate(date);
  };

  return (
    <select
      aria-label="Month"
      onChange={onChange}
      value={state.focusedDate.month}
      className={
        "focus-visible:ring-2 ring-emerald-600 ring-offset-2 border-0 outline-none rounded"
      }
    >
      {months.map((month, i) => (
        <option key={i} value={i + 1}>
          {month}
        </option>
      ))}
    </select>
  );
}

function YearDropdown({
  state,
  maxValue,
  minValue,
}: {
  state: ReturnType<typeof useCalendarState>;
  maxValue: DateValue | undefined;
  minValue: DateValue | undefined;
}) {
  let years = [];
  let formatter = useDateFormatter({
    year: "numeric",
    timeZone: state.timeZone,
  });

  const timeWindow = 115;
  // Format timeWindow years on each side of the current year according
  // to the current locale and calendar system.
  for (let i = -timeWindow; i <= timeWindow; i++) {
    let date = state.focusedDate.add({ years: i });
    if (minValue && date < minValue) {
      continue;
    }
    if (maxValue && date > maxValue) {
      continue;
    }
    years.push({
      value: date,
      formatted: formatter.format(date.toDate(state.timeZone)),
    });
  }

  let onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let index = Number(e.target.value);
    let date = years[index].value;
    state.setFocusedDate(date);
  };

  return (
    <select
      aria-label="Year"
      onChange={onChange}
      value={timeWindow}
      className={
        "focus-visible:ring-2 ring-emerald-600 ring-offset-2 border-0 outline-none rounded"
      }
    >
      {years.map((year, i) => (
        // use the index as the value so we can retrieve the full
        // date object from the list in onChange. We cannot only
        // store the year number, because in some calendars, such
        // as the Japanese, the era may also change.
        <option key={i} value={i}>
          {year.formatted}
        </option>
      ))}
    </select>
  );
}

export function CalendarGrid({
  state,
  setIsOpen,
  offset = {},
}: {
  state: ReturnType<typeof useCalendarState>;
  setIsOpen: (isOpen: boolean) => void;
  offset?: { months?: number; years?: number };
}) {
  let { locale } = useLocale();
  let startDate = state.visibleRange.start.add(offset);
  let endDate = endOfMonth(startDate);
  let { gridProps, headerProps, weekDays } = useCalendarGrid(
    {
      startDate,
      endDate,
    },
    state
  );

  // Get the number of weeks in the month so we can render the proper number of rows.
  let weeksInMonth = getWeeksInMonth(startDate, locale);

  return (
    <table {...gridProps} cellPadding="0" className="flex-1">
      <thead {...headerProps} className="text-gray-600">
        <tr>
          {weekDays.map((day, index) => (
            <th key={index} className="text-xs font-semibold text-slate-500">
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex, startDate)
              .map((date, i) =>
                date ? (
                  <CalendarCell
                    key={i}
                    state={state}
                    date={date}
                    currentMonth={startDate}
                    onClick={() => setIsOpen(false)}
                  />
                ) : (
                  <td key={i} />
                )
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function getDateControlValue(value: Date | undefined | null) {
  if (value === undefined || value === null) return undefined;

  const year = value.getFullYear();
  const month = value.getMonth();
  const day = value.getDate();

  return new CalendarDate(year, month, day);
}

export function getDateControlOnChangeValue(value: DateValue) {
  if (value === undefined || value === null) return undefined;

  return new Date(value.year, value.month, value.day);
}

export function CalendarCell({
  state,
  date,
  currentMonth,
  onClick,
}: {
  state: ReturnType<typeof useCalendarState>;
  date: CalendarDate;
  currentMonth: CalendarDate;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isOutsideMonth = !isSameMonth(currentMonth, date);
  const { cellProps, buttonProps, isSelected, isDisabled, formattedDate } =
    useCalendarCell({ date }, state, ref);

  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <td
      {...cellProps}
      className={`py-0.5 relative ${isFocusVisible ? "z-10" : "z-0"}`}
    >
      <div
        {...mergeProps(buttonProps, focusProps)}
        onClick={(e) => {
          if (buttonProps?.onClick !== undefined) buttonProps.onClick(e);

          if (onClick !== undefined) onClick();
        }}
        ref={ref}
        data-today={isToday(date) ? true : undefined}
        className={cn(
          "flex items-center justify-center rounded-full outline-none cursor-default w-9 h-9 hover:bg-slate-100 focus-visible:ring ring-emerald-600/70 ring-offset-2",
          "data-[outside-month]:text-slate-300",
          "data-[pressed]:bg-slate-200 ",
          "data-[today]:bg-emerald-200 data-[today]:text-emerald-800",
          "data-[selected]:bg-emerald-700 data-[selected]:text-white data-[selected]:ring-2 data-[selected]:ring-emerald-700",
          "data-[hovered]:bg-emerald-500 data-[hovered]:text-emerald-100",
          "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
          "data-[unavailable]:cursor-not-allowed data-[unavailable]:opacity-50 data-[unavailable]:data-[hovered]:bg-white"
        )}
      >
        <div
          className={cn(
            "w-full h-full rounded-full flex items-center justify-center cursor-default",
            {
              "text-gray-400": isDisabled,
              // Focus ring, visible while the cell has keyboard focus.
              "ring-2 group-focus:z-2 ring-emerald-600 ring-offset-2":
                isFocusVisible,
              // Hover state for non-selected cells.
              "hover:bg-emerald-100": !isSelected && !isDisabled,
            },
            isOutsideMonth ? "text-slate-400" : ""
          )}
        >
          {formattedDate}
        </div>
      </div>
    </td>
  );
}

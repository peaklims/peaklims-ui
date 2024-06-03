import { CalendarDate, isSameDay, isSameMonth } from "@internationalized/date";
import { useCalendarCell } from "@react-aria/calendar";
import { useFocusRing } from "@react-aria/focus";
import { useLocale } from "@react-aria/i18n";
import { mergeProps } from "@react-aria/utils";
import { useRef } from "react";

import { cn } from "@/lib/utils";
import {
  createCalendar,
  endOfMonth,
  getWeeksInMonth,
} from "@internationalized/date";
import { useCalendar, useCalendarGrid } from "@react-aria/calendar";
import { useDateFormatter } from "@react-aria/i18n";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import { useCalendarState } from "@react-stately/calendar";
import { isFuture, isToday as isTodayFns } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "react-aria-components";

export function BaseCalendar(props) {
  let { locale } = useLocale();
  let state = useCalendarState({
    ...props,
    visibleDuration: { months: 2 },
    locale,
    createCalendar,
  });

  let ref = useRef();
  let { calendarProps, prevButtonProps, nextButtonProps } = useCalendar(
    props,
    state,
    ref
  );

  return (
    <div {...calendarProps} ref={ref} className="inline-block text-gray-800">
      <CalendarHeader
        state={state}
        calendarProps={calendarProps}
        prevButtonProps={prevButtonProps}
        nextButtonProps={nextButtonProps}
      />
      <div className="flex gap-8">
        <CalendarGrid state={state} />
        <CalendarGrid state={state} offset={{ months: 1 }} />
      </div>
    </div>
  );
}

/**
 * Checks if a given date is in the future.
 *
 * @param {Date | number} date - The date to check.
 * @returns {boolean} - True if the date is in the future, otherwise false.
 */
const isDateInTheFuture = (date) => {
  const response = isFuture(toJSDate(date));
  return response;
};

function isToday(date) {
  const jsDate = toJSDate(date);
  return isTodayFns(jsDate);
}

// Convert CalendarDate to a JavaScript Date object
function toJSDate(date: CalendarDate) {
  return new Date(date.year, date.month - 1, date.day);
}

export function NewCalendarHeader({
  state,
  calendarProps,
  prevButtonProps,
  nextButtonProps,
}) {
  let monthDateFormatter = useDateFormatter({
    month: "long",
    year: "numeric",
    timeZone: state.timeZone,
  });

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
      <Button {...prevButtonProps}>
        <ChevronLeftIcon className="w-6 h-6" />
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
      <div className={"flex items-center w-full justify-center space-x-4"}>
        <MonthDropdown state={state} />
        <YearDropdown state={state} />
      </div>
      <Button {...nextButtonProps}>
        <ChevronRightIcon className="w-6 h-6" />
      </Button>
    </div>
  );
}

function MonthDropdown({ state }) {
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

  let onChange = (e) => {
    let value = Number(e.target.value);
    let date = state.focusedDate.set({ month: value });
    state.setFocusedDate(date);
  };

  return (
    <select
      aria-label="Month"
      onChange={onChange}
      value={state.focusedDate.month}
      className={""}
    >
      {months.map((month, i) => (
        <option key={i} value={i}>
          {month}
        </option>
      ))}
    </select>
  );
}

function YearDropdown({ state }) {
  let years = [];
  let formatter = useDateFormatter({
    year: "numeric",
    timeZone: state.timeZone,
  });

  // Format 20 years on each side of the current year according
  // to the current locale and calendar system.
  for (let i = -20; i <= 20; i++) {
    let date = state.focusedDate.add({ years: i });
    years.push({
      value: date,
      formatted: formatter.format(date.toDate(state.timeZone)),
    });
  }

  let onChange = (e) => {
    let index = Number(e.target.value);
    let date = years[index].value;
    state.setFocusedDate(date);
  };

  return (
    <select aria-label="Year" onChange={onChange} value={20} className={""}>
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

export function CalendarHeader({
  state,
  calendarProps,
  prevButtonProps,
  nextButtonProps,
}) {
  let monthDateFormatter = useDateFormatter({
    month: "long",
    year: "numeric",
    timeZone: state.timeZone,
  });

  return (
    <div className="flex items-center py-4">
      {/* Add a screen reader only description of the entire visible range rather than
       * a separate heading above each month grid. This is placed first in the DOM order
       * so that it is the first thing a touch screen reader user encounters.
       * In addition, VoiceOver on iOS does not announce the aria-label of the grid
       * elements, so the aria-label of the Calendar is included here as well. */}
      <VisuallyHidden>
        <h2>{calendarProps["aria-label"]}</h2>
      </VisuallyHidden>
      <Button {...prevButtonProps}>
        <ChevronLeftIcon className="w-6 h-6" />
      </Button>
      <h2
        // We have a visually hidden heading describing the entire visible range,
        // and the calendar itself describes the individual month
        // so we don't need to repeat that here for screen reader users.
        aria-hidden
        className="flex-1 text-xl font-bold text-center align-center"
      >
        {monthDateFormatter.format(
          state.visibleRange.start.toDate(state.timeZone)
        )}
      </h2>
      <h2
        aria-hidden
        className="flex-1 text-xl font-bold text-center align-center"
      >
        {monthDateFormatter.format(
          state.visibleRange.start.add({ months: 1 }).toDate(state.timeZone)
        )}
      </h2>
      <Button {...nextButtonProps}>
        <ChevronRightIcon className="w-6 h-6" />
      </Button>
    </div>
  );
}

export function CalendarCell({ state, date, currentMonth }) {
  const ref = useRef();
  const isOutsideMonth = !isSameMonth(currentMonth, date);
  const { cellProps, buttonProps, isSelected, isDisabled, formattedDate } =
    useCalendarCell({ date }, state, ref);

  // The start and end date of the selected range will have
  // an emphasized appearance.
  const isSelectionStart = state.highlightedRange
    ? isSameDay(date, state.highlightedRange.start)
    : isSelected;
  const isSelectionEnd = state.highlightedRange
    ? isSameDay(date, state.highlightedRange.end)
    : isSelected;
  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <td
      {...cellProps}
      className={`py-0.5 relative ${isFocusVisible ? "z-10" : "z-0"}`}
    >
      <div
        {...mergeProps(buttonProps, focusProps)}
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
              // Darker selection background for the start and end.
              "bg-emerald-600 text-white hover:bg-emerald-700":
                isSelectionStart || isSelectionEnd,
              // Hover state for cells in the middle of the range.
              "hover:bg-emerald-400":
                isSelected && !(isSelectionStart || isSelectionEnd),
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

export function CalendarGrid({ state, offset = {} }) {
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

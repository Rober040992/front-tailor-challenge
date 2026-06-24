import {
  getCalendarCells,
  getMonthLabel,
  WEEKDAYS,
} from "../lib/calendar";

type AvailabilityCalendarProps = {
  onDateSelect: (date: string) => void;
  onNextMonth: () => void;
  onPreviousMonth: () => void;
  selectedDate: string | null;
  selectedMonth: number;
  selectedYear: number;
};

export function AvailabilityCalendar({
  onDateSelect,
  onNextMonth,
  onPreviousMonth,
  selectedDate,
  selectedMonth,
  selectedYear,
}: AvailabilityCalendarProps) {
  const calendarCells = getCalendarCells(selectedYear, selectedMonth);

  return (
    <section aria-labelledby="calendar-heading">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold" id="calendar-heading">
          {getMonthLabel(selectedYear, selectedMonth)}
        </h2>
        <div className="flex gap-2">
          <button
            aria-label="Previous month"
            className="inline-flex size-11 items-center justify-center rounded-full border border-tailor-border text-lg font-bold transition hover:border-tailor-blue hover:text-tailor-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tailor-blue"
            onClick={onPreviousMonth}
            type="button"
          >
            &lt;
          </button>
          <button
            aria-label="Next month"
            className="inline-flex size-11 items-center justify-center rounded-full border border-tailor-border text-lg font-bold transition hover:border-tailor-blue hover:text-tailor-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tailor-blue"
            onClick={onNextMonth}
            type="button"
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {WEEKDAYS.map((weekday) => (
          <div
            className="py-2 text-xs font-bold uppercase tracking-widest text-tailor-muted"
            key={weekday}
          >
            {weekday}
          </div>
        ))}

        {calendarCells.map((cell, index) =>
          cell ? (
            <button
              aria-pressed={selectedDate === cell.date}
              className={[
                "aspect-square rounded-tailor-sm border text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tailor-blue sm:text-base",
                selectedDate === cell.date
                  ? "border-tailor-blue bg-tailor-blue text-tailor-white"
                  : "border-tailor-border bg-tailor-surface text-tailor-white hover:border-tailor-blue hover:text-tailor-blue",
              ].join(" ")}
              key={cell.date}
              onClick={() => onDateSelect(cell.date)}
              type="button"
            >
              {cell.day}
            </button>
          ) : (
            <div aria-hidden="true" key={`empty-${index}`} />
          ),
        )}
      </div>
    </section>
  );
}

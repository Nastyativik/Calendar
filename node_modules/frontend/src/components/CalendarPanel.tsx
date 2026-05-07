import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { buildMonthDays, formatMonthLabel, getWeekdayLabels, isSameMonth } from '../lib/date';

interface CalendarPanelProps {
  currentMonth: Date;
  eventDates: Set<string>;
  selectedDate: string | null;
  onMonthChange: (direction: -1 | 1) => void;
  onSelectDate: (isoDate: string) => void;
  onSelectMonth: (monthDate: Date) => void;
}

const weekdayLabels = getWeekdayLabels();

export function CalendarPanel({
  currentMonth,
  eventDates,
  selectedDate,
  onMonthChange,
  onSelectDate,
  onSelectMonth,
}: CalendarPanelProps) {
  const days = buildMonthDays(currentMonth);

  return (
    <section className="panel-surface animate-soft-pop overflow-hidden px-4 pb-5 pt-6 sm:px-5 sm:pb-6 lg:px-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onMonthChange(-1)}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/16 text-white transition duration-300 ease-out hover:-translate-x-1 hover:bg-white/26 focus:outline-none focus:ring-2 focus:ring-white/70"
          aria-label="Предыдущий месяц"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>

        <div className="min-w-0 flex-1 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-white/70">Навигация</p>
          <h2 className="mt-1 truncate text-3xl font-semibold capitalize text-white">
            {formatMonthLabel(currentMonth)}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => onMonthChange(1)}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/16 text-white transition duration-300 ease-out hover:translate-x-1 hover:bg-white/26 focus:outline-none focus:ring-2 focus:ring-white/70"
          aria-label="Следующий месяц"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="mb-3 grid grid-cols-7 gap-2 text-center text-xs uppercase tracking-[0.2em] text-white/70 sm:gap-2.5">
        {weekdayLabels.map((label) => (
          <span key={label} className="py-1">
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 sm:gap-2.5">
        {days.map((day) => {
          const hasEvent = eventDates.has(day.iso);
          const isSelected = selectedDate === day.iso;

          return (
            <button
              key={day.iso}
              type="button"
              onClick={() => {
                if (!isSameMonth(day.date, currentMonth)) {
                  onSelectMonth(new Date(day.date.getFullYear(), day.date.getMonth(), 1));
                }

                onSelectDate(day.iso);
              }}
              className={`group relative min-h-[54px] rounded-[18px] border transition duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.02] sm:min-h-[58px] ${
                isSelected
                  ? 'border-white bg-white text-[#5b88a3] shadow-[0_10px_25px_-18px_rgba(255,255,255,0.95)]'
                  : day.inCurrentMonth
                    ? 'border-white/20 bg-[#8fc0df] text-white hover:bg-[#9ccbe7]'
                    : 'border-transparent bg-white/10 text-white/40 hover:bg-white/15'
              }`}
            >
              <span className="absolute left-2 top-2 text-sm font-medium">{day.dayNumber}</span>
              {day.isToday ? (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#fff7d2]" />
              ) : null}
              {hasEvent ? (
                <span
                  className={`absolute bottom-2 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full ${
                    isSelected ? 'bg-[#7ab8dc]' : 'bg-white'
                  }`}
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}

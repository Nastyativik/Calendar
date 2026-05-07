const monthFormatter = new Intl.DateTimeFormat('ru-RU', {
  month: 'long',
  year: 'numeric',
});

const cardMonthFormatter = new Intl.DateTimeFormat('ru-RU', {
  month: 'long',
});

const fullDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const weekdayFormatter = new Intl.DateTimeFormat('ru-RU', {
  weekday: 'short',
});

export interface CalendarDay {
  iso: string;
  date: Date;
  dayNumber: number;
  inCurrentMonth: boolean;
  isToday: boolean;
}

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function parseISODate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function isSameMonth(left: Date, right: Date): boolean {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();
}

export function formatMonthLabel(date: Date): string {
  return monthFormatter.format(date);
}

export function formatFullDateLabel(date: Date): string {
  return fullDateFormatter.format(date);
}

export function formatCardDate(isoDate: string) {
  const date = parseISODate(isoDate);

  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: cardMonthFormatter.format(date),
    year: date.getFullYear(),
  };
}

export function buildMonthDays(monthDate: Date): CalendarDay[] {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - firstWeekday);
  const today = toISODate(new Date());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);

    return {
      iso: toISODate(date),
      date,
      dayNumber: date.getDate(),
      inCurrentMonth: isSameMonth(date, monthDate),
      isToday: toISODate(date) === today,
    };
  });
}

export function getWeekdayLabels() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(2024, 0, index + 1);
    const label = weekdayFormatter.format(date).replace('.', '');
    return label.slice(0, 2);
  });
}

import type { CalendarEvent, EventSort, EventStatus } from '../types/event';

const eventStatusOrder: Record<EventStatus, number> = {
  planned: 0,
  'in-progress': 1,
  completed: 2,
};

export const eventStatusLabels: Record<EventStatus, string> = {
  planned: 'Запланировано',
  'in-progress': 'В процессе',
  completed: 'Завершено',
};

export const eventStatusOptions: Array<{ value: EventStatus; label: string }> = [
  { value: 'planned', label: eventStatusLabels.planned },
  { value: 'in-progress', label: eventStatusLabels['in-progress'] },
  { value: 'completed', label: eventStatusLabels.completed },
];

export const eventSortOptions: Array<{ value: EventSort; label: string }> = [
  { value: 'date-asc', label: 'Сначала ближайшие' },
  { value: 'date-desc', label: 'Сначала поздние' },
  { value: 'status', label: 'По статусу' },
  { value: 'title', label: 'По названию' },
];

export function isEventStatus(value: unknown): value is EventStatus {
  return value === 'planned' || value === 'in-progress' || value === 'completed';
}

export function normalizeEventTime(value: string) {
  const trimmed = value.trim();

  if (/^([01]\d|2[0-3]):[0-5]\d$/.test(trimmed)) {
    return trimmed;
  }

  return '';
}

export function getEventStatusLabel(status: EventStatus) {
  return eventStatusLabels[status];
}

export function formatEventTime(time: string) {
  return time || 'Без времени';
}

function compareEventTimesAscending(leftTime: string, rightTime: string) {
  if (leftTime && rightTime) {
    return leftTime.localeCompare(rightTime);
  }

  if (leftTime) {
    return -1;
  }

  if (rightTime) {
    return 1;
  }

  return 0;
}

function compareEventTimesDescending(leftTime: string, rightTime: string) {
  if (leftTime && rightTime) {
    return rightTime.localeCompare(leftTime);
  }

  if (leftTime) {
    return -1;
  }

  if (rightTime) {
    return 1;
  }

  return 0;
}

export function compareEventsByDateTime(left: CalendarEvent, right: CalendarEvent) {
  if (left.date !== right.date) {
    return left.date.localeCompare(right.date);
  }

  const timeComparison = compareEventTimesAscending(left.time, right.time);
  if (timeComparison !== 0) {
    return timeComparison;
  }

  return left.createdAt.localeCompare(right.createdAt);
}

function compareEventsByDateTimeDescending(left: CalendarEvent, right: CalendarEvent) {
  if (left.date !== right.date) {
    return right.date.localeCompare(left.date);
  }

  const timeComparison = compareEventTimesDescending(left.time, right.time);
  if (timeComparison !== 0) {
    return timeComparison;
  }

  return right.createdAt.localeCompare(left.createdAt);
}

export function sortEvents(events: CalendarEvent[], sort: EventSort) {
  const nextEvents = [...events];

  switch (sort) {
    case 'date-desc':
      return nextEvents.sort(compareEventsByDateTimeDescending);
    case 'status':
      return nextEvents.sort((left, right) => {
        const statusComparison = eventStatusOrder[left.status] - eventStatusOrder[right.status];
        if (statusComparison !== 0) {
          return statusComparison;
        }

        return compareEventsByDateTime(left, right);
      });
    case 'title':
      return nextEvents.sort((left, right) => {
        const titleComparison = left.title.localeCompare(right.title, 'ru-RU', {
          sensitivity: 'base',
        });
        if (titleComparison !== 0) {
          return titleComparison;
        }

        return compareEventsByDateTime(left, right);
      });
    case 'date-asc':
    default:
      return nextEvents.sort(compareEventsByDateTime);
  }
}

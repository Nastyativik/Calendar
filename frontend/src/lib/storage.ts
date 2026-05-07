import { compareEventsByDateTime, isEventStatus, normalizeEventTime } from './events';
import type { CalendarEvent, EventDraft } from '../types/event';

const STORAGE_KEY = 'event-calendar.events';

function sortStoredEvents(events: CalendarEvent[]) {
  return [...events].sort(compareEventsByDateTime);
}

function createEventId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeDraft(draft: EventDraft): EventDraft {
  return {
    title: draft.title.trim(),
    description: draft.description.trim(),
    date: draft.date,
    time: normalizeEventTime(draft.time),
    status: draft.status,
  };
}

function isStoredEventCandidate(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toStoredEvent(value: unknown): CalendarEvent | null {
  if (!isStoredEventCandidate(value)) {
    return null;
  }

  const { id, title, description, date, createdAt, updatedAt, time, status } = value;

  if (
    typeof id !== 'string' ||
    typeof title !== 'string' ||
    typeof description !== 'string' ||
    typeof date !== 'string' ||
    typeof createdAt !== 'string' ||
    typeof updatedAt !== 'string'
  ) {
    return null;
  }

  return {
    id,
    title,
    description,
    date,
    time: typeof time === 'string' ? normalizeEventTime(time) : '',
    status: isEventStatus(status) ? status : 'planned',
    createdAt,
    updatedAt,
  };
}

export function readStoredEvents(): CalendarEvent[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    const safeEvents = parsed
      .map((event) => toStoredEvent(event))
      .filter((event): event is CalendarEvent => event !== null);

    return sortStoredEvents(safeEvents);
  } catch {
    return [];
  }
}

export function writeStoredEvents(events: CalendarEvent[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sortStoredEvents(events)));
}

export function createStoredEvent(
  currentEvents: CalendarEvent[],
  draft: EventDraft,
): CalendarEvent[] {
  const normalized = normalizeDraft(draft);
  const timestamp = new Date().toISOString();

  const nextEvent: CalendarEvent = {
    id: createEventId(),
    title: normalized.title,
    description: normalized.description,
    date: normalized.date,
    time: normalized.time,
    status: normalized.status,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  return sortStoredEvents([...currentEvents, nextEvent]);
}

export function updateStoredEvent(
  currentEvents: CalendarEvent[],
  eventId: string,
  draft: EventDraft,
): CalendarEvent[] {
  const normalized = normalizeDraft(draft);

  return sortStoredEvents(
    currentEvents.map((event) =>
      event.id === eventId
        ? {
            ...event,
            title: normalized.title,
            description: normalized.description,
            date: normalized.date,
            time: normalized.time,
            status: normalized.status,
            updatedAt: new Date().toISOString(),
          }
        : event,
    ),
  );
}

export function deleteEventById(currentEvents: CalendarEvent[], eventId: string): CalendarEvent[] {
  return currentEvents.filter((event) => event.id !== eventId);
}

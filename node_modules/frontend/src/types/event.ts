export type EventStatus = 'planned' | 'in-progress' | 'completed';

export type EventSort = 'date-asc' | 'date-desc' | 'status' | 'title';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EventDraft {
  title: string;
  description: string;
  date: string;
  time: string;
  status: EventStatus;
}

export interface EventModalState {
  mode: 'create' | 'edit';
  event?: CalendarEvent;
  initialDate: string;
}

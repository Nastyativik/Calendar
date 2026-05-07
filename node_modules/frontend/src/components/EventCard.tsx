import {
  ClockIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { formatCardDate } from '../lib/date';
import { formatEventTime, getEventStatusLabel } from '../lib/events';
import type { CalendarEvent, EventStatus } from '../types/event';

interface EventCardProps {
  event: CalendarEvent;
  isActive: boolean;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
}

const statusStyles: Record<EventStatus, string> = {
  planned: 'border-white/30 bg-white/16 text-white',
  'in-progress': 'border-[#fff1c0]/45 bg-[#fff6d5]/20 text-[#fff9e8]',
  completed: 'border-[#d7ffe0]/45 bg-[#d7ffe0]/20 text-[#f4fff7]',
};

export function EventCard({ event, isActive, onEdit, onDelete }: EventCardProps) {
  const { day, month, year } = formatCardDate(event.date);

  return (
    <article
      className={`interactive-lift group flex flex-col gap-3 rounded-[34px] border border-white/60 bg-[#abd5ef] p-2 shadow-[0_20px_45px_-34px_rgba(73,129,164,0.95)] transition duration-300 ease-out hover:shadow-[0_30px_55px_-34px_rgba(73,129,164,1)] sm:flex-row sm:items-stretch ${
        isActive ? 'ring-2 ring-[#7fb5d7]/70' : ''
      }`}
    >
      <div className="flex min-w-[112px] shrink-0 flex-col justify-center rounded-[28px] bg-[#d1e9f8]/75 px-4 py-5 text-center text-[#63849a] transition duration-300 ease-out group-hover:bg-[#d9eefb]">
        <span className="text-[28px] font-semibold leading-none text-[#5f86a0]">{day}</span>
        <span className="mt-2 text-base capitalize leading-tight">{month}</span>
        <span className="mt-1 text-sm">{year}</span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center overflow-hidden px-3 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/12 px-3 py-1 text-sm font-medium text-white/92">
            <ClockIcon className="h-4 w-4" />
            {formatEventTime(event.time)}
          </span>
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${statusStyles[event.status]}`}
          >
            {getEventStatusLabel(event.status)}
          </span>
        </div>

        <h3 className="mt-3 break-words text-2xl font-semibold leading-tight text-white sm:text-[2rem]">
          {event.title}
        </h3>
        <p className="mt-2 overflow-hidden break-words whitespace-pre-wrap text-base leading-relaxed text-white/88 sm:text-lg">
          {event.description || 'Описание события пока не добавлено.'}
        </p>
      </div>

      <div className="flex shrink-0 items-start justify-end gap-2 px-2 pb-2 sm:flex-col sm:justify-center sm:px-3 sm:py-4">
        <button
          type="button"
          onClick={() => onEdit(event)}
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/45 bg-white/12 text-white transition duration-300 ease-out hover:-translate-y-0.5 hover:rotate-3 hover:bg-white/25"
          aria-label={`Редактировать ${event.title}`}
        >
          <PencilSquareIcon className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(event.id)}
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/45 bg-white/12 text-white transition duration-300 ease-out hover:-translate-y-0.5 hover:-rotate-3 hover:bg-[#f09393]/35"
          aria-label={`Удалить ${event.title}`}
        >
          <TrashIcon className="h-6 w-6" />
        </button>
      </div>
    </article>
  );
}

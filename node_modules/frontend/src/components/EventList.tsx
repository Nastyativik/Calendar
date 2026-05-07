import { PlusIcon } from '@heroicons/react/24/outline';
import { EventCard } from './EventCard';
import type { CalendarEvent } from '../types/event';

interface EventListProps {
  events: CalendarEvent[];
  selectedDate: string | null;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
  onCreateClick: () => void;
}

export function EventList({
  events,
  selectedDate,
  onEdit,
  onDelete,
  onCreateClick,
}: EventListProps) {
  if (!events.length) {
    return (
      <div className="panel-surface animate-soft-pop flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center text-[#6c98b4]">
        <div className="animate-drift mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/50 text-[#79bbdf]">
          <PlusIcon className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-semibold text-[#4f7b98]">Список пока пуст</h3>
        <p className="mt-3 max-w-md text-base leading-relaxed">
          Добавьте первое событие, и оно сразу сохранится в браузере. Можно указать дату,
          время и текущий статус.
        </p>
        <button
          type="button"
          onClick={onCreateClick}
          className="interactive-lift mt-6 rounded-full bg-white px-6 py-3 text-base font-semibold text-[#4d7c98] shadow-[0_12px_25px_-20px_rgba(53,104,136,0.9)] transition hover:bg-[#f8fdff]"
        >
          Создать событие
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={event.id} className="animate-rise-in" style={{ animationDelay: `${index * 70}ms` }}>
          {index > 0 ? <div className="mx-3 mb-4 h-px bg-[#86b8d6]/70" /> : null}
          <EventCard
            event={event}
            isActive={selectedDate === event.date}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
      ))}
    </div>
  );
}

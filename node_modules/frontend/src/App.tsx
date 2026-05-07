import { useDeferredValue, useEffect, useState } from 'react';
import {
  ArrowsUpDownIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import calendarLogo from './assets/calendar-logo.png';
import { CalendarPanel } from './components/CalendarPanel';
import { EventList } from './components/EventList';
import { EventModal } from './components/EventModal';
import {
  eventSortOptions,
  getEventStatusLabel,
  sortEvents,
} from './lib/events';
import {
  formatFullDateLabel,
  formatMonthLabel,
  isSameMonth,
  parseISODate,
  toISODate,
} from './lib/date';
import {
  createStoredEvent,
  deleteEventById,
  readStoredEvents,
  updateStoredEvent,
  writeStoredEvents,
} from './lib/storage';
import type {
  CalendarEvent,
  EventDraft,
  EventModalState,
  EventSort,
} from './types/event';

const today = new Date();

function App() {
  const [events, setEvents] = useState<CalendarEvent[]>(() => readStoredEvents());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<EventSort>('date-asc');
  const [displayMonth, setDisplayMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalState, setModalState] = useState<EventModalState | null>(null);
  const deferredQuery = useDeferredValue(searchQuery);

  useEffect(() => {
    writeStoredEvents(events);
  }, [events]);

  const normalizedQuery = deferredQuery.trim().toLocaleLowerCase('ru-RU');

  const filteredEvents = events
    .filter((event) => {
      if (!normalizedQuery) {
        return isSameMonth(parseISODate(event.date), displayMonth);
      }

      const haystack = [
        event.title,
        event.description,
        event.date,
        event.time,
        getEventStatusLabel(event.status),
      ]
        .join(' ')
        .toLocaleLowerCase('ru-RU');

      return haystack.includes(normalizedQuery);
    })
    .filter((event) => (selectedDate ? event.date === selectedDate : true));

  const visibleEvents = sortEvents(filteredEvents, sortMode);
  const eventDates = new Set(events.map((event) => event.date));
  const selectedDateLabel = selectedDate ? formatFullDateLabel(parseISODate(selectedDate)) : null;

  const openCreateModal = () => {
    setModalState({
      mode: 'create',
      initialDate: selectedDate ?? toISODate(today),
    });
  };

  const openEditModal = (event: CalendarEvent) => {
    setModalState({
      mode: 'edit',
      event,
      initialDate: event.date,
    });
  };

  const handleSave = (draft: EventDraft) => {
    const nextDate = parseISODate(draft.date);

    setEvents((currentEvents) => {
      if (modalState?.mode === 'edit' && modalState.event) {
        return updateStoredEvent(currentEvents, modalState.event.id, draft);
      }

      return createStoredEvent(currentEvents, draft);
    });

    setDisplayMonth(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
    setSelectedDate(draft.date);
    setModalState(null);
  };

  const handleDelete = (eventId: string) => {
    const shouldDelete = window.confirm('Удалить это событие?');
    if (!shouldDelete) {
      return;
    }

    setEvents((currentEvents) => deleteEventById(currentEvents, eventId));

    if (modalState?.mode === 'edit' && modalState.event?.id === eventId) {
      setModalState(null);
    }
  };

  const handleSelectDate = (isoDate: string) => {
    setSelectedDate((current) => (current === isoDate ? null : isoDate));
  };

  const handleJumpMonth = (direction: -1 | 1) => {
    setDisplayMonth((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1));
  };

  return (
    <div className="animate-page-in min-h-screen w-full bg-transparent text-[#27536d]">
      <div className="flex min-h-screen w-full flex-col overflow-hidden bg-white/30">
        <header className="animate-rise-in border-b border-white/60 bg-[#8ec2e3] px-4 py-4 shadow-[0_14px_40px_-26px_rgba(45,109,149,0.9)] sm:px-5 lg:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/55 bg-white/88 p-1 shadow-[0_12px_24px_-18px_rgba(33,84,115,0.8)]">
                <img
                  src={calendarLogo}
                  alt="Логотип календаря"
                  className="h-full w-full rounded-[1.05rem] object-cover"
                />
              </div>
              <h1 className="text-2xl font-semibold text-white sm:text-3xl">
                Календарь событий
              </h1>
            </div>

            <label className="interactive-lift flex w-full items-center gap-3 rounded-full border border-white/70 bg-white/55 px-4 py-3 text-[#5a84a0] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] xl:max-w-[640px]">
              <MagnifyingGlassIcon className="h-6 w-6 shrink-0 text-[#7ca4bf]" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Поиск по названию, описанию, дате, времени и статусу"
                className="w-full border-none bg-transparent text-base text-[#2b5871] outline-none placeholder:text-[#7ca4bf]"
              />
            </label>
          </div>
        </header>

        <main className="flex-1 px-4 pb-28 pt-6 sm:px-5 lg:px-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(380px,460px)] 2xl:grid-cols-[minmax(0,1.2fr)_minmax(420px,500px)]">
            <section className="animate-rise-in min-w-0 [animation-delay:120ms]">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-[#79a7c5]">
                    Активный месяц
                  </p>
                  <h2 className="text-3xl font-semibold capitalize text-[#4f7b98]">
                    {formatMonthLabel(displayMonth)}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-[#6b99b5]">
                  <span className="rounded-full bg-[#eef8ff] px-4 py-2">
                    Событий: {visibleEvents.length}
                  </span>
                  {selectedDateLabel ? (
                    <button
                      type="button"
                      onClick={() => setSelectedDate(null)}
                      className="rounded-full border border-[#c8e5f8] bg-white px-4 py-2 transition hover:border-[#9fcae6] hover:bg-[#f7fcff]"
                    >
                      {selectedDateLabel}
                    </button>
                  ) : (
                    <span className="rounded-full border border-dashed border-[#c8e5f8] px-4 py-2">
                      Все даты месяца
                    </span>
                  )}
                  <label className="flex items-center gap-3 rounded-full border border-[#c8e5f8] bg-white px-4 py-2 text-[#5e88a2]">
                    <ArrowsUpDownIcon className="h-5 w-5 shrink-0 text-[#7ca4bf]" />
                    <select
                      value={sortMode}
                      onChange={(event) => setSortMode(event.target.value as EventSort)}
                      className="border-none bg-transparent pr-2 text-sm font-medium text-[#4f7b98] outline-none"
                      aria-label="Сортировка событий"
                    >
                      {eventSortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <EventList
                events={visibleEvents}
                selectedDate={selectedDate}
                onDelete={handleDelete}
                onEdit={openEditModal}
                onCreateClick={openCreateModal}
              />
            </section>

            <aside className="animate-rise-in xl:pt-1 [animation-delay:220ms]">
              <CalendarPanel
                currentMonth={displayMonth}
                eventDates={eventDates}
                selectedDate={selectedDate}
                onMonthChange={handleJumpMonth}
                onSelectDate={handleSelectDate}
                onSelectMonth={(monthDate) => setDisplayMonth(monthDate)}
              />
            </aside>
          </div>
        </main>

        <button
          type="button"
          onClick={openCreateModal}
          className="animate-soft-pop animate-pulse-glow fixed bottom-6 right-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/60 bg-[#79bbdf] text-white shadow-[0_22px_35px_-18px_rgba(61,126,163,0.9)] transition duration-300 ease-out hover:-translate-y-1 hover:scale-[1.03] hover:bg-[#6cb0d7] focus:outline-none focus:ring-4 focus:ring-[#bfe1f5] sm:bottom-8 sm:right-8"
          aria-label="Добавить событие"
        >
          <PlusIcon className="h-10 w-10" />
        </button>

        {modalState ? (
          <EventModal
            mode={modalState.mode}
            initialDate={modalState.initialDate}
            initialValues={modalState.event}
            onClose={() => setModalState(null)}
            onSave={handleSave}
          />
        ) : null}
      </div>
    </div>
  );
}

export default App;

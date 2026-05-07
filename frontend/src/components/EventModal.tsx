import { useEffect, useState, type FormEvent } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { eventStatusOptions } from '../lib/events';
import type { CalendarEvent, EventDraft, EventStatus } from '../types/event';

interface EventModalProps {
  mode: 'create' | 'edit';
  initialDate: string;
  initialValues?: CalendarEvent;
  onClose: () => void;
  onSave: (draft: EventDraft) => void;
}

export function EventModal({
  mode,
  initialDate,
  initialValues,
  onClose,
  onSave,
}: EventModalProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [date, setDate] = useState(initialValues?.date ?? initialDate);
  const [time, setTime] = useState(initialValues?.time ?? '');
  const [status, setStatus] = useState<EventStatus>(initialValues?.status ?? 'planned');

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    onSave({
      title: trimmedTitle,
      description,
      date,
      time,
      status,
    });
  };

  return (
    <div
      className="animate-page-in fixed inset-0 z-50 flex items-center justify-center bg-[#76a8c7]/35 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="panel-surface animate-soft-pop w-full max-w-2xl rounded-[34px] bg-[#dff2ff]/95 p-6 text-[#3c6a86] sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-[#7da6c0]">
              {mode === 'create' ? 'Новое событие' : 'Редактирование'}
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-[#4f7b98]">
              {mode === 'create' ? 'Добавить событие' : 'Изменить событие'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-[#5f87a2] transition duration-300 ease-out hover:rotate-90 hover:bg-white"
            aria-label="Закрыть"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.22em] text-[#7da6c0]">
              Название
            </span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Например, защита проекта"
              className="w-full rounded-[24px] border border-white/70 bg-white/80 px-5 py-4 text-lg text-[#35617d] outline-none transition duration-300 ease-out focus:-translate-y-0.5 focus:border-[#8dc1e0] focus:ring-4 focus:ring-[#cfe9f8]"
              maxLength={80}
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.22em] text-[#7da6c0]">
              Описание
            </span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Кратко опишите, что важно не забыть"
              className="min-h-[140px] w-full resize-y rounded-[24px] border border-white/70 bg-white/80 px-5 py-4 text-lg text-[#35617d] outline-none transition duration-300 ease-out focus:-translate-y-0.5 focus:border-[#8dc1e0] focus:ring-4 focus:ring-[#cfe9f8]"
              maxLength={240}
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.22em] text-[#7da6c0]">
                Дата
              </span>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-full rounded-[24px] border border-white/70 bg-white/80 px-5 py-4 text-lg text-[#35617d] outline-none transition duration-300 ease-out focus:-translate-y-0.5 focus:border-[#8dc1e0] focus:ring-4 focus:ring-[#cfe9f8]"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.22em] text-[#7da6c0]">
                Время
              </span>
              <input
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className="w-full rounded-[24px] border border-white/70 bg-white/80 px-5 py-4 text-lg text-[#35617d] outline-none transition duration-300 ease-out focus:-translate-y-0.5 focus:border-[#8dc1e0] focus:ring-4 focus:ring-[#cfe9f8]"
                step={60}
              />
              <span className="mt-2 block text-sm text-[#7a9cb2]">Можно оставить пустым.</span>
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold uppercase tracking-[0.22em] text-[#7da6c0]">
              Статус
            </span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as EventStatus)}
              className="w-full rounded-[24px] border border-white/70 bg-white/80 px-5 py-4 text-lg text-[#35617d] outline-none transition duration-300 ease-out focus:-translate-y-0.5 focus:border-[#8dc1e0] focus:ring-4 focus:ring-[#cfe9f8]"
            >
              {eventStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="interactive-lift rounded-full border border-[#bedff3] bg-white px-6 py-3 text-base font-semibold text-[#5f87a2] transition hover:bg-[#f7fcff]"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="interactive-lift rounded-full bg-[#79bbdf] px-6 py-3 text-base font-semibold text-white shadow-[0_14px_28px_-18px_rgba(67,128,165,0.95)] transition hover:bg-[#6fb1d7]"
            >
              {mode === 'create' ? 'Сохранить событие' : 'Обновить событие'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

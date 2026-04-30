import type { Slot } from '../types/api';

export type SlotDayGroup = {
  key: string;
  label: string;
  description: string;
  slots: Slot[];
};

function getDateKey(isoDateTime: string) {
  return isoDateTime.slice(0, 10);
}

export function formatTimeRange(slot: Slot) {
  const startsAt = new Date(slot.startsAt);
  const endsAt = new Date(slot.endsAt);

  return `${startsAt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} - ${endsAt.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

export function formatLongDate(isoDateTime: string) {
  return new Date(isoDateTime).toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export function groupSlotsByDay(slots: Slot[]): SlotDayGroup[] {
  const groups = new Map<string, Slot[]>();

  for (const slot of slots) {
    const key = getDateKey(slot.startsAt);
    const existing = groups.get(key) ?? [];
    existing.push(slot);
    groups.set(key, existing);
  }

  return Array.from(groups.entries()).map(([key, daySlots]) => {
    const firstSlot = daySlots[0];
    const day = new Date(firstSlot.startsAt);

    return {
      key,
      label: day.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
      }),
      description: day.toLocaleDateString('ru-RU', {
        weekday: 'short',
      }),
      slots: daySlots,
    };
  });
}

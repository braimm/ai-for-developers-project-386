import type {
  ApiError,
  Booking,
  CreateBookingRequest,
  EventTypeDetails,
  PublicEventType,
  PublicOwnerProfile,
  Slot,
} from '../../types/api';

const mockOwner: PublicOwnerProfile = {
  displayName: 'Tota',
  role: 'Host',
};

const mockEventTypes: PublicEventType[] = [
  {
    id: '15-min-call',
    title: 'Встреча 15 минут',
    description: 'Короткий тип события для быстрого слота.',
    durationMinutes: 15,
  },
  {
    id: '30-min-call',
    title: 'Встреча 30 минут',
    description: 'Базовый тип события для бронирования.',
    durationMinutes: 30,
  },
];

const initiallyBookedStarts = new Set<string>([
  '2026-03-31T09:00:00.000Z',
  '2026-03-31T09:15:00.000Z',
  '2026-03-31T09:30:00.000Z',
  '2026-03-31T11:00:00.000Z',
  '2026-04-01T10:30:00.000Z',
  '2026-04-02T13:00:00.000Z',
]);

const bookedStarts = new Set(initiallyBookedStarts);

function delay<T>(value: T, timeout = 250): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), timeout);
  });
}

function delayError(error: ApiError, timeout = 250): Promise<never> {
  return new Promise((_, reject) => {
    window.setTimeout(() => reject(error), timeout);
  });
}

function getEventTypeOrThrow(eventTypeId: string): PublicEventType {
  const eventType = mockEventTypes.find((item) => item.id === eventTypeId);

  if (!eventType) {
    throw {
      code: 'event_type_not_found',
      message: 'Тип события не найден',
      status: 404,
    } satisfies ApiError;
  }

  return eventType;
}

function buildSlots(eventTypeId: string): Slot[] {
  const eventType = getEventTypeOrThrow(eventTypeId);
  const baseDate = new Date('2026-03-31T09:00:00.000Z');
  const slots: Slot[] = [];

  for (let dayOffset = 0; dayOffset < 14; dayOffset += 1) {
    for (let slotIndex = 0; slotIndex < 6; slotIndex += 1) {
      const startsAt = new Date(baseDate);
      startsAt.setUTCDate(baseDate.getUTCDate() + dayOffset);
      startsAt.setUTCMinutes(baseDate.getUTCMinutes() + slotIndex * eventType.durationMinutes);

      const endsAt = new Date(startsAt);
      endsAt.setUTCMinutes(endsAt.getUTCMinutes() + eventType.durationMinutes);

      slots.push({
        eventTypeId,
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
        available: !bookedStarts.has(startsAt.toISOString()),
      });
    }
  }

  return slots;
}

export function getMockPublicProfile() {
  return delay(mockOwner);
}

export function getMockPublicEventTypes() {
  return delay(mockEventTypes);
}

export function getMockPublicEventType(eventTypeId: string) {
  try {
    const eventType = getEventTypeOrThrow(eventTypeId);

    return delay<EventTypeDetails>({
      ...eventType,
      owner: mockOwner,
    });
  } catch (error) {
    return delayError(error as ApiError);
  }
}

export function getMockSlots(eventTypeId: string) {
  try {
    return delay(buildSlots(eventTypeId));
  } catch (error) {
    return delayError(error as ApiError);
  }
}

export function createMockBooking(body: CreateBookingRequest) {
  try {
    const eventType = getEventTypeOrThrow(body.eventTypeId);

    if (bookedStarts.has(body.startsAt)) {
      return delayError({
        code: 'slot_already_booked',
        message: 'Выбранный слот уже занят',
        status: 409,
      });
    }

    bookedStarts.add(body.startsAt);

    const startsAt = new Date(body.startsAt);
    const endsAt = new Date(startsAt);
    endsAt.setUTCMinutes(endsAt.getUTCMinutes() + eventType.durationMinutes);

    return delay<Booking>({
      id: `booking-${startsAt.getTime()}`,
      eventTypeId: body.eventTypeId,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      guestName: body.guestName,
      guestEmail: body.guestEmail,
      notes: body.notes,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    });
  } catch (error) {
    return delayError(error as ApiError);
  }
}

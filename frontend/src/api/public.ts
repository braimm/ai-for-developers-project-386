import { apiRequest } from './client';
import {
  createMockBooking,
  getMockPublicEventType,
  getMockPublicEventTypes,
  getMockPublicProfile,
  getMockSlots,
} from './mock/public';
import type {
  Booking,
  CreateBookingRequest,
  EventTypeDetails,
  PublicEventType,
  PublicOwnerProfile,
  Slot,
} from '../types/api';

const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false';

export function getPublicProfile() {
  if (useMocks) {
    return getMockPublicProfile();
  }

  return apiRequest<PublicOwnerProfile>('/public/profile');
}

export function getPublicEventTypes() {
  if (useMocks) {
    return getMockPublicEventTypes();
  }

  return apiRequest<PublicEventType[]>('/public/event-types');
}

export function getPublicEventType(eventTypeId: string) {
  if (useMocks) {
    return getMockPublicEventType(eventTypeId);
  }

  return apiRequest<EventTypeDetails>(`/public/event-types/${eventTypeId}`);
}

export function getSlots(eventTypeId: string) {
  if (useMocks) {
    return getMockSlots(eventTypeId);
  }

  return apiRequest<Slot[]>(`/public/event-types/${eventTypeId}/slots`);
}

export function createBooking(body: CreateBookingRequest) {
  if (useMocks) {
    return createMockBooking(body);
  }

  return apiRequest<Booking>('/public/bookings', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

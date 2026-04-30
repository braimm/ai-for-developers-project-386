import { apiRequest } from './client';
import type {
  Booking,
  CreateBookingRequest,
  EventTypeDetails,
  PublicEventType,
  PublicOwnerProfile,
  Slot,
} from '../types/api';

export function getPublicProfile() {
  return apiRequest<PublicOwnerProfile>('/public/profile');
}

export function getPublicEventTypes() {
  return apiRequest<PublicEventType[]>('/public/event-types');
}

export function getPublicEventType(eventTypeId: string) {
  return apiRequest<EventTypeDetails>(`/public/event-types/${eventTypeId}`);
}

export function getSlots(eventTypeId: string) {
  return apiRequest<Slot[]>(`/public/event-types/${eventTypeId}/slots`);
}

export function createBooking(body: CreateBookingRequest) {
  return apiRequest<Booking>('/public/bookings', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

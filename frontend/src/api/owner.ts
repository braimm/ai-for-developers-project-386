import { apiRequest } from './client';
import type { Booking, EventType, OwnerProfile } from '../types/api';

export function getOwnerProfile() {
  return apiRequest<OwnerProfile>('/owner/profile');
}

export function getOwnerEventTypes() {
  return apiRequest<EventType[]>('/owner/event-types');
}

export function getOwnerBookings() {
  return apiRequest<Booking[]>('/owner/bookings');
}

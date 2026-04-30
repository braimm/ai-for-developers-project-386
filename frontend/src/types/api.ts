export type PublicOwnerProfile = {
  displayName: string;
  role: 'Host';
};

export type PublicEventType = {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
};

export type EventTypeDetails = PublicEventType & {
  owner: PublicOwnerProfile;
};

export type Slot = {
  eventTypeId: string;
  startsAt: string;
  endsAt: string;
  available: boolean;
};

export type CreateBookingRequest = {
  eventTypeId: string;
  startsAt: string;
  guestName: string;
  guestEmail: string;
  notes?: string;
};

export type Booking = {
  id: string;
  eventTypeId: string;
  startsAt: string;
  endsAt: string;
  guestName: string;
  guestEmail: string;
  notes?: string;
  createdAt: string;
  status: 'confirmed';
};

export type ApiError = {
  code: string;
  message: string;
  status?: number;
};

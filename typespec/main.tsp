import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi3";

using TypeSpec.Http;
using TypeSpec.Rest;

@service(#{
  title: "Calendar Booking API",
})
@server("http://localhost:8000", "Local development")
namespace CalendarBooking;

model OwnerProfile {
  id: "owner";
  displayName: string;
}

model PublicOwnerProfile {
  displayName: string;
  role: "Host";
}

model EventType {
  id: string;
  title: string;
  description?: string;
  durationMinutes: int32;
}

model PublicEventType {
  id: string;
  title: string;
  description?: string;
  durationMinutes: int32;
}

model Slot {
  eventTypeId: string;
  startsAt: utcDateTime;
  endsAt: utcDateTime;
  available: boolean;
}

model Booking {
  id: string;
  eventTypeId: string;
  startsAt: utcDateTime;
  endsAt: utcDateTime;
  guestName: string;
  guestEmail: string;
  notes?: string;
  createdAt: utcDateTime;
  status: "confirmed";
}

model CreateEventTypeRequest {
  id: string;
  title: string;
  description?: string;
  durationMinutes: int32;
}

model CreateBookingRequest {
  eventTypeId: string;
  startsAt: utcDateTime;
  guestName: string;
  guestEmail: string;
  notes?: string;
}

model EventTypeDetails extends PublicEventType {
  owner: PublicOwnerProfile;
}

model UpcomingBookingsQuery {
  from?: utcDateTime;
}

model ErrorResponse {
  code: string;
  message: string;
}

model CreatedEventType extends EventType {
  @statusCode statusCode: 201;
}

model CreatedBooking extends Booking {
  @statusCode statusCode: 201;
}

model ValidationError extends ErrorResponse {
  @statusCode statusCode: 400;
  code: "validation_error";
}

model EventTypeNotFoundError extends ErrorResponse {
  @statusCode statusCode: 404;
  code: "event_type_not_found";
}

model SlotAlreadyBookedError extends ErrorResponse {
  @statusCode statusCode: 409;
  code: "slot_already_booked";
}

@route("/owner")
interface OwnerApi {
  @doc("Returns the predefined owner profile.")
  @get
  @route("/profile")
  getProfile(): OwnerProfile;

  @doc("Returns all event types available for booking.")
  @get
  @route("/event-types")
  listEventTypes(): EventType[];

  @doc("Creates a new event type.")
  @post
  @route("/event-types")
  createEventType(@body body: CreateEventTypeRequest): CreatedEventType | ValidationError;

  @doc("Returns all upcoming bookings across every event type.")
  @get
  @route("/bookings")
  listUpcomingBookings(@query query: UpcomingBookingsQuery): Booking[];
}

@route("/public")
interface PublicApi {
  @doc("Returns public booking options that a guest can choose from.")
  @get
  @route("/profile")
  getPublicProfile(): PublicOwnerProfile;

  @doc("Returns public booking options that a guest can choose from.")
  @get
  @route("/event-types")
  listPublicEventTypes(): PublicEventType[];

  @doc("Returns one public event type together with host details for the booking screen.")
  @get
  @route("/event-types/{eventTypeId}")
  getPublicEventType(@path eventTypeId: string): EventTypeDetails | EventTypeNotFoundError;

  @doc("Returns slots for an event type with availability status for the default 14-day booking window starting from the current date.")
  @get
  @route("/event-types/{eventTypeId}/slots")
  listSlots(@path eventTypeId: string): Slot[] | EventTypeNotFoundError;

  @doc("Creates a booking for a selected slot if the time is still free and belongs to the default 14-day booking window.")
  @post
  @route("/bookings")
  createBooking(
    @body body: CreateBookingRequest,
  ): CreatedBooking | ValidationError | EventTypeNotFoundError | SlotAlreadyBookedError;
}

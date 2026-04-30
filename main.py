from datetime import datetime, timedelta, timezone

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel


class OwnerProfile(BaseModel):
    id: str
    displayName: str


class PublicOwnerProfile(BaseModel):
    displayName: str
    role: str


class EventType(BaseModel):
    id: str
    title: str
    description: str | None = None
    durationMinutes: int


class Slot(BaseModel):
    eventTypeId: str
    startsAt: datetime
    endsAt: datetime
    available: bool


class Booking(BaseModel):
    id: str
    eventTypeId: str
    startsAt: datetime
    endsAt: datetime
    guestName: str
    guestEmail: str
    notes: str | None = None
    createdAt: datetime
    status: str = "confirmed"


class CreateEventTypeRequest(BaseModel):
    id: str
    title: str
    description: str | None = None
    durationMinutes: int


class CreateBookingRequest(BaseModel):
    eventTypeId: str
    startsAt: datetime
    guestName: str
    guestEmail: str
    notes: str | None = None


class EventTypeDetails(EventType):
    owner: PublicOwnerProfile


app = FastAPI(title="Calendar Booking API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OWNER_PROFILE = OwnerProfile(id="owner", displayName="Tota")
PUBLIC_OWNER_PROFILE = PublicOwnerProfile(displayName=OWNER_PROFILE.displayName, role="Host")

event_types: dict[str, EventType] = {
    "15-min-call": EventType(
        id="15-min-call",
        title="Встреча 15 минут",
        description="Короткий тип события для быстрого слота.",
        durationMinutes=15,
    ),
    "30-min-call": EventType(
        id="30-min-call",
        title="Встреча 30 минут",
        description="Базовый тип события для бронирования.",
        durationMinutes=30,
    ),
}
bookings: list[Booking] = []


def error_response(status_code: int, code: str, message: str) -> JSONResponse:
    return JSONResponse(status_code=status_code, content={"code": code, "message": message})


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def slot_window_start() -> datetime:
    now = utc_now()
    return now.replace(hour=9, minute=0, second=0, microsecond=0)


def get_event_type_or_none(event_type_id: str) -> EventType | None:
    return event_types.get(event_type_id)


def list_event_types_sorted() -> list[EventType]:
    return sorted(event_types.values(), key=lambda item: item.id)


def overlaps(starts_at: datetime, ends_at: datetime, booking: Booking) -> bool:
    return starts_at < booking.endsAt and booking.startsAt < ends_at


def build_slots_for_event_type(event_type: EventType) -> list[Slot]:
    slots: list[Slot] = []
    base_start = slot_window_start()

    for day_offset in range(14):
        for slot_index in range(6):
            starts_at = base_start + timedelta(days=day_offset, minutes=slot_index * event_type.durationMinutes)
            ends_at = starts_at + timedelta(minutes=event_type.durationMinutes)
            slots.append(
                Slot(
                    eventTypeId=event_type.id,
                    startsAt=starts_at,
                    endsAt=ends_at,
                    available=not any(overlaps(starts_at, ends_at, booking) for booking in bookings),
                )
            )

    return slots


def booking_sort_key(booking: Booking) -> tuple[datetime, str]:
    return booking.startsAt, booking.id


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Hello from FastAPI!"}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/owner/profile")
def get_owner_profile() -> OwnerProfile:
    return OWNER_PROFILE


@app.get("/owner/event-types")
def list_owner_event_types() -> list[EventType]:
    return list_event_types_sorted()


@app.post("/owner/event-types", status_code=201)
def create_event_type(body: CreateEventTypeRequest):
    if not body.id.strip() or not body.title.strip():
        return error_response(400, "validation_error", "Event type id and title are required")

    if body.durationMinutes <= 0:
        return error_response(400, "validation_error", "Event type duration must be positive")

    if body.id in event_types:
        return error_response(400, "validation_error", "Event type id must be unique")

    event_type = EventType(**body.model_dump())
    event_types[event_type.id] = event_type
    return event_type


@app.get("/owner/bookings")
def list_upcoming_bookings(from_: datetime | None = Query(default=None, alias="from")) -> list[Booking]:
    threshold = from_ or utc_now()
    return sorted((booking for booking in bookings if booking.startsAt >= threshold), key=booking_sort_key)


@app.get("/public/profile")
def get_public_profile() -> PublicOwnerProfile:
    return PUBLIC_OWNER_PROFILE


@app.get("/public/event-types")
def list_public_event_types() -> list[EventType]:
    return list_event_types_sorted()


@app.get("/public/event-types/{event_type_id}")
def get_public_event_type(event_type_id: str):
    event_type = get_event_type_or_none(event_type_id)

    if event_type is None:
        return error_response(404, "event_type_not_found", "Event type not found")

    return EventTypeDetails(**event_type.model_dump(), owner=PUBLIC_OWNER_PROFILE)


@app.get("/public/event-types/{event_type_id}/slots")
def list_slots(event_type_id: str):
    event_type = get_event_type_or_none(event_type_id)

    if event_type is None:
        return error_response(404, "event_type_not_found", "Event type not found")

    return build_slots_for_event_type(event_type)


@app.post("/public/bookings", status_code=201)
def create_booking(body: CreateBookingRequest):
    event_type = get_event_type_or_none(body.eventTypeId)

    if event_type is None:
        return error_response(404, "event_type_not_found", "Event type not found")

    if not body.guestName.strip() or not body.guestEmail.strip():
        return error_response(400, "validation_error", "Guest name and email are required")

    allowed_slots = build_slots_for_event_type(event_type)
    matching_slot = next((slot for slot in allowed_slots if slot.startsAt == body.startsAt), None)

    if matching_slot is None:
        return error_response(400, "validation_error", "Selected slot is outside the available 14-day booking window")

    if not matching_slot.available:
        return error_response(409, "slot_already_booked", "Selected slot is already booked")

    booking = Booking(
        id=f"booking-{len(bookings) + 1}",
        eventTypeId=body.eventTypeId,
        startsAt=matching_slot.startsAt,
        endsAt=matching_slot.endsAt,
        guestName=body.guestName,
        guestEmail=body.guestEmail,
        notes=body.notes,
        createdAt=utc_now(),
    )
    bookings.append(booking)

    return booking

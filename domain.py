from datetime import datetime

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


OWNER_PROFILE = OwnerProfile(id="owner", displayName="Tota")
PUBLIC_OWNER_PROFILE = PublicOwnerProfile(displayName=OWNER_PROFILE.displayName, role="Host")


def default_event_types() -> list[EventType]:
    return [
        EventType(
            id="15-min-call",
            title="Встреча 15 минут",
            description="Короткий тип события для быстрого слота.",
            durationMinutes=15,
        ),
        EventType(
            id="30-min-call",
            title="Встреча 30 минут",
            description="Базовый тип события для бронирования.",
            durationMinutes=30,
        ),
    ]

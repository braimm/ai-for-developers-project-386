import os
from datetime import datetime
from typing import Protocol

from sqlalchemy import select

from db import Base, SessionLocal, engine
from domain import Booking, EventType, default_event_types
from models import BookingModel, EventTypeModel


def _to_iso(value: datetime) -> str:
    return value.isoformat()


def _parse_datetime(value: str) -> datetime:
    return datetime.fromisoformat(value)


def _event_type_from_model(model: EventTypeModel) -> EventType:
    return EventType(
        id=model.id,
        title=model.title,
        description=model.description,
        durationMinutes=model.duration_minutes,
    )


def _booking_from_model(model: BookingModel) -> Booking:
    return Booking(
        id=model.id,
        eventTypeId=model.event_type_id,
        startsAt=_parse_datetime(model.starts_at),
        endsAt=_parse_datetime(model.ends_at),
        guestName=model.guest_name,
        guestEmail=model.guest_email,
        notes=model.notes,
        createdAt=_parse_datetime(model.created_at),
        status=model.status,
    )


class Storage(Protocol):
    def list_event_types(self) -> list[EventType]: ...

    def get_event_type(self, event_type_id: str) -> EventType | None: ...

    def create_event_type(self, event_type: EventType) -> EventType: ...

    def list_upcoming_bookings(self, from_: datetime) -> list[Booking]: ...

    def list_all_bookings(self) -> list[Booking]: ...

    def create_booking(self, booking: Booking) -> Booking: ...


class MemoryStorage:
    def __init__(self) -> None:
        self._event_types = {event_type.id: event_type for event_type in default_event_types()}
        self._bookings: list[Booking] = []

    def list_event_types(self) -> list[EventType]:
        return sorted(self._event_types.values(), key=lambda item: item.id)

    def get_event_type(self, event_type_id: str) -> EventType | None:
        return self._event_types.get(event_type_id)

    def create_event_type(self, event_type: EventType) -> EventType:
        self._event_types[event_type.id] = event_type
        return event_type

    def list_upcoming_bookings(self, from_: datetime) -> list[Booking]:
        return sorted(
            (booking for booking in self._bookings if booking.startsAt >= from_),
            key=lambda booking: (booking.startsAt, booking.id),
        )

    def list_all_bookings(self) -> list[Booking]:
        return list(self._bookings)

    def create_booking(self, booking: Booking) -> Booking:
        self._bookings.append(booking)
        return booking


class SQLiteStorage:
    def __init__(self) -> None:
        Base.metadata.create_all(engine)
        self._ensure_seed_data()

    def _ensure_seed_data(self) -> None:
        with SessionLocal() as session:
            existing_ids = set(session.scalars(select(EventTypeModel.id)).all())

            for event_type in default_event_types():
                if event_type.id in existing_ids:
                    continue

                session.add(
                    EventTypeModel(
                        id=event_type.id,
                        title=event_type.title,
                        description=event_type.description,
                        duration_minutes=event_type.durationMinutes,
                    )
                )

            session.commit()

    def list_event_types(self) -> list[EventType]:
        with SessionLocal() as session:
            models = session.scalars(select(EventTypeModel).order_by(EventTypeModel.id)).all()
            return [_event_type_from_model(model) for model in models]

    def get_event_type(self, event_type_id: str) -> EventType | None:
        with SessionLocal() as session:
            model = session.get(EventTypeModel, event_type_id)
            return _event_type_from_model(model) if model else None

    def create_event_type(self, event_type: EventType) -> EventType:
        with SessionLocal() as session:
            session.add(
                EventTypeModel(
                    id=event_type.id,
                    title=event_type.title,
                    description=event_type.description,
                    duration_minutes=event_type.durationMinutes,
                )
            )
            session.commit()
        return event_type

    def list_upcoming_bookings(self, from_: datetime) -> list[Booking]:
        with SessionLocal() as session:
            models = session.scalars(select(BookingModel).order_by(BookingModel.starts_at, BookingModel.id)).all()
            bookings = [_booking_from_model(model) for model in models]
            return [booking for booking in bookings if booking.startsAt >= from_]

    def list_all_bookings(self) -> list[Booking]:
        with SessionLocal() as session:
            models = session.scalars(select(BookingModel).order_by(BookingModel.starts_at, BookingModel.id)).all()
            return [_booking_from_model(model) for model in models]

    def create_booking(self, booking: Booking) -> Booking:
        with SessionLocal() as session:
            session.add(
                BookingModel(
                    id=booking.id,
                    event_type_id=booking.eventTypeId,
                    starts_at=_to_iso(booking.startsAt),
                    ends_at=_to_iso(booking.endsAt),
                    guest_name=booking.guestName,
                    guest_email=booking.guestEmail,
                    notes=booking.notes,
                    created_at=_to_iso(booking.createdAt),
                    status=booking.status,
                )
            )
            session.commit()
        return booking


def get_storage() -> Storage:
    storage_mode = os.getenv("APP_STORAGE", "sqlite").lower()

    if storage_mode == "memory":
        return MemoryStorage()

    if storage_mode == "sqlite":
        return SQLiteStorage()

    raise ValueError(f"Unsupported APP_STORAGE mode: {storage_mode}")

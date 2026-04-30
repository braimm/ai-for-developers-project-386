from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from db import Base


class EventTypeModel(Base):
    __tablename__ = "event_types"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    duration_minutes: Mapped[int] = mapped_column(Integer, nullable=False)


class BookingModel(Base):
    __tablename__ = "bookings"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    event_type_id: Mapped[str] = mapped_column(String, nullable=False, index=True)
    starts_at: Mapped[str] = mapped_column(String, nullable=False, index=True)
    ends_at: Mapped[str] = mapped_column(String, nullable=False)
    guest_name: Mapped[str] = mapped_column(String, nullable=False)
    guest_email: Mapped[str] = mapped_column(String, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[str] = mapped_column(String, nullable=False, default="confirmed")

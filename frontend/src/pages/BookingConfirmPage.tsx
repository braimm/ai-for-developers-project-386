import { Alert, Button, Card, Container, Group, Stack, Text, Title } from '@mantine/core';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createBooking } from '../api/public';
import { BookingForm } from '../components/public/BookingForm';
import { formatLongDate, formatTimeRange } from '../lib/slots';
import type { ApiError, Booking, CreateBookingRequest, EventTypeDetails, Slot } from '../types/api';

type ConfirmState = {
  eventType: EventTypeDetails;
  slot: Slot;
};

export function BookingConfirmPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ConfirmState | null;
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);

  if (!state) {
    return (
      <Container size="sm" py={80}>
        <Alert color="yellow" radius="xl" title="Не удалось открыть шаг подтверждения">
          Сначала выберите тип события и слот в публичном календаре.
        </Alert>
      </Container>
    );
  }

  const confirmState = state;

  async function handleSubmit(value: CreateBookingRequest) {
    try {
      setLoading(true);
      setError(null);

      const booking = await createBooking(value);

      navigate('/bookings/success', {
        state: {
          booking,
          eventType: confirmState.eventType,
        },
      });
    } catch (caughtError) {
      setError(caughtError as ApiError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container size="sm" py={64}>
      <Card withBorder radius="xl" padding="xl">
        <Stack gap="lg">
          <Title order={1}>Подтверждение бронирования</Title>
          <Text c="dimmed">Заполните контактные данные. После отправки запись сохранится через текущий API-слой.</Text>
          <Card radius="lg" padding="lg" bg="#eef3f8">
            <Stack gap="sm">
              <Text fw={700}>{confirmState.eventType.title}</Text>
              <Text>{formatLongDate(confirmState.slot.startsAt)}</Text>
              <Text>{formatTimeRange(confirmState.slot)}</Text>
            </Stack>
          </Card>

          {error ? (
            <Alert color={error.code === 'slot_already_booked' ? 'yellow' : 'red'} radius="xl" title="Не удалось создать бронирование">
              {error.message}
            </Alert>
          ) : null}

          <BookingForm
            eventTypeId={confirmState.eventType.id}
            startsAt={confirmState.slot.startsAt}
            onSubmit={handleSubmit}
            loading={loading}
          />

          <Group>
            <Button component={Link} to={`/book/${confirmState.eventType.id}`} variant="light" color="orange" radius="xl" w="fit-content">
              Вернуться к выбору слота
            </Button>
          </Group>
        </Stack>
      </Card>
    </Container>
  );
}

export type BookingSuccessState = {
  booking: Booking;
  eventType: EventTypeDetails;
};

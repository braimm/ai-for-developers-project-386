import { Badge, Button, Card, Container, Stack, Text, Title } from '@mantine/core';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { formatLongDate, formatTimeRange } from '../lib/slots';
import type { Slot } from '../types/api';
import type { BookingSuccessState } from './BookingConfirmPage';

export function BookingSuccessPage() {
  const location = useLocation();
  const state = location.state as BookingSuccessState | null;

  if (!state) {
    return <Navigate to="/book" replace />;
  }

  const slot: Slot = {
    eventTypeId: state.booking.eventTypeId,
    startsAt: state.booking.startsAt,
    endsAt: state.booking.endsAt,
    available: false,
  };

  return (
    <Container size="sm" py={64}>
      <Card withBorder radius="xl" padding="xl">
        <Stack gap="lg">
          <Badge color="green" variant="light" radius="xl" w="fit-content">
            Бронирование подтверждено
          </Badge>
          <Title order={1}>Спасибо, встреча запланирована</Title>
          <Text c="dimmed">Мы сохранили вашу запись и можем использовать этот экран как основу для будущего success-step.</Text>

          <Card radius="lg" padding="lg" bg="#eef3f8">
            <Stack gap="sm">
              <Text fw={700}>{state.eventType.title}</Text>
              <Text>{formatLongDate(state.booking.startsAt)}</Text>
              <Text>{formatTimeRange(slot)}</Text>
              <Text>Гость: {state.booking.guestName}</Text>
              <Text>Email: {state.booking.guestEmail}</Text>
              {state.booking.notes ? <Text>Комментарий: {state.booking.notes}</Text> : null}
            </Stack>
          </Card>

          <Button component={Link} to="/book" color="orange" radius="xl" w="fit-content">
            Вернуться к каталогу
          </Button>
        </Stack>
      </Card>
    </Container>
  );
}

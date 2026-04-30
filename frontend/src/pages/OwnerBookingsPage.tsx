import { Alert, Badge, Card, Container, Grid, Loader, Stack, Text, Title } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';
import { getOwnerBookings, getOwnerEventTypes, getOwnerProfile } from '../api/owner';
import { formatLongDate, formatTimeRange } from '../lib/slots';
import type { ApiError, Booking, EventType, OwnerProfile, Slot } from '../types/api';

function bookingToSlot(booking: Booking): Slot {
  return {
    eventTypeId: booking.eventTypeId,
    startsAt: booking.startsAt,
    endsAt: booking.endsAt,
    available: false,
  };
}

export function OwnerBookingsPage() {
  const [owner, setOwner] = useState<OwnerProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadPage() {
      try {
        const [nextOwner, nextBookings, nextEventTypes] = await Promise.all([
          getOwnerProfile(),
          getOwnerBookings(),
          getOwnerEventTypes(),
        ]);

        if (!active) {
          return;
        }

        setOwner(nextOwner);
        setBookings(nextBookings);
        setEventTypes(nextEventTypes);
        setError(null);
      } catch (caughtError) {
        if (!active) {
          return;
        }

        setError(caughtError as ApiError);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadPage();

    return () => {
      active = false;
    };
  }, []);

  const eventTypeTitles = useMemo(() => {
    return new Map(eventTypes.map((eventType) => [eventType.id, eventType.title]));
  }, [eventTypes]);

  return (
    <Container size="lg" py={48}>
      <Stack gap="xl">
        {loading ? (
          <Stack align="center" py={80}>
            <Loader color="orange" size="lg" />
            <Text c="dimmed">Загружаем предстоящие записи...</Text>
          </Stack>
        ) : null}

        {error ? (
          <Alert color="red" radius="xl" title="Не удалось загрузить страницу владельца">
            {error.message}
          </Alert>
        ) : null}

        {!loading && !error && owner ? (
          <Stack gap="xl">
            <Card withBorder radius="xl" padding="xl" shadow="sm">
              <Stack gap="xs">
                <Badge color="orange" variant="light" radius="xl" w="fit-content">
                  Владелец календаря
                </Badge>
                <Title order={1}>{owner.displayName}</Title>
                <Text c="dimmed">Все предстоящие записи по всем типам событий в одном месте.</Text>
              </Stack>
            </Card>

            <Stack gap="xs">
              <Title order={2}>Предстоящие записи</Title>
            </Stack>

            {bookings.length === 0 ? (
              <Card withBorder radius="xl" padding="xl">
                <Stack gap="sm">
                  <Title order={3}>Пока нет записей</Title>
                  <Text c="dimmed">Как только гость создаст бронирование, оно появится здесь.</Text>
                </Stack>
              </Card>
            ) : (
              <Grid gutter="xl">
                {bookings.map((booking) => {
                  const slot = bookingToSlot(booking);

                  return (
                    <Grid.Col key={booking.id} span={{ base: 12, md: 6 }}>
                      <Card withBorder radius="xl" padding="xl" shadow="sm" h="100%">
                        <Stack gap="md">
                          <Stack gap={4}>
                            <Text c="dimmed" size="sm">
                              Тип события
                            </Text>
                            <Title order={3}>{eventTypeTitles.get(booking.eventTypeId) ?? booking.eventTypeId}</Title>
                          </Stack>

                          <Stack gap={4}>
                            <Text c="dimmed" size="sm">
                              Дата
                            </Text>
                            <Text fw={600}>{formatLongDate(booking.startsAt)}</Text>
                            <Text>{formatTimeRange(slot)}</Text>
                          </Stack>

                          <Stack gap={4}>
                            <Text c="dimmed" size="sm">
                              Гость
                            </Text>
                            <Text fw={600}>{booking.guestName}</Text>
                            <Text>{booking.guestEmail}</Text>
                          </Stack>

                          {booking.notes ? (
                            <Stack gap={4}>
                              <Text c="dimmed" size="sm">
                                Комментарий
                              </Text>
                              <Text>{booking.notes}</Text>
                            </Stack>
                          ) : null}
                        </Stack>
                      </Card>
                    </Grid.Col>
                  );
                })}
              </Grid>
            )}
          </Stack>
        ) : null}
      </Stack>
    </Container>
  );
}

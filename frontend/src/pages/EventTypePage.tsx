import {
  Alert,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getPublicEventType, getSlots } from '../api/public';
import { SlotList } from '../components/public/SlotList';
import { HostCard } from '../components/public/HostCard';
import { formatLongDate, groupSlotsByDay } from '../lib/slots';
import type { ApiError, EventTypeDetails, Slot } from '../types/api';

export function EventTypePage() {
  const { eventTypeId = '' } = useParams();
  const navigate = useNavigate();
  const [eventType, setEventType] = useState<EventTypeDetails | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPage() {
      try {
        const [nextEventType, nextSlots] = await Promise.all([getPublicEventType(eventTypeId), getSlots(eventTypeId)]);

        if (!active) {
          return;
        }

        setEventType(nextEventType);
        setSlots(nextSlots);
        setError(null);

        const groups = groupSlotsByDay(nextSlots);
        setSelectedDayKey(groups[0]?.key ?? null);
        setSelectedSlot(null);
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
  }, [eventTypeId]);

  const slotGroups = groupSlotsByDay(slots);
  const selectedGroup = slotGroups.find((group) => group.key === selectedDayKey) ?? null;

  return (
    <Container size="lg" py={48}>
      <Stack gap="xl">
        {loading ? (
          <Stack align="center" py={80}>
            <Loader color="orange" size="lg" />
            <Text c="dimmed">Загружаем выбранный тип события...</Text>
          </Stack>
        ) : null}

        {error ? (
          <Alert color="red" radius="xl" title="Не удалось загрузить страницу события">
            {error.message}
          </Alert>
        ) : null}

        {!loading && !error && eventType ? (
          <Stack gap="xl">
            <Title order={1}>{eventType.title}</Title>

            <Grid gutter="xl" align="stretch">
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Stack gap="lg">
                  <HostCard owner={eventType.owner} />
                  <Card withBorder radius="xl" padding="xl">
                    <Stack gap="md">
                      <Group justify="space-between" align="flex-start">
                        <div>
                          <Title order={3}>{eventType.title}</Title>
                          <Text c="dimmed" mt="xs">
                            {eventType.description}
                          </Text>
                        </div>
                        <Text fw={700} c="dimmed">
                          {eventType.durationMinutes} мин
                        </Text>
                      </Group>
                      <Card radius="lg" padding="md" bg="#eef3f8">
                        <Text c="dimmed" size="sm">
                          Выбранная дата
                        </Text>
                        <Text fw={600}>{selectedGroup ? formatLongDate(selectedGroup.slots[0].startsAt) : 'Дата не выбрана'}</Text>
                      </Card>
                      <Card radius="lg" padding="md" bg="#eef3f8">
                        <Text c="dimmed" size="sm">
                          Выбранное время
                        </Text>
                        <Text fw={600}>{selectedSlot ? `${new Date(selectedSlot.startsAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}` : 'Время не выбрано'}</Text>
                      </Card>
                    </Stack>
                  </Card>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card withBorder radius="xl" padding="xl" h="100%">
                  <Stack gap="lg">
                    <Title order={2}>Календарь</Title>
                    <SimpleGrid cols={2} spacing="sm">
                      {slotGroups.map((group) => {
                        const active = group.key === selectedDayKey;

                        return (
                          <Button
                            key={group.key}
                            variant={active ? 'filled' : 'light'}
                            color={active ? 'orange' : 'gray'}
                            radius="xl"
                            h={72}
                            onClick={() => {
                              setSelectedDayKey(group.key);
                              setSelectedSlot(null);
                            }}
                          >
                            <Stack gap={0} align="center">
                              <Text fw={700}>{group.label}</Text>
                              <Text size="xs">{group.description}</Text>
                            </Stack>
                          </Button>
                        );
                      })}
                    </SimpleGrid>
                  </Stack>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card withBorder radius="xl" padding="xl" h="100%">
                  <Stack gap="lg" h="100%">
                    <Title order={2}>Статус слотов</Title>
                    {selectedGroup ? (
                      <SlotList
                        slots={selectedGroup.slots}
                        selectedSlotStartsAt={selectedSlot?.startsAt ?? null}
                        onSelect={setSelectedSlot}
                      />
                    ) : (
                      <Text c="dimmed">Нет слотов для выбранной даты.</Text>
                    )}
                    <Group mt="auto" grow>
                      <Button component={Link} to="/book" variant="default" radius="xl">
                        Назад
                      </Button>
                      <Button
                        color="orange"
                        radius="xl"
                        disabled={!selectedSlot}
                        onClick={() => {
                          if (!selectedSlot) {
                            return;
                          }

                          navigate(`/book/${eventType.id}/confirm`, {
                            state: {
                              eventType,
                              slot: selectedSlot,
                            },
                          });
                        }}
                      >
                        Продолжить
                      </Button>
                    </Group>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Stack>
        ) : null}
      </Stack>
    </Container>
  );
}

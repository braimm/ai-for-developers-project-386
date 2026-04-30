import { Alert, Container, Grid, Loader, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { getPublicEventTypes, getPublicProfile } from '../api/public';
import { EventTypeCard } from '../components/public/EventTypeCard';
import { HostCard } from '../components/public/HostCard';
import type { ApiError, PublicEventType, PublicOwnerProfile } from '../types/api';

export function PublicCatalogPage() {
  const [owner, setOwner] = useState<PublicOwnerProfile | null>(null);
  const [eventTypes, setEventTypes] = useState<PublicEventType[]>([]);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadPage() {
      try {
        const [nextOwner, nextEventTypes] = await Promise.all([getPublicProfile(), getPublicEventTypes()]);

        if (!active) {
          return;
        }

        setOwner(nextOwner);
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

  return (
    <Container size="lg" py={48}>
      <Stack gap="xl">
        {loading ? (
          <Stack align="center" py={80}>
            <Loader color="orange" size="lg" />
            <Text c="dimmed">Загружаем типы событий...</Text>
          </Stack>
        ) : null}

        {error ? (
          <Alert color="red" radius="xl" title="Не удалось загрузить каталог">
            {error.message}
          </Alert>
        ) : null}

        {!loading && !error && owner ? (
          <Grid gutter="xl">
            <Grid.Col span={12}>
              <HostCard
                owner={owner}
                subtitle="Нажмите на карточку, чтобы открыть календарь и выбрать удобный слот"
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Stack gap="xs">
                <Title order={1}>Выберите тип события</Title>
                <Text c="dimmed">Доступные типы встреч для бронирования по публичному календарю.</Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={12}>
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                {eventTypes.map((eventType) => (
                  <EventTypeCard key={eventType.id} eventType={eventType} />
                ))}
              </SimpleGrid>
            </Grid.Col>
          </Grid>
        ) : null}
      </Stack>
    </Container>
  );
}

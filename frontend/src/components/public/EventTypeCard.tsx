import { Badge, Card, Group, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import type { PublicEventType } from '../../types/api';

type Props = {
  eventType: PublicEventType;
};

export function EventTypeCard({ eventType }: Props) {
  return (
    <Card
      component={Link}
      to={`/book/${eventType.id}`}
      withBorder
      radius="xl"
      padding="lg"
      shadow="sm"
      style={{ textDecoration: 'none' }}
    >
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <Title order={3} c="dark">
            {eventType.title}
          </Title>
          <Badge variant="light" radius="xl" color="gray">
            {eventType.durationMinutes} мин
          </Badge>
        </Group>
        <Text c="dimmed">{eventType.description ?? 'Описание появится после настройки типа события.'}</Text>
      </Stack>
    </Card>
  );
}

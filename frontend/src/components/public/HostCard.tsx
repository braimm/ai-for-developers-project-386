import { Avatar, Card, Group, Stack, Text, Title } from '@mantine/core';
import type { PublicOwnerProfile } from '../../types/api';

type Props = {
  owner: PublicOwnerProfile;
  subtitle?: string;
};

export function HostCard({ owner, subtitle }: Props) {
  const roleLabel = owner.role === 'Host' ? 'Владелец календаря' : owner.role;

  return (
    <Card withBorder radius="xl" padding="xl" shadow="sm">
      <Group align="flex-start" gap="md">
        <Avatar color="teal" radius="xl" size={64}>
          {owner.displayName.slice(0, 1).toUpperCase()}
        </Avatar>
        <Stack gap={4}>
          <Title order={3}>{owner.displayName}</Title>
          <Text c="dimmed">{roleLabel}</Text>
          {subtitle ? <Text c="dimmed">{subtitle}</Text> : null}
        </Stack>
      </Group>
    </Card>
  );
}

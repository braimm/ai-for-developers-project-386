import { Button, Card, Group, Stack, Text } from '@mantine/core';
import type { Slot } from '../../types/api';
import { formatTimeRange } from '../../lib/slots';

type Props = {
  slots: Slot[];
  selectedSlotStartsAt: string | null;
  onSelect: (slot: Slot) => void;
};

export function SlotList({ slots, selectedSlotStartsAt, onSelect }: Props) {
  return (
    <Stack gap="sm">
      {slots.map((slot) => {
        const selected = selectedSlotStartsAt === slot.startsAt;

        return (
          <Card key={slot.startsAt} withBorder radius="lg" padding="sm">
            <Group justify="space-between" align="center">
              <Text fw={selected ? 700 : 500}>{formatTimeRange(slot)}</Text>
              {slot.available ? (
                <Button size="xs" radius="xl" color={selected ? 'orange' : 'dark'} onClick={() => onSelect(slot)}>
                  {selected ? 'Выбрано' : 'Свободно'}
                </Button>
              ) : (
                <Text c="dimmed" fw={600}>
                  Занято
                </Text>
              )}
            </Group>
          </Card>
        );
      })}
    </Stack>
  );
}

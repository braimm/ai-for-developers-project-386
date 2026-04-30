import { Button, Stack, TextInput, Textarea } from '@mantine/core';
import { useState } from 'react';
import type { CreateBookingRequest } from '../../types/api';

type Props = {
  eventTypeId: string;
  startsAt: string;
  onSubmit: (value: CreateBookingRequest) => Promise<void>;
  loading: boolean;
};

export function BookingForm({ eventTypeId, startsAt, onSubmit, loading }: Props) {
  const [guestName, setGuestName] = useState('Иван');
  const [guestEmail, setGuestEmail] = useState('ivan@example.com');
  const [notes, setNotes] = useState('Хочу обсудить ближайшие шаги по проекту.');

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        void onSubmit({
          eventTypeId,
          startsAt,
          guestName,
          guestEmail,
          notes: notes || undefined,
        });
      }}
    >
      <Stack gap="md">
        <TextInput label="Ваше имя" value={guestName} onChange={(event) => setGuestName(event.currentTarget.value)} required />
        <TextInput
          label="Email"
          type="email"
          value={guestEmail}
          onChange={(event) => setGuestEmail(event.currentTarget.value)}
          required
        />
        <Textarea
          label="Комментарий"
          minRows={4}
          value={notes}
          onChange={(event) => setNotes(event.currentTarget.value)}
          placeholder="Коротко опишите контекст встречи"
        />
        <Button type="submit" color="orange" radius="xl" loading={loading}>
          Подтвердить бронирование
        </Button>
      </Stack>
    </form>
  );
}

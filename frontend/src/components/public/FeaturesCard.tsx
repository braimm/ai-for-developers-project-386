import { Card, List, Stack, Text, Title } from '@mantine/core';

export function FeaturesCard() {
  return (
    <Card withBorder radius="xl" padding="xl" shadow="sm" bg="rgba(255, 255, 255, 0.86)">
      <Stack gap="md">
        <Title order={2}>Возможности</Title>
        <List spacing="sm" c="dimmed">
          <List.Item>Выбор типа события и удобного времени для встречи.</List.Item>
          <List.Item>Быстрое бронирование с подтверждением и дополнительными заметками.</List.Item>
          <List.Item>Управление типами встреч и просмотр предстоящих записей в админке.</List.Item>
        </List>
        <Text c="dimmed">Собираем public flow поверх API-контракта, чтобы UI сразу работал с реальными endpoint.</Text>
      </Stack>
    </Card>
  );
}

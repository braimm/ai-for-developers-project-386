import { Badge, Card, Container, Group, Stack, Text, Title } from '@mantine/core';

export function App() {
  return (
    <Container size="sm" py="xl">
      <Card withBorder radius="md" padding="xl">
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={1}>Calendar Booking</Title>
              <Text c="dimmed" mt="xs">
                Frontend scaffold for the API-first booking project.
              </Text>
            </div>
            <Badge variant="light">Vite + Mantine</Badge>
          </Group>
          <Text>
            The backend contract lives in <code>typespec/main.tsp</code>, while this app is bootstrapped in
            <code> frontend/</code> for the future guest and owner flows.
          </Text>
        </Stack>
      </Card>
    </Container>
  );
}

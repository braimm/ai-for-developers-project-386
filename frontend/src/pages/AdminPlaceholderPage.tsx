import { Button, Card, Container, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';

export function AdminPlaceholderPage() {
  return (
    <Container size="sm" py={80}>
      <Card withBorder radius="xl" padding="xl">
        <Stack gap="md">
          <Title order={1}>Админка будет следующим шагом</Title>
          <Text c="dimmed">Сейчас собираем только guest flow по TypeSpec-контракту и примерам интерфейса.</Text>
          <Button component={Link} to="/book" variant="light" color="orange" w="fit-content">
            Перейти к бронированию
          </Button>
        </Stack>
      </Card>
    </Container>
  );
}

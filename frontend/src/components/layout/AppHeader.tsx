import { ActionIcon, Box, Container, Group, Text } from '@mantine/core';
import { NavLink } from 'react-router-dom';

export function AppHeader() {
  return (
    <Box h="100%" bg="white" bd="0" style={{ borderBottom: '1px solid #d9e2ef' }}>
      <Container size="lg" h="100%">
        <Group h="100%" justify="space-between">
          <Group gap="sm">
            <ActionIcon color="orange" variant="subtle" radius="xl" size="lg" aria-hidden>
              <Text fw={700}>◎</Text>
            </ActionIcon>
            <Text component={NavLink} to="/" td="none" c="dark" fw={700} size="lg">
              Calendar
            </Text>
          </Group>
          <Group gap="md">
            <Text component={NavLink} to="/book" td="none" c="dimmed" fw={500}>
              Записаться
            </Text>
            <Text component={NavLink} to="/admin" td="none" c="dimmed" fw={500}>
              Админка
            </Text>
          </Group>
        </Group>
      </Container>
    </Box>
  );
}

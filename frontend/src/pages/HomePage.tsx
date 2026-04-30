import { Badge, Button, Container, Grid, Group, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import { FeaturesCard } from '../components/public/FeaturesCard';

export function HomePage() {
  return (
    <Container size="lg" py={56}>
      <Grid gutter="xl" align="stretch">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack justify="center" h="100%" gap="xl" py={{ base: 24, md: 48 }}>
            <Badge radius="xl" color="blue" variant="light" w="fit-content">
              БЫСТРАЯ ЗАПИСЬ НА ЗВОНОК
            </Badge>
            <Stack gap="md">
              <Title order={1} fz={{ base: 48, md: 64 }} lh={1}>
                Calendar
              </Title>
              <Text c="dimmed" fz="xl" maw={560}>
                Забронируйте встречу за минуту: выберите тип события и удобное время.
              </Text>
            </Stack>
            <Group>
              <Button component={Link} to="/book" color="orange" radius="xl" size="lg">
                Записаться
              </Button>
            </Group>
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <FeaturesCard />
        </Grid.Col>
      </Grid>
    </Container>
  );
}

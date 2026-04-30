import { AppShell, Box } from '@mantine/core';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppHeader } from './components/layout/AppHeader';
import { AdminPlaceholderPage } from './pages/AdminPlaceholderPage';
import { BookingConfirmPage } from './pages/BookingConfirmPage';
import { BookingSuccessPage } from './pages/BookingSuccessPage';
import { EventTypePage } from './pages/EventTypePage';
import { HomePage } from './pages/HomePage';
import { PublicCatalogPage } from './pages/PublicCatalogPage';

export function App() {
  return (
    <AppShell header={{ height: 60 }} padding={0}>
      <AppShell.Header>
        <AppHeader />
      </AppShell.Header>
      <AppShell.Main>
        <Box mih="calc(100vh - 60px)" bg="#f7f9fc">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/book" element={<PublicCatalogPage />} />
            <Route path="/book/:eventTypeId" element={<EventTypePage />} />
            <Route path="/book/:eventTypeId/confirm" element={<BookingConfirmPage />} />
            <Route path="/bookings/success" element={<BookingSuccessPage />} />
            <Route path="/admin" element={<AdminPlaceholderPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}

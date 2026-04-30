# UI Plan

## Контекст
- На этом шаге собираем только public flow.
- Источник истины для API: `typespec/main.tsp` и `typespec/calendar-booking.openapi.yaml`.
- Frontend должен работать только через API-контракт.
- Admin UI пока не реализуем.
- Backend может запускаться отдельно; frontend не должен зависеть от локальных mock-данных внутри UI.

## Public Flow
1. `/` - главная страница
2. `/book` - каталог типов событий
3. `/book/:eventTypeId` - выбор даты и слота
4. `/book/:eventTypeId/confirm` - форма бронирования
5. `/bookings/success` - экран успешной записи

## API Endpoints
- `GET /public/profile`
- `GET /public/event-types`
- `GET /public/event-types/{eventTypeId}`
- `GET /public/event-types/{eventTypeId}/slots`
- `POST /public/bookings`

## UI Priorities
1. Router and app shell
2. Public catalog
3. Event type page with slot selection
4. Booking form
5. Success page
6. Visual polish against `.prompt` mockups

## Minimal Dependencies
- `react-router-dom`

## File Plan
- `src/main.tsx` - router bootstrap
- `src/App.tsx` - layout and routes
- `src/api/client.ts` - fetch helper
- `src/api/public.ts` - public API methods
- `src/types/api.ts` - minimal contract types
- `src/pages/HomePage.tsx`
- `src/pages/PublicCatalogPage.tsx`
- `src/pages/EventTypePage.tsx`
- `src/pages/BookingConfirmPage.tsx`
- `src/pages/BookingSuccessPage.tsx`
- `src/pages/AdminPlaceholderPage.tsx`
- `src/components/layout/AppHeader.tsx`
- `src/components/public/HostCard.tsx`
- `src/components/public/EventTypeCard.tsx`
- `src/components/public/SlotList.tsx`
- `src/components/public/BookingForm.tsx`
- `src/lib/slots.ts`

## State Decisions
- Без глобального store.
- Локальный state на страницах.
- Выбранный слот передавать через route state или query params.
- Ошибки API нормализовать в `src/api/client.ts`.

## Known Risks
- Может потребоваться доработка контракта под реальный UI.
- Слоты приходят плоским списком, фронтенд сам группирует их по датам.
- Нужно аккуратно обработать `409 slot_already_booked`.

## First Implementation Slice
1. Add `react-router-dom`
2. Build app shell
3. Implement `/`
4. Implement `/book`
5. Connect `GET /public/profile` and `GET /public/event-types`

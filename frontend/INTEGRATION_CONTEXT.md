# Integration Context

## Current State
- Public UI flow is implemented in `frontend/`.
- The flow includes `/`, `/book`, `/book/:eventTypeId`, `/book/:eventTypeId/confirm`, and `/bookings/success`.
- Frontend currently supports both local mocks and real backend requests through `src/api/public.ts`.
- Real backend mode is now the default.
- Mock mode is available only when `VITE_USE_MOCKS=true` is passed.

## Backend State
- `main.py` now implements the in-memory API described by `typespec/main.tsp`.
- Implemented endpoints:
  - `GET /owner/profile`
  - `GET /owner/event-types`
  - `POST /owner/event-types`
  - `GET /owner/bookings`
  - `GET /public/profile`
  - `GET /public/event-types`
  - `GET /public/event-types/{eventTypeId}`
  - `GET /public/event-types/{eventTypeId}/slots`
  - `POST /public/bookings`
- Business rules already implemented:
  - 14-day booking window
  - slot conflict detection across all event types
  - in-memory data storage only
  - CORS for `localhost:5173`

## Key Frontend Files
- `src/api/public.ts` - switches between mocks and real API
- `src/api/mock/public.ts` - local mock data and mock booking flow
- `src/pages/PublicCatalogPage.tsx`
- `src/pages/EventTypePage.tsx`
- `src/pages/BookingConfirmPage.tsx`
- `src/pages/BookingSuccessPage.tsx`
- `src/lib/slots.ts`

## How To Resume Integration
1. Start backend: `make run`
2. Start frontend against real backend: `make frontend-dev`
3. Walk through:
   - `/book`
   - event type page
   - slot selection
   - booking confirmation
   - success page
4. Fix only the concrete mismatches found during that manual flow.

## Latest Verified Result
- Backend import check passes via `make check-import`.
- Frontend production build passes in real API mode.
- Public endpoints verified:
  - `GET /public/profile`
  - `GET /public/event-types`
  - `GET /public/event-types/{eventTypeId}`
  - `GET /public/event-types/{eventTypeId}/slots`
- Booking flow verified against the real backend:
  - first booking request returns `201`
  - repeated booking of the same slot returns `409 slot_already_booked`

## Known Integration Risks
- Frontend mocks currently use fixed 2026 demo dates; backend generates slots from the current date.
- Confirm flow relies on route state, so direct reload on confirm/success pages falls back to a warning/redirect.
- Owner/admin UI is still not implemented.

## If Real Backend Is Not Ready
- Re-enable mock mode by setting `VITE_USE_MOCKS=true` explicitly.

## Next Natural Backend Step After Integration
- Replace in-memory storage with SQLite while preserving the current API contract and booking conflict rule.

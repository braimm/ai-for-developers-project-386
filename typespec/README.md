# TypeSpec contract

This directory contains the API-first contract for the calendar booking application.

Covered scenarios:
- owner profile access
- owner event type creation and listing
- owner upcoming bookings across all event types
- guest public owner profile for booking screens
- guest public event type listing
- guest event type details for the booking screen
- guest slot discovery for a chosen event type
- guest slot discovery within the default 14-day booking window
- guest booking creation
- slot occupancy rule via `409 slot_already_booked`

Main files:
- `main.tsp` - domain models and API operations
- `tspconfig.yaml` - OpenAPI emitter config
- `package.json` - local TypeSpec toolchain

Commands:

```bash
make tsp-install
make tsp-compile
```

Low-level commands:

```bash
npm --prefix typespec install
npm --prefix typespec run compile
```

Generated output:
- `calendar-booking.openapi.yaml`

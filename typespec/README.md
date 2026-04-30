# TypeSpec contract

This directory contains the API-first contract for the calendar booking application.

Covered scenarios:
- owner profile access
- owner event type creation and listing
- owner upcoming bookings across all event types
- guest public event type listing
- guest slot discovery for a chosen event type
- guest booking creation
- slot occupancy rule via `409 slot_already_booked`

Main files:
- `main.tsp` - domain models and API operations
- `tspconfig.yaml` - OpenAPI emitter config

To generate OpenAPI after installing the TypeSpec toolchain:

```bash
tsp compile .
```

import { test, expect, DEFAULT_EVENT_TYPE_ID, GUEST_NAME, GUEST_EMAIL } from './fixtures';

test.describe('Booking conflict', () => {
  test('duplicate booking of the same slot returns conflict via API', async ({ backendUrl }) => {
    const eventTypesRes = await fetch(`${backendUrl}/public/event-types`);
    const eventTypes = await eventTypesRes.json();
    const eventType = eventTypes.find((et: { id: string }) => et.id === DEFAULT_EVENT_TYPE_ID) ?? eventTypes[0];

    const slotsRes = await fetch(`${backendUrl}/public/event-types/${eventType.id}/slots`);
    const slots = await slotsRes.json();
    const availableSlot = slots.find((s: { available: boolean }) => s.available);

    test.skip(!availableSlot, 'No available slots to test conflict');

    const firstBookingRes = await fetch(`${backendUrl}/public/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventTypeId: eventType.id,
        startsAt: availableSlot.startsAt,
        guestName: 'Первый Гость',
        guestEmail: 'first@example.com',
      }),
    });
    expect(firstBookingRes.status).toBe(201);

    const secondBookingRes = await fetch(`${backendUrl}/public/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventTypeId: eventType.id,
        startsAt: availableSlot.startsAt,
        guestName: GUEST_NAME,
        guestEmail: GUEST_EMAIL,
      }),
    });
    expect(secondBookingRes.status).toBe(409);

    const errorBody = await secondBookingRes.json();
    expect(errorBody.code).toBe('slot_already_booked');
  });
});

import { test, expect, DEFAULT_EVENT_TYPE_ID, GUEST_NAME, GUEST_EMAIL, GUEST_NOTES } from './fixtures';

test.describe('Owner bookings', () => {
  test('owner sees guest booking on upcoming bookings page', async ({ page, backendUrl }) => {
    const eventTypesRes = await fetch(`${backendUrl}/public/event-types`);
    const eventTypes = await eventTypesRes.json();
    const eventType = eventTypes.find((et: { id: string }) => et.id === DEFAULT_EVENT_TYPE_ID) ?? eventTypes[0];

    const slotsRes = await fetch(`${backendUrl}/public/event-types/${eventType.id}/slots`);
    const slots = await slotsRes.json();
    const availableSlot = slots.find((s: { available: boolean }) => s.available);

    test.skip(!availableSlot, 'No available slots to create a test booking');

    const bookingRes = await fetch(`${backendUrl}/public/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventTypeId: eventType.id,
        startsAt: availableSlot.startsAt,
        guestName: GUEST_NAME,
        guestEmail: GUEST_EMAIL,
        notes: GUEST_NOTES,
      }),
    });
    expect(bookingRes.status).toBe(201);

    await page.goto('/admin/bookings');

    await expect(page.getByRole('heading', { name: 'Tota' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Предстоящие записи' })).toBeVisible();

    await expect(page.getByText(GUEST_NAME)).toBeVisible();
    await expect(page.getByText(GUEST_EMAIL)).toBeVisible();
  });
});

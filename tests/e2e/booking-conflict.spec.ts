import { test, expect, DEFAULT_EVENT_TYPE_ID, GUEST_NAME, GUEST_EMAIL } from './fixtures';

test.describe('Booking conflict', () => {
  test('duplicate booking of the same slot returns conflict', async ({ page, backendUrl }) => {
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

    await page.goto(`/book/${eventType.id}`);

    await expect(page.getByRole('heading', { name: eventType.title })).toBeVisible();

    await page.waitForTimeout(1000);

    const dayKey = new Date(availableSlot.startsAt).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
    });
    const dayButton = page.getByRole('button').filter({ hasText: dayKey }).first();
    if (await dayButton.isVisible()) {
      await dayButton.click();
      await page.waitForTimeout(500);
    }

    const bookedSlotText = page.locator('text=Занято').first();
    await expect(bookedSlotText).toBeVisible();

    const availableSlotButton = page.getByRole('button', { name: 'Свободно' }).first();
    if (await availableSlotButton.isVisible()) {
      await availableSlotButton.click();
      await page.getByRole('button', { name: 'Продолжить' }).click();

      await page.getByLabel('Ваше имя').fill(GUEST_NAME);
      await page.getByLabel('Email').fill(GUEST_EMAIL);
      await page.getByRole('button', { name: 'Подтвердить бронирование' }).click();

      const conflictAlert = page.getByText('Selected slot is already booked');
      await expect(conflictAlert).toBeVisible({ timeout: 10000 });
    }
  });
});

import { test, expect, DEFAULT_EVENT_TYPE_ID, GUEST_NAME, GUEST_EMAIL, GUEST_NOTES } from './fixtures';

test.describe('Main booking flow', () => {
  test('guest can browse catalog, select slot, and create booking', async ({ page }) => {
    await page.goto('/book');

    await expect(page.getByRole('heading', { name: 'Выберите тип события' })).toBeVisible();

    const eventTypeCard = page.locator('a', { hasText: 'Встреча 15 минут' }).first();
    await expect(eventTypeCard).toBeVisible();
    await eventTypeCard.click();

    await expect(page.locator('h1', { hasText: 'Встреча 15 минут' })).toBeVisible();

    await page.waitForTimeout(1500);

    const dayButtons = page.getByRole('button').filter({ hasText: /января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря/ });
    await expect(dayButtons.first()).toBeVisible({ timeout: 10000 });
    await dayButtons.first().click();

    await page.waitForTimeout(500);

    const availableSlotButton = page.getByRole('button', { name: 'Свободно' }).first();
    await expect(availableSlotButton).toBeVisible({ timeout: 10000 });
    await availableSlotButton.click();

    await expect(page.getByRole('button', { name: 'Выбрано' })).toBeVisible();

    const continueButton = page.getByRole('button', { name: 'Продолжить' });
    await expect(continueButton).toBeEnabled();
    await continueButton.click();

    await expect(page.getByRole('heading', { name: 'Подтверждение бронирования' })).toBeVisible();

    const nameInput = page.getByLabel('Ваше имя');
    await nameInput.fill(GUEST_NAME);

    const emailInput = page.getByLabel('Email');
    await emailInput.fill(GUEST_EMAIL);

    const notesInput = page.getByLabel('Комментарий');
    await notesInput.fill(GUEST_NOTES);

    const submitButton = page.getByRole('button', { name: 'Подтвердить бронирование' });
    await submitButton.click();

    await expect(page.locator('h1', { hasText: 'Спасибо, встреча запланирована' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Бронирование подтверждено')).toBeVisible();
    await expect(page.getByText(GUEST_NAME).first()).toBeVisible();
    await expect(page.getByText(GUEST_EMAIL).first()).toBeVisible();
  });
});

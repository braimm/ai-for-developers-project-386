import { test as base } from '@playwright/test';

export type TestFixtures = {
  backendUrl: string;
};

export const test = base.extend<TestFixtures>({
  backendUrl: 'http://localhost:8000',
});

export { expect } from '@playwright/test';

export const GUEST_NAME = 'Тестовый Гость';
export const GUEST_EMAIL = 'guest-test@example.com';
export const GUEST_NOTES = 'Комментарий из e2e теста';

export const DEFAULT_EVENT_TYPE_ID = '15-min-call';

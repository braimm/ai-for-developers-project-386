import type { ApiError } from '../types/api';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    let payload: ApiError | null = null;

    try {
      payload = (await response.json()) as ApiError;
    } catch {
      payload = null;
    }

    throw {
      code: payload?.code ?? 'request_failed',
      message: payload?.message ?? 'Request failed',
      status: response.status,
    } satisfies ApiError;
  }

  return (await response.json()) as T;
}

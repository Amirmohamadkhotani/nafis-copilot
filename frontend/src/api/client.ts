const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api').replace(/\/$/, '');

export class ApiError extends Error {
  readonly status: number;
  readonly path: string;

  constructor(
    status: number,
    path: string,
  ) {
    super(`API error ${status}: ${path}`);
    this.status = status;
    this.path = path;
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new ApiError(res.status, path);
  return res.json();
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new ApiError(res.status, path);
  return res.json();
}

export { API_BASE };

const API_URLS = [
  process.env.NEXT_PUBLIC_API_URL,
  process.env.NEXT_PUBLIC_API_BASE_URL,
  'http://trianglecart.test:90',
  'http://localhost:90',
  'http://127.0.0.1:90',
].filter(Boolean) as string[];

export const apiBaseUrl = API_URLS[0] ?? '';

export function apiUrl(path: string): string {
  return `${apiBaseUrl}${path}`;
}

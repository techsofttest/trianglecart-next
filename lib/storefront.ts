const API_URLS = [
    process.env.NEXT_PUBLIC_API_URL,
    'http://trianglecart.test:90',
    'http://localhost:90',
    'http://127.0.0.1:90',
].filter(Boolean) as string[];

export const storefrontUrl = (path: string) => `${API_URLS[0]}${path}`;

export async function fetchStorefront<T>(path: string): Promise<T | null> {
    const attemptedErrors: unknown[] = [];

    for (const baseUrl of API_URLS) {
        try {
            const res = await fetch(`${baseUrl}${path}`, { cache: 'no-store' });
            if (res.ok) {
                return await res.json();
            }

            attemptedErrors.push(new Error(`HTTP ${res.status} from ${baseUrl}${path}`));
        } catch (error) {
            attemptedErrors.push(error);
        }
    }

    console.error(`Failed to fetch ${path} from all storefront URLs:`, attemptedErrors);
    return null;
}

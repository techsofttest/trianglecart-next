import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Triangle Cart',
    short_name: 'TriangleCart',
    description: 'Shop premium Indian and South Asian groceries, fresh produce, and spices. Delivering across Australia.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#00723D',
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}

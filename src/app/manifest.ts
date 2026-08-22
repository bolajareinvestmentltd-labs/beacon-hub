import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Beacon Hub',
    short_name: 'Beacon Hub',
    description: 'World-class news journalism with premium editorial design',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B0B0B',
    theme_color: '#0B0B0B',
    icons: [
      { src: '/logo-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/logo-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
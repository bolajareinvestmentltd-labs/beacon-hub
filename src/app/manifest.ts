import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Beacon Hub',
    short_name: 'Beacon Hub',
    description: 'World-class news journalism with premium editorial design',
    start_url: '/',
    scope: '/',
    id: '/?source=pwa',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone', 'browser'],
    orientation: 'portrait-primary',
    categories: ['news', 'lifestyle', 'productivity'],
    background_color: '#F2F7F3',
    theme_color: '#F2F7F3',
    icons: [
      { src: '/logo-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/logo-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/logo-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/logo-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
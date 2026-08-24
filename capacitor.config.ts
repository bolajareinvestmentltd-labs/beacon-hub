import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.beaconhub.app',
  appName: 'Beacon Hub',
  webDir: 'public',
  server: {
    url: process.env.CAPACITOR_SERVER_URL ?? 'https://www.beacon-hub.com.ng',
    androidScheme: 'https',
  },
};

export default config;
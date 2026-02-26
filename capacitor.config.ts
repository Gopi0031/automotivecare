import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.automotive.app',
  appName: 'automotive',
  webDir: 'www',
  server: {
    url: 'https://automotivecarcare01.vercel.app',
    cleartext: false
  }
};

export default config;
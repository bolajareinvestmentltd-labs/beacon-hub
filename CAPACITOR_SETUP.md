# Beacon Hub Mobile App Setup

Beacon Hub uses Capacitor as its Android and iOS app wrapper. The app keeps its Next.js server features, database access, authentication, ads, and scheduled jobs on the deployed HTTPS site.

## Before generating native projects

1. Deploy the current Next.js app to `https://www.beacon-hub.com.ng` (or set `CAPACITOR_SERVER_URL` to the deployed URL).
2. Confirm the deployed URL loads correctly in a browser.
3. Keep the production environment variables configured in the hosting provider. Native packaging does not move server secrets into the mobile app.

## Generate Android

```bash
npx cap add android
npm run cap:sync
npm run cap:android
```

Open the generated `android/` project in Android Studio, set the release application ID and signing key, then build an Android App Bundle (`.aab`) for Google Play Console.

## Generate iOS

```bash
npx cap add ios
npm run cap:sync
npm run cap:ios
```

iOS project generation and App Store signing require macOS with Xcode. The iOS project can be generated from another machine or CI after the repository is pushed.

## Updating the mobile app

After web changes are deployed:

```bash
npm run cap:sync
```

Because the shell uses the deployed URL, content and server fixes are available without rebuilding the native binary. Rebuild and resubmit the native app when changing app icons, permissions, native plugins, or store metadata.

## Store requirements

- Configure a unique production bundle/application ID before release.
- Create signed release builds, not debug builds.
- Add store screenshots, privacy policy URL, support URL, and content rating information.
- Test login, article previews, ads, deals, and external links on physical devices.
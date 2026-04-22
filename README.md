# Hoopify 🏀

Hoopify is a React Native / [Expo](https://expo.dev) mobile application for discovering and organizing pickup basketball games. This README walks you through the prerequisites, setup, and deployment workflow needed to get the app running locally or on a physical device.

## Try the Live App

Scan the appropriate QR code below with your device to open the latest live build of Hoopify. On iOS, use your iPhone camera (or scan from within Expo Go). On Android, scan from within the Expo Go app.

<table align="center">
  <tr>
    <td align="center"><strong>iOS</strong></td>
    <td align="center"><strong>Android</strong></td>
  </tr>
  <tr>
    <td align="center"><img src="assets/readme/ios-qr.png" alt="Hoopify iOS QR code" width="240" /></td>
    <td align="center"><img src="assets/readme/android-qr.png" alt="Hoopify Android QR code" width="240" /></td>
  </tr>
</table>

## Prerequisites

Before you begin, make sure the following are installed and available:

- **Node.js** — a version compatible with **Expo SDK 54**
- **Google Places API key** — required to power location search and map features (or use the cloud-deployed QR code for quick testing without a key)
- **Expo CLI** — invoked via `npx expo` (no global install required)
- **EAS CLI** — install globally:
  ```bash
  npm install -g eas-cli
  ```
- **Expo Go** — install on your physical Android or iOS device from the Play Store or App Store

## Deployment Workflow

Our deployment workflow follows the steps below.

### 1. Clone the repository from GitHub

```bash
git clone https://github.com/UF-Hoopify/Hoopify.git
cd Hoopify
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables to initialize the Google Maps API key

For local testing, create a `.env` file at the project root and add the following line with a valid API key:

```bash
EXPO_PUBLIC_GOOGLE_PLACES_KEY=<your-google-places-api-key>
```

### 4. Start the frontend application and backend service

```bash
npx expo start
```

### 5. Run the application on your mobile phone using Expo Go

After running `npx expo start`, Metro bundler launches and displays a QR code in the terminal. Scan the QR code with the **Expo Go** app on a physical Android or iOS device to open Hoopify.

## Try the Live App

Scan the appropriate QR code below with your device to open the latest live build of Hoopify. On iOS, use your iPhone camera (or scan from within Expo Go). On Android, scan from within the Expo Go app.

<table align="center">
  <tr>
    <td align="center"><strong>iOS</strong></td>
    <td align="center"><strong>Android</strong></td>
  </tr>
  <tr>
    <td align="center"><img src="assets/readme/ios-qr.png" alt="Hoopify iOS QR code" width="240" /></td>
    <td align="center"><img src="assets/readme/android-qr.png" alt="Hoopify Android QR code" width="240" /></td>
  </tr>
</table>

You'll also find options in the terminal output to open the app in:

- a [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- an [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- an [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

## Learn More

To learn more about developing with Expo, see:

- [Expo documentation](https://docs.expo.dev/) — fundamentals and advanced [guides](https://docs.expo.dev/guides)
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/) — a step-by-step tutorial for building a project that runs on Android, iOS, and the web

## Community

- [Expo on GitHub](https://github.com/expo/expo) — view the open-source platform and contribute
- [Discord community](https://chat.expo.dev) — chat with Expo users and ask questions

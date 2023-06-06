# BruinSafe

[![React Native](https://img.shields.io/badge/React%20Native-v0.64.2-blue.svg)](https://facebook.github.io/react-native/)

BruinSafe is a mobile app that aims to enhance the personal safety of UCLA students by providing real-time location tracking equipped with walk requests with peers, nearby crime alerts, and crime report tracking.

## Table of Contents

- [BruinSafe](#bruinsafe)
  - [Table of Contents](#table-of-contents)
    - [Getting Started](#getting-started)
      - [Prerequisites](#prerequisites)
      - [Installation](#installation)
      - [Running](#running)
    - [Features](#features)

### Getting Started

These instructions will get you a copy of BruinSafe up and running on your local machine for development and testing purposes.

#### Prerequisites

- Node.js (>= version 18.0.0)
- npm (>= version 8.3.0)
- Expo CLI (>= version 6.3.0)
  - For installation instructions: <https://docs.expo.dev/more/expo-cli#installation>
- Expo Go (Mobile App)
  - Optional: Android Studio or Xcode (for running the app on emulator on   local device)

**Note: Do not use WSL2.0/WSL1.0 functionality**

#### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/jtcheng26/ucla-cs35l-bruinsafe.git
    ```

2. Install dependencies:

   ```bash
   npm install
   ```

   - Alternatively

        ```bash
        yarn install
        ```

#### Running

- Run:

    ```bash
    npm start
    ```

- On mobile device switch to same WIFI as local device
- On mobile device scan QR code:
  - If IOS scan using Camera App
  - If Android scan using Expo Go App
  - Certain networks may create issues, if so:
    - Stop hosting process on local device (Ctrl c)
    - Run:

        ```bash
        expo-cli start --tunnel
        ```

    - Repeat above steps

### Features

- **Crime Report:** Alert users of nearby crimes in real-time. Users can report crimes via a simple report tab.
- **Walk Requests:** Allow users to send walk requests to designated contacts who can monitor their safety and progress.
- **Built-in Navigation:** Provide navigation functionality so that users never have to switch applications, allowing continous safety.
- **Authenticated Login:** Authenticate users for secure access to the app, as well as preventing illegitimate reports.

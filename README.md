# BruinSafe

[![React Native](https://img.shields.io/badge/React%20Native-v0.64.2-blue.svg)](https://facebook.github.io/react-native/)

Los Angeles is not pedestrian friendly.

With high crime rates and a car reliant infrastruction, walking around LA
is often dangerous. However, what do we do when walking is unavoidable?

Our solution: BruinSafe.

BruinSafe is a mobile app that aims to enhance the personal safety of UCLA students by providing real-time location tracking equipped with walk requests with peers, nearby crime alerts, and crime report tracking.

## Table of Contents

- [BruinSafe](#bruinsafe)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running](#running)
  - [Features](#features)
  - [Usage](#usage)

## Prerequisites

- Node.js (>= v18.0.0)
- npm (>= v8.3.0)
- Expo CLI (>= v6.3.0)
  - For installation instructions: [Expo CLI Installation](https://docs.expo.dev/more/expo-cli#installation)
- Expo Go (Mobile App)

**Note: Do not use WSL2.0/WSL1.0 functionality**

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/jtcheng26/ucla-cs35l-bruinsafe.git
    ```

2. Install dependencies by running:

   ```bash
   npm install
   ```

   - Alternatively run:

        ```bash
        yarn install
        ```

## Running

- Run:

    ```bash
    npm start
    ```

- On mobile device switch to same WIFI as local device
- On mobile device scan QR code:
  - If IOS scan using Camera App
  - If Android scan using Expo Go App
  - Certain networks may create issues, if so:
    - Stop hosting on local device by typing **'CTRL + C'**
    - Run:

        ```bash
        expo-cli start --tunnel
        ```

    - Repeat above steps

## Features

- **Crime Report:** Alert users of nearby crimes in real-time. Users can report crimes via a simple report tab.
- **Walk Requests:** Allow users to send walk requests to designated contacts who can monitor their safety and progress.
- **Built-in Navigation:** Provide navigation functionality so that users never have to switch applications, allowing continous safety.
- **Authenticated Login:** Authenticate users for secure access to the app, as well as preventing illegitimate reports. Uses SHA-256 hash for password protection.

## Usage

- **Navigation:** Use navigation bar to navigate to pages.
- **Sign Up:** Sign up for a BruinSafe account with email and password.
- **Walk Around:** Notice real-time location tracking.

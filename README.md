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
  - [Issues](#issues)

## Prerequisites

- Node.js (>= v18.0.0)
- npm (>= v8.3.0)
- Expo CLI (>= v6.3.0)
  - For installation instructions: [Expo CLI Installation](https://docs.expo.dev/more/expo-cli#installation)
- Expo Go (Mobile App)

**Note: Do not use WSL2.0/WSL1.0 functionality**

## Getting Started

### Installation

1. Clone the repository and enter it:

   ```shell
   git clone https://github.com/jtcheng26/ucla-cs35l-bruinsafe.git
   cd ./ucla-cs35L-bruinsafe
    ```

2. Install dependencies by running:

   ```shell
   npm install
   ```

### Setup MongoDB

If you do not have a prexisting MongoDB Atlas Account, create one for free [here](https://www.mongodb.com/cloud/atlas/register?psafe_param=1&utm_content=rlsapostreg&utm_source=google&utm_campaign=search_gs_pl_evergreen_atlas_general_retarget-brand-postreg_gic-null_amers-us-ca_ps-all_desktop_eng_lead&utm_term=&utm_medium=cpc_paid_search&utm_ad=&utm_ad_campaign_id=14383025495&adgroup=129270225274&cq_cmp=14383025495&gad=1&gclid=CjwKCAjwsvujBhAXEiwA_UXnAA71bmfDMgORfSGo3clw4b96pzA9ZFuofWJjCbIJhJtGAmcWKlnG5xoCehgQAvD_BwE).

Once logged in, navigate to Dashboard. Under the Deployment header, click ``Database``.

Click Green Button with message ``Build a Database``.

Choose which deployment option you would like to use. Shared Clusters are free.

Choose your favorite Cloud Provider and Region. Recommended to stick with the default (AWS).

Press Green Button with message ``Create Cluster``.

While waiting for Cluster Provisioning, navigate to `Security` header and select `Database Access`. Click `Add New Database User`. Fill out form.

Under `Security` header, select `Network Access` Tab. Press `Add IP Address`.

Select either `Add Current IP Address` or `Allow Access From Anywhere`. Press confirm.

Wait for Cluster Provisioning to finish.

Once finished, press `Connect`. Under `Connect to your application`, select `Drivers`.

Follow driver installation instructions. Copy your connection string.
Should be in the format: 
``mongodb+srv://<username>:<password>@cluster0.qan00x8.mongodb.net/?retryWrites=true&w=majority``.

**Remember to replace &lt;username&gt; and &lt;password&gt; with your login credentials.**

Within ucla-cs35L-bruinsafe repository, navigate to `backend` directory:
``cd backend``

Within `backend` create and enter `.env` file.

Within `.env` file, create ``DATABASE_URL`` variable and assign it with your connection string.
Should look like:

``` shell
DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.qan00x8.mongodb.net/?retryWrites=true&w=majority"
```

Don't forget to replace &lt;username&gt; and &lt;password&gt; with your unique login credentials.

Database should be fully setup for running app.

If you run into any issues, visit [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/getting-started/)

### Running

- Run:

    ``` shell
    npm start
    ```

- On mobile device switch to same WIFI as local device
- On mobile device scan QR code:
  - If IOS scan using Camera App
  - If Android scan using Expo Go App
  - Certain networks may create issues, if so:
    - Stop hosting on local device by typing `CTRL-C`
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

## Issues

For any issues please contact one of the developers:

[Jeffrey Cheng](mailto:jeffreycheng26@ucla.edu)
[Pranav Puranam](mailto:pranavp21@ucla.edu)
[Darlina Williams](mailto:darlinawilliams@ucla.edu)
[Bach Ngo](mailto:bachn463@ucla.edu)
[Abhi Morumpalle](mailto:abhim21@g.ucla.edu)

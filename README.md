# Tele-Split

![Tele-Split](./cover.png)

## Description

Tele-Split is a **Telegram bot** that allows you to split bills with your friends. It is built with the Telegram Web App and uses the blockchain to enable transactions.

Telegram bots are becoming increasingly popular, now extending support to the TON ecosystem. However, there's a growing demand for EVM-based features in Telegram web apps and games. With a Telegram bot, we can easily build online stores, games, and enable seamless in-app payments using an EVM wallet. This functionality supports not just B2C models, but also C2C social interactions.

An example of this is TeleSplit, inspired by [_Splitwise_](https://www.splitwise.com/). When people travel together, they often need to track shared expenses, but Splitwise only records debts and doesn't facilitate payments. This creates difficulty in tracking finances and settling debts automatically.

TeleSplit addresses these issues by:

1. Exploring a C2C business model using Telegram bots.
2. Completing the Splitwise functionality by allowing users to track debts and pay each other easily within the app.

## Run the project

1. Clone the repository
2. Run `npm install`
3. Create a `.env` file with the following variables:
    - `MONGODB_URI`: a MongoDB URI
4. Run `npm run dev`

## Technologies used

-   [**Dynamic wallet**](https://www.dynamic.xyz/): a wallet component to connect to other wallets and also use web2 oauth to login
-   [**Telegram Web App SDK**](https://core.telegram.org/bots/webapps): A telegram web app SDK to interact with the telegram API
-   [**Circle**](https://www.circle.com/en/): Mock USDC for spliting bills, it can be extended to real USDC
-   [**AirDAO**](https://airdao.io/): A L1 blockchain to deploy mock USDC ERC20 token

## Features

-   In-app cloud storage for the user's mnemonic and private key
-   In-app biometric authentication to protect the user's private key
-   Plug-in component to connect to other wallets
-   Create groups with your friends
-   Invite your friends within Telegram
-   Send USDC to other users
-   Receive USDC from other users
-   Split bills with your friends

# EdTech Messenger

This service fetches educational technology news summaries from MongoDB (created by the EdTech Scraper) and sends them via WhatsApp.

## Features

- Connects to WhatsApp Web using whatsapp-web.js
- Fetches pending messages from MongoDB
- Sends messages to configured recipients
- Updates message status after sending (sent or failed)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/edtech-messenger.git
cd edtech-messenger
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```
# MongoDB connection string (same as the scraper project)
MONGODB_URI=mongodb+srv://username:password@cluster0.example.mongodb.net/edtech_db

# WhatsApp recipient phone number (international format without + or spaces)
WHATSAPP_RECIPIENT=1234567890
```

## Usage

To run the messenger:

```bash
npm start
```

On first run, you'll need to authenticate with WhatsApp by scanning a QR code. After successful authentication, the session will be saved to MongoDB.

## Authentication

The WhatsApp client uses RemoteAuth with MongoDB storage for session data. This means:

- You only need to scan the QR code once
- The session persists between runs
- The application can run headlessly after initial authentication

## Running on a Schedule

To send messages daily, set up a cron job:

```bash
# Run every day at 9 AM (after the scraper has run)
0 9 * * * cd /path/to/edtech-messenger && npm start
```

## Dependencies

- whatsapp-web.js - WhatsApp Web client
- wwebjs-mongo - MongoDB session storage for whatsapp-web.js
- qrcode-terminal - Display QR code in terminal for authentication
- mongoose - MongoDB interaction

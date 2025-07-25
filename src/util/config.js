import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Configuration object
const config = {
  // MongoDB
  mongodb: {
    uri: process.env.MONGODB_URI
  },

  // WhatsApp
  whatsapp: {
    recipient: process.env.DEFAULT_RECIPIENT_NUMBER,
    clientId: "app2", // Unique client ID for WhatsApp session
  },

  // Message types
  messageTypes: {
    edtechSummary: "edtech_daily_summary",
  },
};

// Validate required configuration
function validateConfig() {
  const requiredVars = [
    { key: "mongodb.uri", name: "MONGODB_URI" },
    { key: "whatsapp.recipient", name: "WHATSAPP_RECIPIENT" },
  ];

  const missingVars = requiredVars.filter(({ key }) => {
    const parts = key.split(".");
    let value = config;

    for (const part of parts) {
      value = value[part];
      if (value === undefined || value === null || value === "") {
        return true;
      }
    }

    return false;
  });

  if (missingVars.length > 0) {
    const missing = missingVars.map((v) => v.name).join(", ");
    throw new Error(`Missing required environment variables: ${missing}`);
  }
}

export { config, validateConfig };

import dotenv from "dotenv";
import whatsappService from "./services/WhatsAppService.js";
import {
  fetchPendingMessage,
  markMessageAsSent,
  markMessageAsFailed,
} from "./services/messageService.js";

dotenv.config();

/**
 * Sends the EdTech daily summary message via WhatsApp
 */
async function sendEdTechSummary() {
  try {
    console.log("Starting EdTech Messenger service...");

    // Initialize WhatsApp service
    await whatsappService.initialize();
    console.log("WhatsApp service initialized");

    // Fetch the pending message from MongoDB
    const message = await fetchPendingMessage("edtech_daily_summary");

    if (!message) {
      console.log("No pending messages to send. Exiting...");
      return;
    }

    console.log(
      `Found pending message (ID: ${message._id}) generated at ${message.generatedAt}`
    );

    // Get recipient number from environment variables
    const recipientNumber = process.env.DEFAULT_RECIPIENT_NUMBER;

    if (!recipientNumber) {
      throw new Error("DEFAULT_RECIPIENT_NUMBER environment variable not set");
    }

    // Send the message via WhatsApp
    console.log(`Sending message to ${recipientNumber}...`);
    await whatsappService.sendMessage(recipientNumber, message.content);

    // Mark message as sent in the database
    await markMessageAsSent(message._id);

    console.log("Message sent successfully and marked as sent in database");
  } catch (error) {
    console.error("Error in EdTech Messenger:", error.message);

    // If we were processing a message and it failed, mark it as failed
    if (error.messageId) {
      await markMessageAsFailed(error.messageId, error.message);
    }
  } finally {
    // Close WhatsApp client connection
    await whatsappService.close();
    process.exit(0);
  }
}

// If run directly, execute the sendEdTechSummary function
if (process.argv[1] && process.argv[1].endsWith("index.js")) {
  sendEdTechSummary().catch((error) => {
    console.error("Unhandled error in messenger process:", error);
    process.exit(1);
  });
}

export { sendEdTechSummary };

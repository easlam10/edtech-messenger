import mongoose from "mongoose";
import Message from "../models/Message.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Connects to MongoDB if not already connected
 */
async function connectToDatabase() {
  if (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("Connected to MongoDB successfully");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw error;
    }
  }
}

/**
 * Fetches pending messages of a specific type from MongoDB
 * @param {string} messageType - Type of message to fetch
 * @returns {Promise<Object|null>} - The message document or null if not found
 */
async function fetchPendingMessage(messageType = "edtech_daily_summary") {
  try {
    await connectToDatabase();

    // Find the most recent pending message of the specified type
    const message = await Message.findOne({
      messageType,
      status: "pending",
    }).sort({ generatedAt: -1 });

    if (!message) {
      console.log(`No pending message found for type: ${messageType}`);
      return null;
    }

    return message;
  } catch (error) {
    console.error("Error fetching message:", error);
    throw error;
  }
}

/**
 * Marks a message as sent in the database
 * @param {string} messageId - The ID of the message to mark as sent
 * @returns {Promise<Object>} - The updated message document
 */
async function markMessageAsSent(messageId) {
  try {
    await connectToDatabase();

    // Update message status to sent
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { status: "sent" },
      { new: true }
    );

    if (!updatedMessage) {
      throw new Error(`Message with ID ${messageId} not found`);
    }

    console.log(`Message ${messageId} marked as sent`);
    return updatedMessage;
  } catch (error) {
    console.error("Error updating message status:", error);
    throw error;
  }
}

/**
 * Marks a message as failed in the database
 * @param {string} messageId - The ID of the message to mark as failed
 * @param {string} errorMessage - The error message
 * @returns {Promise<Object>} - The updated message document
 */
async function markMessageAsFailed(messageId, errorMessage) {
  try {
    await connectToDatabase();

    // Update message status to failed
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      {
        status: "failed",
        $set: { "metadata.errorMessage": errorMessage },
      },
      { new: true }
    );

    if (!updatedMessage) {
      throw new Error(`Message with ID ${messageId} not found`);
    }

    console.log(`Message ${messageId} marked as failed: ${errorMessage}`);
    return updatedMessage;
  } catch (error) {
    console.error("Error updating message status:", error);
    throw error;
  }
}

export { fetchPendingMessage, markMessageAsSent, markMessageAsFailed };

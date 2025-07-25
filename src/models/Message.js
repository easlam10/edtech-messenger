import mongoose from "mongoose";

// Define message schema for retrieving messages
// Note: This schema must match the one in the scraper project
const messageSchema = new mongoose.Schema({
  // Unique identifier for this type of message
  messageType: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  // Content of the message
  content: {
    type: String,
    required: true,
  },
  // Date the message was generated
  generatedAt: {
    type: Date,
    default: Date.now,
  },
  // Status of the message (pending, sent, failed)
  status: {
    type: String,
    enum: ["pending", "sent", "failed"],
    default: "pending",
  },
  // Metadata about the message
  metadata: {
    articleCount: Number,
    searchQuery: String,
    sources: [String],
  },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;

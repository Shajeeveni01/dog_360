// src/chatbot/MessageParser.js

class MessageParser {
    constructor(actionProvider) {
      this.actionProvider = actionProvider;
    }
  
    parse(message) {
      const lower = message.toLowerCase();
      if (
        lower.includes("skin") ||
        lower.includes("rash") ||
        lower.includes("itch")
      ) {
        this.actionProvider.handleOption("Skin Issue");
      } else if (lower.includes("blood")) {
        this.actionProvider.handleOption("Blood Report");
      } else if (lower.includes("remedy") || lower.includes("treatment")) {
        this.actionProvider.handleOption("Home Remedy");
      } else if (lower.includes("vet") || lower.includes("hospital")) {
        this.actionProvider.handleOption("Vet Hospital");
      } else if (lower.includes("pet shop")) {
        this.actionProvider.handleOption("Pet Shop");
      } else {
        this.actionProvider.showOptions();
      }
    }
  }
  
  export default MessageParser;
  
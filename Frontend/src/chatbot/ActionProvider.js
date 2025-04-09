// src/chatbot/ActionProvider.js
import { getYoutubeSearchUrl, getGoogleMapsSearchUrl } from "./helpers";

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleOption = (option) => {
    switch (option) {
      case "Skin Issue":
        this.sendBotMessage("You can upload a skin image in the Skin Detection section!");
        break;
      case "Blood Report":
        this.sendBotMessage("Visit the Blood Analysis section to upload your dog's report.");
        break;
      case "Home Remedy":
        const remedyUrl = getYoutubeSearchUrl("home remedy for dog skin disease");
        this.sendBotMessage(`Here's a YouTube search for remedies: ${remedyUrl}`);
        break;
      case "Vet Hospital":
        const vetUrl = getGoogleMapsSearchUrl("veterinary hospitals near me");
        this.sendBotMessage(`Find nearby veterinary hospitals: ${vetUrl}`);
        break;
      case "Pet Shop":
        const shopUrl = getGoogleMapsSearchUrl("pet shops near me");
        this.sendBotMessage(`Here are pet shops nearby: ${shopUrl}`);
        break;
      default:
        this.sendBotMessage("I didn't understand. Please choose from the available options.");
    }
  };

  showOptions = () => {
    const message = this.createChatBotMessage("Please select an option:", {
      widget: "options",
    });
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  sendBotMessage = (text) => {
    const message = this.createChatBotMessage(text);
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };
}

export default ActionProvider;

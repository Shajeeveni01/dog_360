// src/chatbot/ChatbotConfig.js
import { createChatBotMessage } from "react-chatbot-kit";
import Options from "./Options";
import ActionProvider from "./ActionProvider";
import MessageParser from "./MessageParser";

const config = {
  initialMessages: [
    createChatBotMessage("Hi! 🐶 How can I help you today?", {
      widget: "options",
    }),
  ],
  widgets: [
    {
      widgetName: "options",
      widgetFunc: (props) => <Options {...props} />,
    },
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: "#f43f5e",
    },
    chatButton: {
      backgroundColor: "#f43f5e",
    },
  },
};

export default config;

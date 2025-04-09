import { useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text:
        "Hi! 🐶 How can I help you today?\n\nOptions:\n1. Nearby Pet Hospitals\n2. Nearby Veterinary\n3. Skin Disease Info\n4. Home Remedy",
    },
  ]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [context, setContext] = useState(null);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const formatMessage = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(
      urlRegex,
      (url) => `<a href="${url}" target="_blank" class="text-blue-600 underline">${url}</a>`
    );
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userInput = input.trim();
    const lowerInput = userInput.toLowerCase();

    const userMessage = { sender: "user", text: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Context-aware responses
    if (context === "pet-hospitals") {
      const url = `https://www.google.com/maps/search/pet+hospitals+in+${encodeURIComponent(userInput)}`;
      addBotMessage(`📍 Here's what I found in **${userInput}**:\n${url}`);
      returnToMenu();
      return;
    }

    if (context === "vet") {
      const url = `https://www.google.com/maps/search/veterinary+clinics+in+${encodeURIComponent(userInput)}`;
      addBotMessage(`🩺 Nearby veterinary clinics in **${userInput}**:\n${url}`);
      returnToMenu();
      return;
    }

    if (context === "skin") {
      addBotMessage(`🦴 "${userInput}" is a common skin issue in dogs. Please monitor symptoms and consult a vet if needed.`);
      returnToMenu();
      return;
    }

    if (context === "remedy") {
      const url = `https://www.youtube.com/results?search_query=dog+${encodeURIComponent(userInput)}+home+remedy`;
      addBotMessage(`🧴 Here's a YouTube link for home remedies:\n${url}`);
      returnToMenu();
      return;
    }

    // Handle main options
    switch (lowerInput) {
      case "1":
      case "pet hospital":
      case "hospital":
        setContext("pet-hospitals");
        addBotMessage("📍 Please enter your location to find nearby pet hospitals:");
        break;
      case "2":
      case "veterinary":
      case "vet":
        setContext("vet");
        addBotMessage("🩺 Please enter your location to find nearby veterinary clinics:");
        break;
      case "3":
      case "skin":
      case "skin disease":
        setContext("skin");
        addBotMessage("🐾 Enter the skin disease you want information about:");
        break;
      case "4":
      case "remedy":
      case "home remedy":
        setContext("remedy");
        addBotMessage("🌿 Enter the dog disease to search for home remedies:");
        break;
      default:
        addBotMessage(
          "🤖 I didn’t understand. Please choose:\n1. Nearby Pet Hospitals\n2. Nearby Veterinary\n3. Skin Disease Info\n4. Home Remedy"
        );
        break;
    }
  };

  const addBotMessage = (text) => {
    setMessages((prev) => [...prev, { sender: "bot", text }]);
  };

  const returnToMenu = () => {
    setTimeout(() => {
      setContext(null);
      addBotMessage(
        "🔁 What else can I help you with?\n1. Nearby Pet Hospitals\n2. Nearby Veterinary\n3. Skin Disease Info\n4. Home Remedy"
      );
    }, 2000);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-full shadow-lg z-50"
      >
        💬 Chat
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white border border-gray-300 rounded-xl shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="bg-rose-500 text-white flex items-center justify-between px-4 py-2 rounded-t-xl">
        <h3 className="font-semibold text-lg">Dog360 Assistant</h3>
        <button onClick={() => setIsOpen(false)} className="text-xl">
          <IoMdClose />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={chatRef}
        className="max-h-64 overflow-y-auto px-4 py-3 space-y-2 bg-white text-sm"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <span
              className={`px-3 py-2 rounded-lg shadow-sm whitespace-pre-wrap ${
                msg.sender === "user"
                  ? "bg-rose-100 text-gray-900"
                  : "bg-gray-100 text-gray-800"
              }`}
              dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
            />
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex p-3 border-t">
        <input
          type="text"
          className="flex-grow px-3 py-2 border border-gray-300 rounded-l-lg text-sm outline-none"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-rose-500 hover:bg-rose-600 text-white px-4 rounded-r-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;

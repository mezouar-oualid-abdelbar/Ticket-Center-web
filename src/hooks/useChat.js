import { useState } from "react";

export function useChat(initialMessage) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: initialMessage },
  ]);

  const sendMessage = () => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { from: "user", text }]);

    setText("");
  };

  return {
    text,
    setText,
    messages,
    sendMessage,
  };
}

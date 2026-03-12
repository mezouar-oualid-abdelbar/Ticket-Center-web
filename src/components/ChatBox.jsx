import { useState, useEffect, useRef } from "react";
import "../styles/chatbox.css";
export default function ChatBox() {
  const [text, setText] = useState("");
  const [minimized, setMinimized] = useState(false);
  const [typing, setTyping] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: crypto.randomUUID(),
      sender: "bot",
      text: "Hey 👋 Need help?",
      time: new Date(),
    },
  ]);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);

  /* AUTO SCROLL */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  /* CLEAN TIMEOUT */

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  /* SEND MESSAGE */

  const sendMessage = () => {
    const value = text.trim();
    if (!value) return;

    const userMsg = {
      id: crypto.randomUUID(),
      sender: "user",
      text: value,
      time: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setText("");
    setTyping(true);

    timeoutRef.current = setTimeout(() => {
      const botMsg = {
        id: crypto.randomUUID(),
        sender: "bot",
        text: "We received your message.",
        time: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
    }, 1200);

    inputRef.current?.focus();
  };

  /* ENTER KEY */

  const handleKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  /* MINIMIZED MODE */

  if (minimized) {
    return (
      <div className="messenger-bubble" onClick={() => setMinimized(false)}>
        <img src="https://i.pravatar.cc/100?img=5" alt="avatar" />
      </div>
    );
  }

  return (
    <div className="messenger-window">
      {/* HEADER */}

      <div className="messenger-header">
        <div className="header-left">
          <img src="https://i.pravatar.cc/100?img=5" alt="avatar" />

          <div>
            <div className="name">Support Team</div>
            <div className="status">Active now</div>
          </div>
        </div>

        <div className="header-actions">
          <span onClick={() => setMinimized(true)}>—</span>
        </div>
      </div>

      {/* BODY */}

      <div className="messenger-body">
        {messages.map((msg, index) => {
          const isUser = msg.sender === "user";
          const prev = messages[index - 1];
          const grouped = prev && prev.sender === msg.sender;

          return (
            <div key={msg.id} className={`msg-row ${isUser ? "user" : "bot"}`}>
              {!isUser && !grouped && (
                <img
                  src="https://i.pravatar.cc/100?img=5"
                  alt=""
                  className="msg-avatar"
                />
              )}

              <div
                className={`msg-bubble ${
                  isUser ? "user" : "bot"
                } ${grouped ? "grouped" : ""}`}
                title={msg.time.toLocaleTimeString()}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {/* TYPING INDICATOR */}

        {typing && (
          <div className="msg-row bot">
            <img
              src="https://i.pravatar.cc/100?img=5"
              alt=""
              className="msg-avatar"
            />

            <div className="typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={bottomRef}></div>

        <div className="seen">Seen</div>
      </div>

      {/* FOOTER */}

      <div className="messenger-footer">
        <input
          ref={inputRef}
          placeholder="Aa"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
        />
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";

export default function ChatBox() {
  const [text, setText] = useState("");
  const [minimized, setMinimized] = useState(false);
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hey 👋 Need help?",
      time: new Date(),
    },
  ]);

  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = () => {
    if (!text.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: "user",
      text,
      time: new Date(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setText("");
    setTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: "We received your message.",
          time: new Date(),
        },
      ]);
      setTyping(false);
    }, 1200);
  };

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
                className={`msg-bubble ${isUser ? "user" : "bot"} ${
                  grouped ? "grouped" : ""
                }`}
                title={msg.time.toLocaleTimeString()}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

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

        <div ref={chatRef}></div>

        <div className="seen">Seen</div>
      </div>

      {/* FOOTER */}
      <div className="messenger-footer">
        <input
          placeholder="Aa"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
      </div>
    </div>
  );
}

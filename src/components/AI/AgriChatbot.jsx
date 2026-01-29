import { useEffect, useState } from "react";
import { chatbotReply } from "../../Ai/aiHelpers.js";

export default function AgriChatbot() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  // Auto welcome message
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        { from: "bot", text: " Hi! Ask me about fresh vegetables today 🌱" }
      ]);
    }
  }, [open]);

  const askBot = () => {
    if (!question.trim()) return;

    setMessages(prev => [...prev, { from: "user", text: question }]);
    setTyping(true);

    setTimeout(() => {
      const answer = chatbotReply(question);
      setMessages(prev => [...prev, { from: "bot", text: answer }]);
      setTyping(false);
    }, 1000);

    setQuestion("");
  };

  return (
    <>
      {/* 🌟 3D FLOATING CHATBOT ICON */}
      {!open && (
        <div
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 
                     rounded-full cursor-pointer
                     bg-gradient-to-br from-green-400 to-green-700
                     shadow-[0_20px_50px_rgba(0,0,0,0.4)]
                     flex items-center justify-center
                     animate-float group z-50"
        >
          {/* Glow Ring */}
          <span className="absolute inset-0 rounded-full 
                           bg-green-400 opacity-30 
                           animate-ping"></span>

          {/* Icon */}
          <span className="relative text-3xl group-hover:scale-110 transition">
            🤖
          </span>
        </div>
      )}

      {/* 🧊 3D GLASS CHATBOT WINDOW */}
      {open && (
        <div
          className="fixed bottom-6 right-6 w-80 
                     backdrop-blur-xl bg-white/30
                     border border-white/20
                     shadow-[0_25px_80px_rgba(0,0,0,0.4)]
                     rounded-2xl overflow-hidden
                     animate-slideUp z-50"
        >
          {/* HEADER */}
          <div className="bg-gradient-to-r from-green-600 to-green-400 
                          text-white p-3 flex justify-between items-center">
            <span className="font-semibold tracking-wide text-center   "> Agri AI</span>
            <button
              onClick={() => setOpen(false)}
              className="hover:scale-110 cursor-pointer   transition"
            >
              X
            </button>
          </div>

          {/* CHAT BODY */}
          <div className="h-64 overflow-y-auto p-3 text-sm space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`${
                  m.from === "bot" ? "text-left" : "text-right"
                }`}
              >
                <span
                  className={`inline-block px-2 py-1 rounded-lg ${
                    m.from === "bot"
                      ? "bg-white/70 text-green-800"
                      : "bg-green-600 text-white"
                  }`}
                >
                  {m.text}
                </span>
              </div>
            ))}

            {/* AI typing dots */}
            {typing && (
              <div className="flex gap-1">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}
          </div>

          {/* INPUT */}
          <div className="flex gap-2 p-2 bg-white/50">
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 px-2 py-1 rounded border text-sm"
            />
            <button
              onClick={askBot}
              className="bg-green-600 cursor-pointer text-white px-3 rounded hover:scale-105 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

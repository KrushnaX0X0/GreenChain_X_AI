import { useEffect, useState, useRef } from "react";
import { chatbotReply } from "../../Ai/aiHelpers.js";
import { Send, X, Bot, Sparkles, User } from "lucide-react";

export default function AgriChatbot() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  // 1. STRENGTHENED CLOSE HANDLER
  const handleClose = (e) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Stop the click from bubbling up to parents
    setOpen(false);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        { from: "bot", text: "Welcome to the GreenChain Terminal. How can I assist your harvest today? 🌱" }
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
    }, 1200);
    setQuestion("");
  };

  return (
    <>
      {/* --- 3D FLOATING ICON --- */}
      {!open && (
        <div
          onClick={() => setOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 rounded-2xl cursor-pointer bg-emerald-950 text-white shadow-[0_20px_50px_rgba(6,78,59,0.3)] flex items-center justify-center hover:scale-110 hover:-translate-y-2 transition-all duration-500 z-[1000] group"
        >
          <span className="absolute inset-0 rounded-2xl bg-emerald-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity"></span>
          <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
        </div>
      )}

      {/* --- CHAT WINDOW --- */}
      {open && (
        <div
          className="fixed bottom-8 right-8 w-[380px] h-[550px] backdrop-blur-2xl bg-white/80 border border-white shadow-[0_40px_100px_rgba(0,0,0,0.1)] rounded-[40px] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300 z-[1001]"
        >
          {/* HEADER */}
          <div className="p-6 bg-emerald-950 text-white flex justify-between items-center relative overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center border border-emerald-700">
                <Bot className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em]">GreenChain AI</h3>
            </div>

            {/* 2. ADDED STOP PROPAGATION HERE */}
            <button
              onClick={handleClose}
              className="relative z-[2000] w-10 h-10 rounded-full hover:bg-white/20 flex items-center justify-center transition-all active:scale-90 cursor-pointer"
              aria-label="Close Chat"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* CHAT BODY */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
            {messages.map((m, i) => (
              <div key={i} className={`flex items-end gap-3 ${m.from === "bot" ? "flex-row" : "flex-row-reverse"}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${m.from === "bot" ? "bg-emerald-100 text-emerald-600" : "bg-emerald-900 text-emerald-100"}`}>
                  {m.from === "bot" ? <Bot size={14} /> : <User size={14} />}
                </div>
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${m.from === "bot" ? "bg-white text-emerald-950 border border-emerald-50 rounded-bl-none" : "bg-emerald-600 text-white rounded-br-none"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 w-20 rounded-full ml-11">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
          </div>

          {/* INPUT */}
          <div className="p-6 bg-white/50 border-t border-emerald-50">
            <div className="relative flex items-center gap-2 bg-white p-2 rounded-2xl shadow-inner border border-emerald-50">
              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askBot()}
                placeholder="Query the harvest..."
                className="flex-1 px-4 py-2 bg-transparent outline-none text-sm font-semibold text-emerald-950"
              />
              <button onClick={askBot} className="w-10 h-10 bg-emerald-950 text-white rounded-xl flex items-center justify-center hover:bg-emerald-600 transition-all">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
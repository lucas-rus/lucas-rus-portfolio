"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X, MessageSquare, Loader2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === "guest" || password.toLowerCase() === "lucas") {
      setIsUnlocked(true);
    } else {
      alert("Incorrect access code. Hint: Try 'guest'");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), role: "user", content: input };
    
    // Optimistically update UI
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // STRICT CLEANUP: 
      // 1. Combine current history with new user message
      // 2. Filter out any message with empty/null content
      // 3. Strip all fields except 'role' and 'content'
      const rawMessages = [...messages, userMessage];
      
      const cleanMessages = rawMessages
        .filter(m => m.content && typeof m.content === 'string' && m.content.trim().length > 0)
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      console.log("Sending Clean Payload:", cleanMessages);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: cleanMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Response:", errorData);
        throw new Error(errorData.error || "Failed to send message");
      }

      const reader = response.body?.getReader();
      if (!reader) return;

      const assistantMessageId = Date.now() + 1;
      let currentContent = "";
      
      // Add initial empty assistant message
      setMessages((prev) => [
        ...prev, 
        { id: assistantMessageId, role: "assistant", content: "" }
      ]);

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        currentContent += chunkValue;
        
        setMessages((prev) => {
          return prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: currentContent }
              : msg
          );
        });
      }
    } catch (error) {
      console.error(error);
      alert("Error sending message. Check your API key or connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        className="fixed bottom-6 right-6 p-4 bg-primary text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors z-50 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[500px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center space-x-3">
              <div className="p-2 bg-primary/20 rounded-full">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Lucas&apos;s AI Assistant</h3>
                <p className="text-xs text-slate-400">Ask me about Lucas&apos;s work</p>
              </div>
            </div>

            {/* Content */}
            {!isUnlocked ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="p-4 bg-slate-800 rounded-full mb-2">
                  <Lock className="w-8 h-8 text-secondary" />
                </div>
                <h4 className="text-white font-bold">Protected Access</h4>
                <p className="text-slate-400 text-sm">Please enter the access code to chat with the AI assistant.</p>
                <form onSubmit={handleUnlock} className="w-full space-y-3">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter code (hint: guest)"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary text-center"
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                  >
                    Unlock
                  </button>
                </form>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-slate-500 text-sm mt-8">
                      <p>👋 Hi! I&apos;m an AI trained on Lucas&apos;s portfolio.</p>
                      <p className="mt-2">Ask me about:</p>
                      <div className="flex flex-wrap justify-center gap-2 mt-3">
                        <span className="px-2 py-1 bg-slate-800 rounded-md text-xs">iTec Hackathon</span>
                        <span className="px-2 py-1 bg-slate-800 rounded-md text-xs">CyberSecurity</span>
                        <span className="px-2 py-1 bg-slate-800 rounded-md text-xs">Future Jump</span>
                      </div>
                    </div>
                  )}
                  
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-xl text-sm ${
                          m.role === "user"
                            ? "bg-primary text-white rounded-tr-none"
                            : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="p-3 bg-slate-800 rounded-xl rounded-tl-none border border-slate-700 flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span className="text-xs text-slate-400">Thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700 bg-slate-800/50">
                  <div className="flex items-center space-x-2">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary text-sm"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="p-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
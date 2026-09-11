"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X, MessageSquare, Loader2, Sparkles, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
}

// Simple markdown formatter for links, bold text, and bullet lists
function FormattedMessage({ content }: { content: string }) {
  // Split into lines
  const lines = content.split("\n");

  return (
    <div className="space-y-1.5 leading-relaxed text-sm">
      {lines.map((line, idx) => {
        if (!line.trim()) return <div key={idx} className="h-1" />;

        // Check if list item
        const isBullet = line.trim().startsWith("- ") || line.trim().startsWith("* ");
        const cleanLine = isBullet ? line.trim().slice(2) : line;

        // Parse bold and links in the line
        const parts = cleanLine.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);

        const renderedLine = parts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={pIdx} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
          }
          const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
          if (linkMatch) {
            return (
              <a
                key={pIdx}
                href={linkMatch[2]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:text-blue-300 inline-flex items-center gap-0.5"
              >
                {linkMatch[1]}
                <ExternalLink className="w-3 h-3 inline" />
              </a>
            );
          }
          return <span key={pIdx}>{part}</span>;
        });

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start space-x-2 pl-1">
              <span className="text-primary font-bold text-xs mt-1">•</span>
              <span className="flex-1">{renderedLine}</span>
            </div>
          );
        }

        return <p key={idx}>{renderedLine}</p>;
      })}
    </div>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterPrompts = [
    "Tell me about your AI ventures",
    "What is Company Data Hub v2?",
    "What is your full tech stack?",
    "What is GigTim?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendQuery = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now(), role: "user", content: queryText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const rawMessages = [...messages, userMessage];
      const cleanMessages = rawMessages
        .filter((m) => m.content && m.content.trim().length > 0)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: cleanMessages }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const reader = response.body?.getReader();
      if (!reader) return;

      const assistantMessageId = Date.now() + 1;
      let currentContent = "";

      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: "assistant", content: "" },
      ]);

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        currentContent += chunkValue;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId ? { ...msg, content: currentContent } : msg
          )
        );
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content: "I ran into a temporary connection issue, but you can reach Lucas directly at **lucas.rus.gheorghiu@gmail.com** or check out his work on [GitHub](https://github.com/lucas-rus)!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuery(input);
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-xl shadow-blue-900/40 hover:shadow-blue-900/60 transition-all z-50 flex items-center justify-center border border-blue-400/30"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open AI Assistant"
      >
        {isOpen ? <X className="w-6 h-6" /> : (
          <div className="relative flex items-center justify-center">
            <Bot className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
            </span>
          </div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-4 sm:right-6 w-[94vw] sm:w-[440px] h-[560px] max-h-[82vh] bg-slate-950/95 border border-slate-700/70 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-xl border border-blue-400/20">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm">Lucas&apos;s AI Assistant</h3>
                    <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                      Live
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Ask anything about his projects & systems</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-slate-400 text-sm mt-6 px-2">
                  <div className="inline-flex p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 mb-3">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-white text-base">Interactive Portfolio AI</h4>
                  <p className="mt-1 text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
                    Trained on Lucas&apos;s full systems engineering background, AI ventures, and production codebases.
                  </p>
                  
                  <div className="mt-5 text-left">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Suggested Inquiries:</p>
                    <div className="flex flex-col gap-2">
                      {starterPrompts.map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => sendQuery(prompt)}
                          className="text-left text-xs bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-primary/40 text-slate-300 hover:text-white p-2.5 rounded-xl transition-all flex items-center justify-between group"
                        >
                          <span>{prompt}</span>
                          <span className="text-primary text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-sm ${
                      m.role === "user"
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none shadow-md shadow-blue-950/40"
                        : "bg-slate-900/90 text-slate-200 rounded-tl-none border border-slate-800 shadow-md"
                    }`}
                  >
                    <FormattedMessage content={m.content} />
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="p-3 bg-slate-900/90 rounded-2xl rounded-tl-none border border-slate-800 flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-xs text-slate-400">Synthesizing response...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSubmit} className="p-3.5 border-t border-slate-800 bg-slate-900/70">
              <div className="flex items-center space-x-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about projects, architecture, stack..."
                  className="flex-1 bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-primary placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="p-2.5 bg-primary text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:hover:bg-primary"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

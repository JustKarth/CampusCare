import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../services/apiClient";

// Markdown renderer: handles **bold**, [link](url), bullet lines, and numbered lists
function MarkdownText({ text }) {
  if (!text) return null;
  const lines = text.split("\n");

  const renderInline = (str) => {
    const parts = [];
    const pattern = /(\*\*(.+?)\*\*|\[(.+?)\]\((https?:\/\/.+?)\))/g;
    let last = 0;
    let match;
    while ((match = pattern.exec(str)) !== null) {
      if (match.index > last) parts.push(str.slice(last, match.index));
      if (match[2]) {
        parts.push(<strong key={match.index} className="font-semibold text-white">{match[2]}</strong>);
      } else if (match[3]) {
        parts.push(
          <a key={match.index} href={match[4]} target="_blank" rel="noopener noreferrer"
             className="text-sky-300 underline hover:text-sky-200">{match[3]}</a>
        );
      }
      last = match.index + match[0].length;
    }
    if (last < str.length) parts.push(str.slice(last));
    return parts.length > 0 ? parts : str;
  };

  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1.5" />;
        const bulletMatch = trimmed.match(/^([*\-•]|\d+\.)\s+(.*)/);
        if (bulletMatch) {
          const marker = bulletMatch[1];
          const content = bulletMatch[2];
          const isNumber = /^\d+\./.test(marker);
          return (
            <div key={i} className="flex gap-2 pl-1 py-0.5">
              <span className={`flex-shrink-0 text-xs font-semibold ${isNumber ? 'text-sky-400 font-mono mt-0.5' : 'text-violet-400 mt-0.5'}`}>
                {isNumber ? marker : '•'}
              </span>
              <span className="text-[#F8FAFC] text-xs sm:text-sm leading-relaxed">{renderInline(content)}</span>
            </div>
          );
        }
        return (
          <p key={i} className="text-[#F8FAFC] text-xs sm:text-sm leading-relaxed">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <span key={i} className="w-2 h-2 rounded-full bg-sky-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}

export function AiGuideWidget() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ALL hooks must be declared unconditionally at the top
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [quickPrompts, setQuickPrompts] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState(null);

  const messagesContainerRef = useRef(null);
  const lastAiMessageRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const hasLoadedSuggestions = useRef(false);

  // Scroll handling: when an AI response arrives, scroll so user sees the top of it
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.sender === "user") {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      } else if (lastMsg.sender === "ai") {
        // Bring top of the newly arrived answer into view
        lastAiMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [messages, isLoading]);

  // Load quick prompts on first open
  useEffect(() => {
    if (isOpen && !hasLoadedSuggestions.current) {
      hasLoadedSuggestions.current = true;
      apiRequest("/ai-guide/suggestions", "GET", null, true)
        .then((data) => { if (data?.suggestions) setQuickPrompts(data.suggestions); })
        .catch(() => {});
    }
  }, [isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      const t = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = useCallback(async (text) => {
    const trimmed = (text !== undefined ? text : input).trim();
    if (!trimmed || isLoading) return;
    setInput("");
    setError(null);
    const userMsg = { id: Date.now(), sender: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    try {
      const history = messages.slice(-6).map((m) => ({ sender: m.sender, text: m.text }));
      const data = await apiRequest("/ai-guide/chat", "POST", { message: trimmed, history }, true);
      if (data?.success) {
        const aiMsg = { id: Date.now() + 1, sender: "ai", text: data.reply, actions: data.actions || [] };
        setMessages((prev) => [...prev, aiMsg]);
        if (!isOpen || isMinimized) setUnreadCount((c) => c + 1);
      } else {
        throw new Error(data?.message || "No response");
      }
    } catch {
      setError("Could not reach AI Guide. Please try again.");
      setMessages((prev) => [...prev, {
        id: Date.now() + 1, sender: "ai",
        text: "I am having trouble connecting right now. Please try again in a moment.",
        actions: []
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, isOpen, isMinimized]);

  // Early return AFTER all hooks — this is safe
  if (!user) return null;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
    if (messages.length === 0) {
      setMessages([{
        id: 0, sender: "ai",
        text: "Hi! I am **AI Guide** — your CampusCare campus assistant.\n\nI can help you with:\n- Transit fares to any location around campus\n- Food spots, hospitals, and places near campus\n- Branch-wise study notes and academic resources\n- Recent student blogs and campus discussions\n\nWhat would you like to explore today?",
        actions: [
          { label: "Fare Calculator", path: "/fare-analysis", icon: "🛺" },
          { label: "Local Guide", path: "/local-guide", icon: "📍" },
          { label: "Study Notes", path: "/resources", icon: "📖" }
        ]
      }]);
    }
  };

  const handleActionClick = (action) => {
    navigate(action.path);
    setIsMinimized(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end gap-3">

      {/* Chat Window */}
      {isOpen && (
        <div
          className="flex flex-col bg-[#0F172A] border border-white/15 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300"
          style={{
            width: isExpanded ? "min(520px, 94vw)" : "min(410px, 92vw)",
            height: isMinimized ? 0 : (isExpanded ? "min(680px, 86vh)" : "min(560px, 80vh)"),
            opacity: isMinimized ? 0 : 1,
            pointerEvents: isMinimized ? "none" : "auto"
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 text-white flex-shrink-0 shadow-md"
            style={{ background: "linear-gradient(135deg, #38BDF8 0%, #8B5CF6 100%)" }}
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-xl select-none shadow-sm">🤖</div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0F172A]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-none">AI Guide</p>
              <p className="text-white/80 text-xs mt-0.5 truncate">CampusCare Assistant • Gemini Flash</p>
            </div>

            {/* Expand / Minimize / Close Controls */}
            <div className="flex items-center gap-1 text-white/80">
              <button
                onClick={() => setIsExpanded(prev => !prev)}
                className="p-1 rounded-lg hover:bg-white/15 hover:text-white transition-colors"
                title={isExpanded ? "Standard view" : "Expand window"}
              >
                {isExpanded ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9L4 4m0 0l5 0m-5 0l0 5m6 6l5 5m0 0l-5 0m5 0l0-5" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 rounded-lg hover:bg-white/15 hover:text-white transition-colors"
                title="Minimize"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button
                onClick={() => { setIsOpen(false); setIsMinimized(false); }}
                className="p-1 rounded-lg hover:bg-white/15 hover:text-white transition-colors"
                title="Close"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-3.5 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={msg.id}
                ref={idx === messages.length - 1 && msg.sender === 'ai' ? lastAiMessageRef : null}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "ai" && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-0.5 shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #38BDF8, #8B5CF6)' }}>
                    🤖
                  </div>
                )}
                <div className={`${msg.sender !== "user" ? "flex-1" : "max-w-[85%]"}`}>
                  <div
                    className={`rounded-2xl px-3.5 py-3 ${
                      msg.sender === "user"
                        ? "text-white rounded-tr-sm shadow-md"
                        : "rounded-tl-sm shadow-md"
                    }`}
                    style={{
                      background: msg.sender === "user"
                        ? "linear-gradient(135deg, #38BDF8 0%, #8B5CF6 100%)"
                        : "#1E293B",
                      border: msg.sender === "user"
                        ? "none"
                        : "1px solid rgba(255,255,255,0.08)"
                    }}
                  >
                    {msg.sender === "user"
                      ? <p className="text-xs sm:text-sm leading-relaxed">{msg.text}</p>
                      : <MarkdownText text={msg.text} />
                    }
                  </div>
                  {msg.sender === "ai" && msg.actions?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.actions.map((action, actionIdx) => (
                        <button
                          key={actionIdx}
                          onClick={() => handleActionClick(action)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1E293B] hover:bg-sky-500/20 text-sky-300 hover:text-white text-xs font-semibold border border-sky-500/30 hover:border-sky-400 transition-all duration-150 active:scale-95 shadow-sm"
                        >
                          <span>{action.icon}</span>
                          <span>{action.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-0.5"
                  style={{ background: 'linear-gradient(135deg, #38BDF8, #8B5CF6)' }}>🤖</div>
                <div className="rounded-2xl rounded-tl-sm bg-[#1E293B] border border-white/10"><TypingDots /></div>
              </div>
            )}

            {error && (
              <div className="text-center text-xs text-rose-400 py-1 bg-rose-500/10 rounded-lg border border-rose-500/20">{error}</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {quickPrompts.length > 0 && messages.length <= 1 && (
            <div className="px-3.5 py-2.5 border-t border-white/10 flex-shrink-0 bg-[#0F172A]">
              <p className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-wider mb-1.5">Quick Questions</p>
              <div className="flex flex-col gap-1 max-h-24 overflow-y-auto">
                {quickPrompts.slice(0, 4).map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(prompt)}
                    className="text-left text-xs text-[#94A3B8] hover:text-[#F8FAFC] bg-[#1E293B] hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 hover:border-sky-400/50 transition-all duration-150 truncate"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Bar */}
          <div className="flex items-end gap-2 p-3 border-t border-white/10 bg-[#0F172A] flex-shrink-0">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about campus, fares, food, notes..."
              rows={1}
              className="flex-1 bg-[#1E293B] text-[#F8FAFC] text-xs sm:text-sm placeholder-[#94A3B8] rounded-xl px-3.5 py-2.5 border border-white/15 focus:border-sky-400 focus:outline-none resize-none leading-relaxed max-h-24"
              style={{ minHeight: "40px" }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-150 active:scale-95 flex-shrink-0 shadow-md shadow-sky-500/25"
              style={{ background: 'linear-gradient(135deg, #38BDF8 0%, #8B5CF6 100%)' }}
              title="Send"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={isOpen ? () => setIsMinimized((m) => !m) : handleOpen}
        className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all duration-200 active:scale-95 relative select-none hover:scale-105"
        style={{ background: 'linear-gradient(135deg, #38BDF8 0%, #8B5CF6 100%)' }}
        title={isOpen ? (isMinimized ? "Restore AI Guide" : "Minimize") : "Open AI Guide"}
      >
        <span>🤖</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#0F172A]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}

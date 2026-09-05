import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../services/apiClient";

// Markdown renderer: handles **bold**, [link](url), bullet lines
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
             className="text-blue-300 underline hover:text-blue-200">{match[3]}</a>
        );
      }
      last = match.index + match[0].length;
    }
    if (last < str.length) parts.push(str.slice(last));
    return parts.length > 0 ? parts : str;
  };

  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1.5" />;
        const bullet = trimmed.match(/^[*\-]\s+(.*)|^(•)\s+(.*)/);
        if (bullet) {
          const content = bullet[1] || bullet[3];
          return (
            <div key={i} className="flex gap-1.5 pl-1">
              <span className="text-indigo-400 mt-0.5 flex-shrink-0">•</span>
              <span className="text-gray-200 text-sm leading-relaxed">{renderInline(content)}</span>
            </div>
          );
        }
        return (
          <p key={i} className="text-gray-200 text-sm leading-relaxed">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <span key={i} className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
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
  const [messages, setMessages] = useState([]);
  const [quickPrompts, setQuickPrompts] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const hasLoadedSuggestions = useRef(false);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
          className="flex flex-col bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300"
          style={{
            width: "360px",
            height: isMinimized ? 0 : "520px",
            opacity: isMinimized ? 0 : 1,
            pointerEvents: isMinimized ? "none" : "auto"
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-700 to-violet-700 flex-shrink-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xl select-none">🤖</div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-indigo-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-none">AI Guide</p>
              <p className="text-indigo-200 text-xs mt-0.5">CampusCare Assistant</p>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-indigo-200 hover:text-white p-1 rounded transition-colors"
              title="Minimize"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              onClick={() => { setIsOpen(false); setIsMinimized(false); }}
              className="text-indigo-200 hover:text-white p-1 rounded transition-colors"
              title="Close"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                {msg.sender === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-0.5">
                    🤖
                  </div>
                )}
                <div className={`${msg.sender !== "user" ? "flex-1" : "max-w-[80%]"}`}>
                  <div className={`rounded-2xl px-3 py-2.5 ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-sm"
                      : "bg-gray-800 rounded-tl-sm"
                  }`}>
                    {msg.sender === "user"
                      ? <p className="text-sm leading-relaxed">{msg.text}</p>
                      : <MarkdownText text={msg.text} />
                    }
                  </div>
                  {msg.sender === "ai" && msg.actions?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.actions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleActionClick(action)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-700 hover:bg-indigo-600 text-gray-200 hover:text-white text-xs font-medium border border-gray-600 hover:border-indigo-500 transition-all duration-150 active:scale-95"
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
                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-0.5">🤖</div>
                <div className="bg-gray-800 rounded-2xl rounded-tl-sm"><TypingDots /></div>
              </div>
            )}

            {error && (
              <div className="text-center text-xs text-red-400 py-1">{error}</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {quickPrompts.length > 0 && messages.length <= 1 && (
            <div className="px-3 py-2 border-t border-gray-700/60 flex-shrink-0">
              <p className="text-gray-500 text-[10px] font-medium uppercase tracking-wider mb-1.5">Quick Questions</p>
              <div className="flex flex-col gap-1 max-h-24 overflow-y-auto">
                {quickPrompts.slice(0, 4).map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(prompt)}
                    className="text-left text-xs text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 px-2.5 py-1.5 rounded-lg border border-gray-700 hover:border-indigo-500 transition-all duration-150 truncate"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Bar */}
          <div className="flex items-end gap-2 px-3 py-3 border-t border-gray-700 bg-gray-900 flex-shrink-0">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about campus..."
              rows={1}
              className="flex-1 bg-gray-800 text-white text-sm placeholder-gray-500 rounded-xl px-3 py-2 border border-gray-700 focus:border-indigo-500 focus:outline-none resize-none leading-relaxed max-h-20"
              style={{ minHeight: "38px" }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-150 active:scale-95 flex-shrink-0"
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
        className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl bg-gradient-to-br from-indigo-600 to-violet-700 hover:from-indigo-500 hover:to-violet-600 transition-all duration-200 active:scale-95 relative select-none"
        title={isOpen ? (isMinimized ? "Restore AI Guide" : "Minimize") : "Open AI Guide"}
      >
        <span>🤖</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-gray-900">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}

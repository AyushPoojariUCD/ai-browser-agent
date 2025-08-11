import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  // ---- State ----
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem("conversations");
      const parsed = saved ? JSON.parse(saved) : [];
      return parsed.length > 0 ? parsed : [{ title: "Chat 1", messages: [] }];
    } catch {
      return [{ title: "Chat 1", messages: [] }];
    }
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // Kept for UI controls (not sent to backend)
  const [modelType, setModelType] = useState("gpt-4o");
  const [temperature, setTemperature] = useState(0.7);
  const [toolServers] = useState([]);
  const [automationEnabled, setAutomationEnabled] = useState(false);

  // Persist conversations
  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  const toggleAutomation = () => setAutomationEnabled((prev) => !prev);

  // ---- Helpers ----
  const addMessage = (type, content) => {
    if (!conversations[currentIndex]) return;
    const newMessage = {
      type, // "user" | "ai"
      content: String(content ?? ""),
      timestamp: new Date().toISOString(),
      userId: "guest",
    };
    setConversations((prev) => {
      const updated = [...prev];
      updated[currentIndex] = {
        ...updated[currentIndex],
        messages: [...(updated[currentIndex].messages || []), newMessage],
      };
      return updated;
    });
  };

  const getOpenAIMessages = (messages) =>
    messages.map((msg) =>
      msg.type === "user"
        ? { role: "user", content: msg.content }
        : { role: "assistant", content: msg.content }
    );

  // Backend URL (Vite env when available, fallback to localhost)
  const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

  // ---- Send message ----
  const sendMessage = async (userInput) => {
    const prompt = (userInput ?? "").toString().trim();
    if (!prompt) return;

    if (!conversations.length || !conversations[currentIndex]) {
      setConversations([{ title: "Chat 1", messages: [] }]);
      setCurrentIndex(0);
      return;
    }

    const currentMessages = conversations[currentIndex]?.messages || [];
    addMessage("user", prompt);
    setLoading(true);

    try {
      const endpoint = `${API_BASE}/agent/run`;
      const payload = { prompt }; // always send { prompt } to avoid FastAPI 422
      // Optional shared history if your backend wants context:
      // payload.history = getOpenAIMessages(currentMessages);

      const response = await axios.post(endpoint, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const { result, error, raw } = response.data || {};
      if (error) {
        addMessage("ai", `❌ ${error}`);
      } else {
        addMessage("ai", result ?? "✅ Done.");
      }

      if (raw && raw.tools_output && typeof raw.tools_output === "object") {
        Object.entries(raw.tools_output).forEach(([name, output]) => {
          addMessage("ai", `🔧 ${name}:\n${String(output)}`);
        });
      }
    } catch (err) {
      console.error("API error:", err?.response?.data || err?.message || err);
      addMessage("ai", "❌ Failed to get response.");
    } finally {
      setLoading(false);
    }
  };

  // ---- Chat list actions ----
  const newChat = () => {
    const title = `Chat ${conversations.length + 1}`;
    const newConversation = { title, messages: [] };
    setConversations((prev) => [...prev, newConversation]);
    setCurrentIndex(conversations.length);
  };

  const renameChat = (index, newTitle) => {
    setConversations((prev) =>
      prev.map((c, i) => (i === index ? { ...c, title: newTitle } : c))
    );
  };

  const deleteChat = (index) => {
    const updated = conversations.filter((_, i) => i !== index);
    setConversations(updated);
    setCurrentIndex(
      index === currentIndex ? 0 : currentIndex - (index < currentIndex ? 1 : 0)
    );
  };

  const switchChat = (index) => {
    if (index >= 0 && index < conversations.length) {
      setCurrentIndex(index);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentMessages: conversations[currentIndex]?.messages || [],
        sendMessage,
        newChat,
        switchChat,
        currentIndex,
        renameChat,
        deleteChat,
        loading,
        // exposed for UI controls (not sent to backend right now)
        modelType,
        setModelType,
        temperature,
        setTemperature,
        toolServers,
        automationEnabled,
        toggleAutomation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);

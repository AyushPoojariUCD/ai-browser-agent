import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
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
  const [mcpEnabled, setMcpEnabled] = useState(true); // default enabled for testing
  const [modelType, setModelType] = useState("gpt-4o");
  const [temperature, setTemperature] = useState(0.7);
  const [toolServers] = useState([]);

  const toggleMCP = () => setMcpEnabled((prev) => !prev);

  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  const addMessage = (type, content) => {
    if (!conversations[currentIndex]) return;
    const newMessage = {
      type,
      content,
      timestamp: new Date().toISOString(),
      userId: "guest",
    };
    setConversations((prev) => {
      const updated = [...prev];
      updated[currentIndex] = {
        ...updated[currentIndex],
        messages: [...updated[currentIndex].messages, newMessage],
      };
      return updated;
    });
  };

  const sendMessage = async (userInput) => {
    addMessage("user", userInput);
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3001/api/command", {
        userMessage: userInput,
      });
      console.log("✅ MCP Response:", response.data);
      addMessage("ai", response.data.result || "✅ Done.");
    } catch (err) {
      console.error("❌ API error:", err);
      addMessage("ai", "❌ Failed to get response.");
    } finally {
      setLoading(false);
    }
  };

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
        sendMcpMessage: sendMessage,
        newChat,
        switchChat,
        currentIndex,
        renameChat,
        deleteChat,
        loading,
        mcpEnabled,
        toggleMCP,
        modelType,
        setModelType,
        temperature,
        setTemperature,
        toolServers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);

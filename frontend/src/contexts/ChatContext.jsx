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
  const [modelType, setModelType] = useState("gpt-4o");
  const [temperature, setTemperature] = useState(0.7);
  const [toolServers] = useState([]);
  const [automationEnabled, setAutomationEnabled] = useState(false);

  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  const toggleAutomation = () => setAutomationEnabled((prev) => !prev);

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

  const getOpenAIMessages = (messages) =>
    messages.map((msg) =>
      msg.type === "user"
        ? { role: "user", content: msg.content }
        : { role: "assistant", content: msg.content }
    );

const sendMessage = async (userInput) => {
  if (!conversations.length || !conversations[currentIndex]) {
    setConversations([{ title: "Chat 1", messages: [] }]);
    setCurrentIndex(0);
    return;
  }

  const currentMessages = conversations[currentIndex]?.messages || [];
  addMessage("user", userInput);
  setLoading(true);

  try {
    const endpoint = automationEnabled
      ? "http://localhost:8000/api/agent"
      : "http://localhost:8000/api/chat";

    const payload = automationEnabled
      ? { prompt: userInput } // ✅ simplified for automation
      : {
          messages: [
            ...getOpenAIMessages(currentMessages),
            { role: "user", content: userInput },
          ],
          modelType,
          temperature,
          tools: [],
        };

    const response = await axios.post(endpoint, payload);

    if (automationEnabled) {
      addMessage("ai", `🤖 Automation completed: ${response.data.task}`);
    } else {
      addMessage("ai", response.data.reply);

      if (response.data.tools_output) {
        Object.entries(response.data.tools_output).forEach(([name, output]) => {
          addMessage("ai", `🔧 ${name}:\n${output}`);
        });
      }
    }
  } catch (err) {
    console.error("API error:", err);
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
        newChat,
        switchChat,
        currentIndex,
        renameChat,
        deleteChat,
        loading,
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

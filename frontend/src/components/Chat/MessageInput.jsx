import React, { useState, useRef, useEffect } from "react";
import { useChat } from "../../contexts/ChatContext";

const MessageInput = () => {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  const { sendMessage, sendMcpMessage, loading, conversations, mcpEnabled } =
    useChat();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    if (!input.trim() || loading || conversations.length === 0) return;
    mcpEnabled ? sendMcpMessage(input) : sendMessage(input);
    setInput("");
  };

  const chatExists = conversations.length > 0;

  return (
    <div className="bg-[#1f1f3a] border-t border-gray-700 px-4 py-3">
      <div className="flex">
        <input
          ref={inputRef}
          className="flex-1 bg-[#2b2b45] p-3 rounded-l outline-none text-white disabled:opacity-60"
          placeholder={
            chatExists
              ? mcpEnabled
                ? "Type with MCP tools..."
                : "Type your message..."
              : "⚠️ Create a new chat to start messaging"
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={!chatExists}
        />
        <button
          onClick={handleSend}
          disabled={loading || !chatExists}
          className={`px-4 py-3 rounded-r transition ${
            loading || !chatExists
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-orange-600 hover:bg-orange-700"
          }`}
        >
          {loading ? "..." : mcpEnabled ? "Run" : "Send"}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;

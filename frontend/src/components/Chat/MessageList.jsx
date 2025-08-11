import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { useChat } from "../../contexts/ChatContext";

const MessageList = () => {
  const { currentMessages } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  return (
    <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-[#12121e]">
      {currentMessages.length === 0 ? (
        <div className="text-gray-400 text-center mt-20">
          💬 Start the conversation by typing a message below.
        </div>
      ) : (
        currentMessages.map((msg, index) => (
          <MessageBubble
            key={index}
            type={msg.type}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))
      )}
      <div ref={bottomRef} />
    </main>
  );
};

export default MessageList;

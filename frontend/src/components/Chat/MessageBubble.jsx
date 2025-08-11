import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MessageBubble = ({ type, content, timestamp }) => {
  const isUser = type === "user";

  const formatTime = (iso) => {
    const date = new Date(iso);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const CodeBlock = ({ children }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(children);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } catch (err) {
        console.error("Failed to copy code:", err);
      }
    };

    return (
      <div className="relative group">
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 z-10 text-xs bg-gray-700 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <div className="overflow-x-auto">
          <pre className="bg-gray-900 text-white text-sm p-4 rounded-md whitespace-pre break-words break-all">
            <code>{children}</code>
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} w-full`}>
      <div
        className={`max-w-xs sm:max-w-2xl p-4 rounded-xl shadow-md break-words ${
          isUser ? "bg-orange-500 text-white" : "bg-[#2b2b45] text-gray-200"
        }`}
      >
        {/* Render markdown only for AI */}
        {isUser ? (
          <div className="whitespace-pre-wrap break-words break-all">
            {content}
          </div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ inline, children }) {
                return inline ? (
                  <code className="bg-gray-800 px-1 py-0.5 rounded text-sm break-words break-all">
                    {children}
                  </code>
                ) : (
                  <CodeBlock>{String(children)}</CodeBlock>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        )}

        {/* Timestamp */}
        {timestamp && (
          <div className="text-[0.65rem] text-gray-400 mt-2 text-right">
            {formatTime(timestamp)}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;

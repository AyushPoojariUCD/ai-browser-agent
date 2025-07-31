// src/pages/ChatPage.jsx
import React, { useState } from "react";
import Sidebar from "../components/Chat/Sidebar";
import MessageList from "../components/Chat/MessageList";
import MessageInput from "../components/Chat/MessageInput";
import { Menu } from "lucide-react";

const Chat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0f0f1b] text-white overflow-hidden relative">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-50 md:relative h-full md:h-auto w-64 bg-[#1a1a2e] border-r border-gray-700 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
          flex flex-col`}
      >
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </aside>

      {/* Main Area */}
      <main className="flex flex-col flex-1 h-full">
        {/* Mobile Header */}
        <div className="md:hidden p-4 flex items-center justify-between bg-[#131321] border-b border-gray-700">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-white" />
          </button>

          {/* ✅ Branding */}
          <h4 className="text-lg font-semibold flex items-center gap-1 mb-4">
            <span className="animate-flicker text-orange-500 drop-shadow-[0_0_6px_#f97316] text-2xl">
              ⚡
            </span>
            <span className="bg-gradient-to-r from-orange-500 to-purple-500 text-transparent bg-clip-text animate-pulse text-base">
              AI-Browser-Agent
            </span>
          </h4>
        </div>

        {/* Desktop Header + Chat */}
        <MessageList />
        <MessageInput />
      </main>
    </div>
  );
};

export default Chat;

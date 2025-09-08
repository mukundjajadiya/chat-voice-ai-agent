import React, { useRef, useEffect } from "react";
import type { ChatMessage } from "../types.ts";
import { Message } from "./Message.tsx";

interface ChatHistoryProps {
  messages: ChatMessage[];
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 mb-4"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
          </svg>
          <h2 className="text-xl font-semibold">AI Voice & Chat Agent</h2>
          <p className="mt-2 text-center">
            Start the conversation by typing a message or using your voice.
          </p>
        </div>
      ) : (
        messages.map((msg, index) => <Message key={index} message={msg} />)
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

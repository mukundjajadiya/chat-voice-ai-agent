import React from "react";
import { MessageRole, type ChatMessage } from "../types.ts";
import { UserIcon, BotIcon, GlobeIcon } from "./Icons.tsx";

interface MessageProps {
  message: ChatMessage;
}

const LoadingIndicator: React.FC = () => (
  <div className="flex space-x-1 p-2">
    <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
  </div>
);

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;
  const isLoading = message.text === "...";

  return (
    <div
      className={`flex items-start gap-3 my-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-700 flex items-center justify-center">
          <BotIcon className="w-5 h-5 text-white" />
        </div>
      )}
      <div
        className={`max-w-md md:max-w-lg lg:max-w-2xl rounded-2xl px-4 py-3 text-white ${
          isUser ? "bg-blue-600 rounded-br-none" : "bg-gray-700 rounded-bl-none"
        }`}
      >
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <p className="whitespace-pre-wrap">{message.text}</p>
        )}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-600">
            <h4 className="flex items-center text-xs font-bold text-gray-300 mb-2">
              <GlobeIcon className="w-4 h-4 mr-1.5" />
              Sources
            </h4>
            <ul className="space-y-1 list-inside">
              {message.sources.map((source, index) => (
                <li key={index} className="text-sm truncate">
                  <a
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center"
                    title={source.title}
                  >
                    <span className="font-semibold mr-1">{index + 1}.</span>
                    <span className="truncate">{source.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-blue-600 flex items-center justify-center">
          <UserIcon className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};

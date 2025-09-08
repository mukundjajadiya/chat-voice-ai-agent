import React, { useState, useEffect, useCallback } from "react";

import { ChatHistory } from "./components/ChatHistory.tsx";
import { ChatInput } from "./components/ChatInput.tsx";
import {
  TrashIcon,
  SpeakerOnIcon,
  SpeakerOffIcon,
} from "./components/Icons.tsx";
import { MessageRole, type ChatMessage } from "./types.ts";
import { sendMessageToAI } from "./services/geminiService.ts";
import { useSpeechRecognition } from "./hooks/useSpeechRecognition.ts";

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);

  const [context] = useState("");

  // cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Speak function
  const speak = useCallback(
    (text: string) => {
      if (!isTtsEnabled || !text) return;
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    },
    [isTtsEnabled]
  );

  // Stop speaking function
  const stopSpeak = useCallback(() => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (isSending || !text.trim()) return;

      setIsSending(true);
      const userMessage: ChatMessage = { role: MessageRole.USER, text };
      const currentHistory = [...messages, userMessage];

      setMessages((prev) => [
        ...prev,
        userMessage,
        { role: MessageRole.MODEL, text: "..." },
      ]);

      try {
        const aiResponse = await sendMessageToAI(currentHistory, context);
        const modelMessage: ChatMessage = {
          role: MessageRole.MODEL,
          text: aiResponse.text,
          sources: aiResponse.sources,
        };

        setMessages((prev) => [...prev.slice(0, -1), modelMessage]);

        // 🔊 Speak only when enabled
        speak(aiResponse.text);
      } catch (error) {
        console.error("Error getting AI response:", error);
        const errorMessage: ChatMessage = {
          role: MessageRole.MODEL,
          text: "Sorry, something went wrong.",
        };
        setMessages((prev) => [...prev.slice(0, -1), errorMessage]);
      } finally {
        setIsSending(false);
      }
    },
    [isSending, messages, context, speak]
  );

  const {
    isListening,
    startListening,
    stopListening,
    error: recognitionError,
    isSupported: isRecognitionSupported,
  } = useSpeechRecognition(handleSendMessage);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleToggleTts = () => {
    setIsTtsEnabled((prev) => {
      const newValue = !prev;
      if (!newValue) {
        stopSpeak(); // stop any current speech when disabling TTS
      }
      return newValue;
    });
  };

  const handleClearChat = () => {
    setMessages([]);
    stopSpeak();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-blue-400"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm4-7H7V8h8v2z" />
          </svg>
          <h1 className="text-xl font-bold">AI Voice & Chat Agent</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleToggleTts}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            aria-label={
              isTtsEnabled ? "Disable text-to-speech" : "Enable text-to-speech"
            }
          >
            {isTtsEnabled ? (
              <SpeakerOnIcon className="w-6 h-6" />
            ) : (
              <SpeakerOffIcon className="w-6 h-6" />
            )}
          </button>
          <button
            onClick={handleClearChat}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Clear chat history"
          >
            <TrashIcon className="w-6 h-6" />
          </button>
        </div>
      </header>

      <ChatHistory messages={messages} />

      {recognitionError && (
        <div className="text-center text-red-400 p-2 bg-red-900/50">
          {recognitionError}
        </div>
      )}

      <ChatInput
        onSendMessage={handleSendMessage}
        isListening={isListening}
        onToggleListening={toggleListening}
        isSending={isSending}
        isRecognitionSupported={isRecognitionSupported}
      />
    </div>
  );
};

export default App;

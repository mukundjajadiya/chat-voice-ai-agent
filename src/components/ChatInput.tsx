
import React, { useState } from 'react';
import { SendIcon, MicrophoneIcon } from './Icons.tsx';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isListening: boolean;
  onToggleListening: () => void;
  isSending: boolean;
  isRecognitionSupported: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isListening,
  onToggleListening,
  isSending,
  isRecognitionSupported,
}) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && !isSending) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="bg-gray-800 p-4 border-t border-gray-700">
      <div className="relative max-w-4xl mx-auto">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message or use the microphone..."
          disabled={isSending || isListening}
          className="w-full bg-gray-700 text-white rounded-full py-3 pl-5 pr-28 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 disabled:opacity-50"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          {isRecognitionSupported && (
             <button
                onClick={onToggleListening}
                disabled={isSending}
                className={`p-2 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse focus:ring-red-500'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500 focus:ring-blue-500'
                }`}
                aria-label={isListening ? 'Stop listening' : 'Start listening'}
              >
              <MicrophoneIcon className="w-6 h-6" />
            </button>
          )}
          <button
            onClick={handleSend}
            disabled={!text.trim() || isSending}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300"
            aria-label="Send message"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
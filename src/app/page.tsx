"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import {
  SendIcon,
  Loader2Icon,
  MessageSquareIcon,
  BotIcon,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

export interface MessageContentProps {
  part: {
    type: string;
    text?: string;
    [key: string]: any;
  };
  messageId: string;
  partIndex: number;
}

const MessageContent = ({
  part,
  messageId,
  partIndex,
}: MessageContentProps) => {
  const key = `${messageId}-${partIndex}`;

  if (part.type === "text" && part.text) {
    return (
      <div key={key} className="leading-relaxed">
        <ReactMarkdown
          components={{
            li: ({ children, ...props }) => (
              <li {...props} className="mb-1">
                {children}
              </li>
            ),
            ol: ({ children, ...props }) => (
              <ol {...props} className="list-decimal ml-5 mt-2 mb-2 space-y-1">
                {children}
              </ol>
            ),
            ul: ({ children, ...props }) => (
              <ul {...props} className="list-disc ml-5 mt-2 mb-2 space-y-1">
                {children}
              </ul>
            ),
            p: ({ children, ...props }) => (
              <p {...props} className="mb-2 last:mb-0">
                {children}
              </p>
            ),
          }}
        >
          {part.text}
        </ReactMarkdown>
      </div>
    );
  }
  return null;
};

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isStreaming = status === "streaming";

  const handleSend = () => {
    if (input.trim() === "" || isStreaming) return;
    sendMessage({ text: input });
    setInput("");
  };

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
      }
    };

    if (!isStreaming) {
      textInputRef.current?.focus();
    }

    scrollToBottom();
  }, [isStreaming, messages.length]);
  return (
    <div className="flex flex-col h-screen bg-white overflow-x-hidden">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-2">
            <MessageSquareIcon className="w-5 h-5 text-black" />
            <h1 className="text-xl font-bold text-black">SQL Genie</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto bg-white" ref={messagesEndRef}>
        <div className="max-w-5xl mx-auto px-6 py-8">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="w-12 h-12 bg-black rounded-full mb-4 flex items-center justify-center">
                <MessageSquareIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-black mb-2">
                Start a conversation
              </h2>
              <p className="text-gray-600 text-sm">
                Send a message to begin chatting
              </p>
            </div>
          )}

          <div className="space-y-8">
            {messages.map((message, index) => {
              const isUser = message.role === "user";

              if (isStreaming && messages.length - 1 == index) return null;

              return (
                <div
                  key={message.id}
                  className={`flex gap-4 ${isUser ? "flex-row-reverse" : ""}`}
                >
                  <div className="shrink-0 w-8 h-8">
                    {isUser ? (
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs font-medium">
                        U
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <BotIcon className="w-4 h-4 text-gray-700" />
                      </div>
                    )}
                  </div>

                  <div
                    className={`flex-1 space-y-2 ${
                      isUser ? "max-w-lg text-right" : "max-w-2xl text-left"
                    }`}
                  >
                    <div
                      className={`text-sm font-medium ${
                        isUser ? "text-right" : "text-left"
                      } text-gray-900`}
                    >
                      {isUser ? "You" : "Assistant"}
                    </div>
                    <div
                      className={`inline-block p-3 rounded-xl max-w-full text-[15px] leading-7 ${
                        isUser
                          ? "bg-black text-white rounded-tr-sm"
                          : "bg-gray-100 text-gray-800 rounded-tl-sm"
                      }`}
                    >
                      {message.parts.map((part: any, i: number) => (
                        <MessageContent
                          key={`${message.id}-${i}`}
                          part={part}
                          messageId={message.id}
                          partIndex={i}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {isStreaming && (
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <BotIcon className="w-4 h-4 text-gray-700" />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="text-sm font-medium text-gray-900">
                    Assistant
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Loader2Icon className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {messages.length > 0 && <div className="h-32" />}
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-end gap-3">
            <textarea
              ref={textInputRef}
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Send a message..."
              disabled={isStreaming}
              rows={1}
              className="flex-1 resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-[15px] text-gray-900 placeholder-gray-500 focus:border-black focus:outline-none focus:ring-1 focus:ring-black disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
              style={{
                minHeight: "44px",
                maxHeight: "200px",
              }}
            />
            <button
              onClick={handleSend}
              disabled={input.trim() === "" || isStreaming}
              className="shrink-0 h-11 px-4 rounded-lg bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isStreaming ? (
                <Loader2Icon className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <SendIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Send</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

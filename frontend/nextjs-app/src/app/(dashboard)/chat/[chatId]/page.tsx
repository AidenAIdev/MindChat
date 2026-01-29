'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { chatConnection } from '@/lib/signalr/chat-connection';
import { chatsApi } from '@/lib/api/chats.api';
import { useAuthStore } from '@/lib/store/auth.store';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { GlassCard } from '@/components/shared/GlassCard';
import { ArrowLeft, Send } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  senderUserId: string;
  message: string;
  sentAt: string;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.chatId as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    if (!chatId || !token) {
      toast.error('Invalid chat or missing authentication');
      router.push('/dashboard');
      return;
    }

    initializeChat();

    return () => {
      cleanup();
    };
  }, [chatId, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      console.log('🔄 Initializing chat...', chatId);

      // Step 1: Connect to SignalR
      if (!chatConnection.isConnected()) {
        await chatConnection.connect(token!);
      }

      // Step 2: Set up event listeners
      chatConnection.on('ReceiveMessage', handleReceiveMessage);
      chatConnection.on('UserTyping', handleUserTyping);
      chatConnection.on('UserStoppedTyping', handleUserStoppedTyping);
      chatConnection.on('ChatHistory', handleChatHistory);
      chatConnection.on('Reconnected', handleReconnected);

      // Step 3: Join the chat room
      await chatConnection.joinChat(chatId);

      // Step 4: Load existing messages (if history doesn't come automatically)
      const chatData = await chatsApi.getWithMessages(chatId);
      if (chatData.data.messages) {
        setMessages(chatData.data.messages);
      }

      setIsConnected(true);
      setIsLoading(false);

      console.log('✅ Chat initialized successfully');

    } catch (error) {
      console.error('❌ Failed to initialize chat:', error);
      toast.error('Failed to connect to chat');
      setIsLoading(false);
    }
  };

  const cleanup = async () => {
    console.log('🧹 Cleaning up chat...');

    try {
      chatConnection.off('ReceiveMessage', handleReceiveMessage);
      chatConnection.off('UserTyping', handleUserTyping);
      chatConnection.off('UserStoppedTyping', handleUserStoppedTyping);
      chatConnection.off('ChatHistory', handleChatHistory);
      chatConnection.off('Reconnected', handleReconnected);

      await chatConnection.leaveChat(chatId);
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  };

  const handleReceiveMessage = (data: any) => {
    console.log('📨 New message received:', data);

    const newMessage: Message = {
      id: Date.now().toString(),
      senderUserId: data.senderUserId,
      message: data.message,
      sentAt: data.sentAt || new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const handleUserTyping = (data: any) => {
    // Only show typing indicator if it's not the current user
    if (data.userId !== user?.userId) {
      setIsTyping(true);
    }
  };

  const handleUserStoppedTyping = (data: any) => {
    if (data.userId !== user?.userId) {
      setIsTyping(false);
    }
  };

  const handleChatHistory = (history: Message[]) => {
    console.log('📚 Chat history received:', history);
    setMessages(history);
  };

  const handleReconnected = async () => {
    console.log('🔄 Reconnected, rejoining chat...');
    try {
      await chatConnection.joinChat(chatId);
      toast.success('Reconnected to chat');
    } catch (error) {
      console.error('Failed to rejoin after reconnect:', error);
    }
  };

  const handleSendMessage = async () => {
    const messageText = inputValue.trim();

    if (!messageText) {
      return;
    }

    if (!isConnected) {
      toast.error('Not connected to chat');
      return;
    }

    try {
      console.log('📤 Sending message...');

      // Send via SignalR
      await chatConnection.sendMessage(chatId, messageText);

      // Clear input
      setInputValue('');

      // Stop typing indicator
      await chatConnection.stopTyping(chatId);

      console.log('✅ Message sent');

    } catch (error) {
      console.error('❌ Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Send typing indicator
    if (value && isConnected) {
      await chatConnection.typing(chatId);

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing after 2 seconds of no input
      typingTimeoutRef.current = setTimeout(async () => {
        await chatConnection.stopTyping(chatId);
      }, 2000);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Connecting to chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/10 border-b border-white/20 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">Chat</h2>
            <p className="text-sm text-gray-400">
              {isConnected ? (
                <span className="text-green-400">● Connected</span>
              ) : (
                <span className="text-yellow-400">● Connecting...</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}

        {messages.map((msg, index) => {
          const isOwnMessage = msg.senderUserId === user?.userId;

          return (
            <div
              key={msg.id || index}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  isOwnMessage
                    ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white ml-auto'
                    : 'backdrop-blur-xl bg-white/10 border border-white/20 text-white'
                }`}
              >
                <p className="break-words">{msg.message}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(msg.sentAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="backdrop-blur-xl bg-white/10 border-t border-white/20 p-4">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-lg backdrop-blur-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={!isConnected}
          />

          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || !isConnected}
            className="p-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

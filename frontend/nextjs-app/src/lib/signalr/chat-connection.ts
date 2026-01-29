'use client';

import * as signalR from '@microsoft/signalr';

interface Message {
  id: string;
  chatId: string;
  senderUserId: string;
  message: string;
  sentAt: string;
}

class ChatConnection {
  private connection: signalR.HubConnection | null = null;
  private currentChatId: string | null = null;
  private listeners: Map<string, Function[]> = new Map();

  async connect(token: string) {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      console.log('✅ SignalR already connected');
      return;
    }

    console.log('🔌 Connecting to SignalR...');

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5003/chatHub', {
        accessTokenFactory: () => token,
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets |
                   signalR.HttpTransportType.ServerSentEvents |
                   signalR.HttpTransportType.LongPolling
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          if (retryContext.elapsedMilliseconds < 60000) {
            return Math.random() * 5000;
          }
          return null;
        }
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.setupEventHandlers();

    try {
      await this.connection.start();
      console.log('✅ SignalR connected successfully');
    } catch (error) {
      console.error('❌ SignalR connection failed:', error);
      throw error;
    }
  }

  private setupEventHandlers() {
    if (!this.connection) return;

    // Receive messages from ANY user in the chat
    this.connection.on('ReceiveMessage', (chatId: string, senderUserId: string, message: string, sentAt: string) => {
      console.log('📨 Message received:', { chatId, senderUserId, message });

      this.emit('ReceiveMessage', {
        chatId,
        senderUserId,
        message,
        sentAt
      });
    });

    this.connection.on('UserJoined', (chatId: string, userId: string, userName: string) => {
      console.log('👋 User joined:', userName);
      this.emit('UserJoined', { chatId, userId, userName });
    });

    this.connection.on('UserLeft', (chatId: string, userId: string, userName: string) => {
      console.log('👋 User left:', userName);
      this.emit('UserLeft', { chatId, userId, userName });
    });

    this.connection.on('UserTyping', (chatId: string, userId: string, userName: string) => {
      console.log('✍️ User typing:', userName);
      this.emit('UserTyping', { chatId, userId, userName });
    });

    this.connection.on('UserStoppedTyping', (chatId: string, userId: string, userName: string) => {
      console.log('✍️ User stopped typing:', userName);
      this.emit('UserStoppedTyping', { chatId, userId, userName });
    });

    this.connection.on('ChatHistory', (messages: Message[]) => {
      console.log('📚 Chat history received:', messages.length, 'messages');
      this.emit('ChatHistory', messages);
    });

    this.connection.onreconnecting(() => {
      console.log('🔄 SignalR reconnecting...');
      this.emit('Reconnecting', {});
    });

    this.connection.onreconnected(async () => {
      console.log('✅ SignalR reconnected');

      // Rejoin the chat room if we were in one
      if (this.currentChatId) {
        console.log('🔄 Rejoining chat:', this.currentChatId);
        await this.joinChat(this.currentChatId);
      }

      this.emit('Reconnected', {});
    });

    this.connection.onclose(() => {
      console.log('❌ SignalR connection closed');
      this.emit('Disconnected', {});
    });
  }

  async joinChat(chatId: string) {
    if (!this.connection) {
      throw new Error('Not connected to SignalR');
    }

    try {
      console.log('🚪 Joining chat:', chatId);
      await this.connection.invoke('JoinChat', chatId);
      this.currentChatId = chatId;
      console.log('✅ Joined chat successfully');
    } catch (error) {
      console.error('❌ Failed to join chat:', error);
      throw error;
    }
  }

  async sendMessage(chatId: string, message: string) {
    if (!this.connection) {
      throw new Error('Not connected to SignalR');
    }

    try {
      console.log('📤 Sending message:', { chatId, message });
      await this.connection.invoke('SendMessage', chatId, message);
      console.log('✅ Message sent successfully');
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      throw error;
    }
  }

  async typing(chatId: string) {
    if (!this.connection) return;

    try {
      await this.connection.invoke('Typing', chatId);
    } catch (error) {
      console.error('Failed to send typing indicator:', error);
    }
  }

  async stopTyping(chatId: string) {
    if (!this.connection) return;

    try {
      await this.connection.invoke('StopTyping', chatId);
    } catch (error) {
      console.error('Failed to stop typing indicator:', error);
    }
  }

  async leaveChat(chatId: string) {
    if (!this.connection) return;

    try {
      console.log('🚪 Leaving chat:', chatId);
      await this.connection.invoke('LeaveChat', chatId);
      this.currentChatId = null;
      console.log('✅ Left chat successfully');
    } catch (error) {
      console.error('❌ Failed to leave chat:', error);
    }
  }

  on(event: string, handler: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(handler);
  }

  off(event: string, handler: Function) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  async disconnect() {
    if (this.currentChatId) {
      await this.leaveChat(this.currentChatId);
    }

    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      this.listeners.clear();
    }
  }

  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }
}

// Export singleton instance
export const chatConnection = new ChatConnection();

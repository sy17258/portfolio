'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, X, Minimize2, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  intent?: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hi! 👋 I'm Shivam's portfolio assistant. I can help you learn about his experience, projects, skills, and background. What would you like to know?",
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
      setHasUnreadMessages(false);
    }
  }, [isOpen, isMinimized]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + K to open chatbot
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
        setIsMinimized(false);
      }
      
      // Escape to close chatbot
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Mark new messages as unread when chatbot is closed
  useEffect(() => {
    if (!isOpen && messages.length > 1 && messages[messages.length - 1].role === 'assistant') {
      setHasUnreadMessages(true);
    }
  }, [messages, isOpen]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': getSessionId(),
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        role: 'assistant',
        timestamp: new Date(),
        intent: data.intent,
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Show notification if chatbot is closed
      if (!isOpen) {
        setHasUnreadMessages(true);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: error instanceof Error && error.message.includes('Rate limit') 
          ? "I'm receiving too many messages right now. Please wait a moment before trying again! 😊"
          : "Sorry, I'm having trouble responding right now. Please try again later or contact Shivam directly at shivamydv.work@gmail.com 📧",
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, isOpen]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "Tell me about your projects",
    "What's your experience?", 
    "What technologies do you use?",
    "How can I contact you?",
    "Are you available for hire?"
  ];

  const handleQuickQuestion = useCallback((question: string) => {
    setInput(question);
    // Use setTimeout to ensure state is updated before sending
    setTimeout(() => sendMessage(), 100);
  }, [sendMessage]);

  const getSessionId = (): string => {
    if (typeof window !== 'undefined') {
      let sessionId = sessionStorage.getItem('chatbot_session');
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(7);
        sessionStorage.setItem('chatbot_session', sessionId);
      }
      return sessionId;
    }
    return 'server';
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 relative"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
          {hasUnreadMessages && (
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
              <div className="h-2 w-2 bg-white rounded-full animate-pulse" />
            </div>
          )}
          <span className="sr-only">Open chat</span>
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 w-80 sm:w-96 bg-background border rounded-lg shadow-2xl transition-all duration-300 z-50 flex flex-col",
        isMinimized ? "h-14" : "h-[500px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/50 rounded-t-lg flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="font-medium text-sm">Portfolio Assistant</span>
          <span className="text-xs text-muted-foreground">Powered by Shivam</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start space-x-2",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {message.role === 'assistant' && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
                
                <div
                  className={cn(
                    "max-w-[85%] p-3 rounded-lg text-sm",
                    message.role === 'user'
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className="text-xs opacity-70 mt-1 flex items-center justify-between">
                    <span>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {message.intent && (
                      <span className="text-[10px] bg-background/20 px-1 rounded">
                        {message.intent}
                      </span>
                    )}
                  </div>
                </div>
                
                {message.role === 'user' && (
                  <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-medium text-secondary-foreground">U</span>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-2 justify-start">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="h-3 w-3 text-primary-foreground" />
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex-shrink-0">
              <div className="text-xs text-muted-foreground mb-2">💡 Quick questions:</div>
              <div className="flex flex-wrap gap-1">
                {quickQuestions.map((question) => (
                  <Button
                    key={question}
                    variant="outline"
                    size="sm"
                    className="text-xs h-6 hover:scale-105 transition-transform"
                    onClick={() => handleQuickQuestion(question)}
                    disabled={isLoading}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t bg-background rounded-b-lg flex-shrink-0">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Shivam's portfolio..."
                disabled={isLoading}
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                maxLength={500}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {input.length > 400 && (
              <div className="text-xs text-muted-foreground mt-1">
                {500 - input.length} characters remaining
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

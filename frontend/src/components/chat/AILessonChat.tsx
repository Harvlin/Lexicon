import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AILessonChatProps {
  lessonTitle: string;
  lessonId: string;
}

const AILessonChat: React.FC<AILessonChatProps> = ({ lessonTitle, lessonId }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `Hello! I'm your AI tutor for "${lessonTitle}". I'm here to help you understand the concepts, answer questions, and provide personalized explanations. What would you like to know?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      "Great question! Let me break this down for you. This concept is fundamental because it allows you to understand how data flows through your application.",
      "I can see you're thinking deeply about this! Here's another way to approach this problem that might help clarify things.",
      "That's an excellent observation! This is actually a common pattern in programming, and understanding it will help you in many other scenarios.",
      "Perfect! You're on the right track. Let me add some additional context that will help solidify your understanding.",
      "Interesting question! This touches on some advanced concepts. Let me explain it step by step to make it clearer."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className="card-gradient h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-primary" />
          </div>
          AI Tutor Chat
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-6 pb-4">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'ai' 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {message.type === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    
                    <div className={`px-4 py-3 rounded-lg ${
                      message.type === 'ai' 
                        ? 'ai-message text-white' 
                        : 'user-message'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <span className={`text-xs mt-2 block ${
                        message.type === 'ai' ? 'text-white/70' : 'text-muted-foreground'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="ai-message text-white px-4 py-3 rounded-lg">
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 bg-white/70 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-white/70 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-white/70 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-6 border-t border-border/50">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about this lesson..."
              className="min-h-[60px] resize-none"
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isTyping}
              className="px-4 self-end hover-glow"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AILessonChat;
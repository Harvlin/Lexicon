import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Brain, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { mockChatMessages } from '@/lib/mock-data';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState(mockChatMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: newMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: "I understand your question! Let me help you with that. This is a simulated AI response that would provide intelligent, contextual assistance based on your learning progress and the specific lesson content.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-gradient-ai mb-2">AI Study Assistant</h1>
          <p className="text-muted-foreground">Get personalized help with your learning journey</p>
        </motion.div>

        <Card className="card-gradient h-[calc(100vh-200px)] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <span>Chat with AI Tutor</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className={message.type === 'ai' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}>
                        {message.type === 'ai' ? <Brain className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`p-3 rounded-lg ${message.type === 'ai' ? 'ai-message text-white' : 'user-message'}`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask me anything about your lessons..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} className="bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
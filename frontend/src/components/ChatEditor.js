import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, User, Bot, AlertCircle } from 'lucide-react';

const ChatEditor = ({ chatHistory, onEdit, widgetTitle }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isTyping) return;

    const editMessage = message.trim();
    setMessage('');
    setIsTyping(true);

    try {
      await onEdit(editMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case 'user':
        return <User className="h-4 w-4 text-blue-600" />;
      case 'assistant':
        return <Bot className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const getMessageStyle = (type) => {
    switch (type) {
      case 'user':
        return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'assistant':
        return 'bg-green-50 border-green-200 text-green-900';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="card h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
        <MessageSquare className="h-5 w-5 text-primary-600" />
        <div>
          <h3 className="font-semibold text-gray-900">Edit {widgetTitle}</h3>
          <p className="text-sm text-gray-500">Ask for changes in plain English</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {chatHistory.map((chat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-start space-x-3 ${
                chat.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                chat.type === 'user' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                {getMessageIcon(chat.type)}
              </div>
              
              <div className={`flex-1 max-w-xs lg:max-w-md ${
                chat.type === 'user' ? 'text-right' : ''
              }`}>
                <div className={`inline-block px-4 py-2 rounded-lg border ${getMessageStyle(chat.type)}`}>
                  <p className="text-sm">{chat.message}</p>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {formatTime(chat.timestamp)}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start space-x-3"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Bot className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1 max-w-xs lg:max-w-md">
              <div className="inline-block px-4 py-2 rounded-lg border bg-green-50 border-green-200">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g., 'Make the button green' or 'Add one more question'"
            className="flex-1 input-field text-sm"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!message.trim() || isTyping}
            className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        
        {/* Quick Suggestions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            'Make it colorful',
            'Add more questions',
            'Change the title',
            'Make it bigger'
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setMessage(suggestion)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatEditor;

import React, { useState, useEffect, useRef } from 'react';
import { Send, Download, Home } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Project, Message } from '../types';
import { chatAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from "react-router-dom";

interface ChatInterfaceProps {
  project: Project;
}

const ChatInterface: React.FC<ChatInterfaceProps> = () => {
  const { state } = useLocation();
  const project = state?.project;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const response = await chatAPI.getChatHistory(project.id);
        setMessages(response.data);
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };

    loadChatHistory();
  }, [project.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage: Message = {
      project_id: project.id,
      chat_id: project.chat_id,
      message: inputMessage,
      sender_type: 'USER',
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await chatAPI.sendMessage(project.id, inputMessage);
      const botMessage: Message = {
        project_id: project.project_id,
        chat_id: project.chat_id,
        message: response.data.llm_response,
        sender_type: 'SYSTEM',
        sources: response.data.matches,
        created_at: Date.now().toString(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      toast.error('Failed to send message');
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportChat = () => {
    const chatText = messages.map(msg => 
      `${msg.sender_type === 'USER' ? 'USER' : 'SYSTEM'}: ${msg.message}\n`
    ).join('\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title}-chat-export.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={handleGoHome}
              className="p-1 sm:p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Go to Dashboard"
            >
              <Home className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="truncate">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                {project.title}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Created {new Date(project.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={exportChat}
            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1 sm:py-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:px-8 sm:py-6 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Start a conversation
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Ask questions about your PDF document. I can help you summarize, analyze, or find specific information.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex mb-3 ${message.sender_type === 'USER' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] px-4 py-3 rounded-2xl ${
                    message.sender_type === 'USER'
                      ? 'bg-gray-700 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{message.message}</ReactMarkdown>
                  </div>
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Sources:</p>
                      <div className="flex flex-wrap gap-1">
                        {message.sources.map((source, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded"
                          >
                            {source.document}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {loading && (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                  <span className="text-gray-500 dark:text-gray-400">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Modified for better mobile layout */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask a question..."
              disabled={loading}
              className="flex-1 min-w-0 px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 text-sm sm:text-base"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="px-3 py-2 sm:px-4 sm:py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
              <span className="sr-only sm:not-sr-only sm:ml-2">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
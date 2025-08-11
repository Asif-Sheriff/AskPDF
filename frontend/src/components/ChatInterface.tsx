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
    <div className="flex flex-col h-screen bg-[#f9f4e8]">
      {/* Header - Mobile Optimized */}
      <div className="bg-white border-b-4 border-black px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={handleGoHome}
              className="p-1 sm:p-2 rounded-md hover:bg-[#ffd5cd] active:translate-y-0.5 border-2 border-black shadow-[2px_2px_0_0_#000] hover:shadow-[1px_1px_0_0_#000] transition-all"
              title="Go to Dashboard"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
            </button>
            <div className="truncate max-w-[140px] sm:max-w-none">
              <h1 className="text-sm sm:text-xl font-bold text-black truncate">
                {project.title}
              </h1>
              <p className="text-xs text-black">
                {new Date(project.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={exportChat}
            className="flex items-center space-x-1 px-2 py-1 sm:px-4 sm:py-2 bg-[#ffd5cd] border-2 border-black shadow-[2px_2px_0_0_#000] hover:shadow-[1px_1px_0_0_#000] active:translate-y-0.5 transition-all text-xs sm:text-base"
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline ml-1">Export</span>
          </button>
        </div>
      </div>

      {/* Messages - Mobile Optimized */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-3 bg-[#f9f4e8]">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full px-2">
            <div className="text-center w-full max-w-md p-4 sm:p-6 border-2 border-black bg-white shadow-[4px_4px_0_0_#000] mx-2">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#ffd5cd] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border-2 border-black">
                <Send className="w-5 h-5 sm:w-8 sm:h-8 text-black" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-black mb-2">
                Start a conversation
              </h3>
              <p className="text-sm sm:text-base text-black">
                Ask questions about your PDF document.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-1 sm:px-0">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex mb-3 sm:mb-4 ${message.sender_type === 'USER' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[85%] px-3 py-2 sm:px-4 sm:py-3 rounded-lg border-2 border-black shadow-[2px_2px_0_0_#000] sm:shadow-[3px_3px_0_0_#000] ${
                    message.sender_type === 'USER'
                      ? 'bg-[#a8e1ff]'
                      : 'bg-white'
                  }`}
                >
                  <div className="prose prose-sm max-w-none text-sm sm:text-base">
                    <ReactMarkdown>{message.message}</ReactMarkdown>
                  </div>
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-1 sm:mt-2 pt-1 sm:pt-2 border-t-2 border-black">
                      <p className="text-xs font-bold text-black mb-1">Sources:</p>
                      <div className="flex flex-wrap gap-1">
                        {message.sources.map((source, index) => (
                          <span
                            key={index}
                            className="inline-block px-1 py-0.5 sm:px-2 sm:py-1 text-xxs sm:text-xs bg-[#ffd5cd] border border-black rounded"
                          >
                            {source.document}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-xxs sm:text-xs text-black mt-1 sm:mt-2 font-mono">
                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {loading && (
          <div className="max-w-4xl mx-auto px-1 sm:px-0">
            <div className="flex justify-start">
              <div className="bg-white border-2 border-black shadow-[2px_2px_0_0_#000] sm:shadow-[3px_3px_0_0_#000] rounded-lg px-3 py-2 sm:px-4 sm:py-3">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-black"></div>
                  <span className="text-sm sm:text-base text-black font-bold">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Mobile Optimized */}
      <div className="bg-white border-t-4 border-black p-2 sm:p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask a question..."
              disabled={loading}
              className="flex-1 min-w-0 px-3 py-2 sm:px-4 sm:py-3 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 bg-white text-black placeholder-black font-bold disabled:opacity-50 shadow-[2px_2px_0_0_#000] sm:shadow-[3px_3px_0_0_#000] text-sm sm:text-base"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="px-3 py-2 sm:px-4 sm:py-3 bg-[#a8e1ff] text-black border-2 border-black rounded-lg hover:bg-[#8cd4ff] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-[2px_2px_0_0_#000] sm:shadow-[3px_3px_0_0_#000] hover:shadow-[1px_1px_0_0_#000] active:translate-y-0.5 font-bold"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline ml-1 sm:ml-2">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
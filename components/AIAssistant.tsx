
import React, { useState, useEffect, useRef } from 'react';
import type { Repository } from '../types';
import { startRepoChat, sendChatMessage } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import LoadingSpinner from './LoadingSpinner';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  repo: Repository;
}

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, repo }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      startRepoChat(repo.description);
      setMessages([{ sender: 'ai', text: `Hi! I'm your AI assistant for the "${repo.name}" repository. How can I help you?` }]);
    }
  }, [isOpen, repo.name, repo.description]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const response = await sendChatMessage(input);
    
    const aiMessage: Message = { sender: 'ai', text: response.text };
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };
  
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-gray-950 bg-opacity-80 z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-gray-900 shadow-2xl flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <header className="flex items-center justify-between p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold flex items-center gap-2"><SparklesIcon className="w-5 h-5 text-purple-400" /> AI Assistant</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
            </header>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-sm rounded-lg px-4 py-2 ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-200'}`}>
                            <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-800 rounded-lg px-4 py-2">
                           <LoadingSpinner size="sm" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-gray-700">
                <div className="flex items-center bg-gray-800 rounded-lg">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about this repo..."
                        className="flex-1 bg-transparent p-3 text-sm text-white placeholder-gray-500 focus:outline-none"
                        disabled={isLoading}
                    />
                    <button type="submit" className="p-3 text-blue-500 hover:text-blue-400 disabled:text-gray-600" disabled={isLoading || !input.trim()}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default AIAssistant;

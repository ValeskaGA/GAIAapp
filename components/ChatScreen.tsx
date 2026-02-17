
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { geminiService } from '../services/geminiService';
import { Message, ModelType } from '../types';

const ChatScreen: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: 'Hola. Soy GAIA, tu espacio de tranquilidad. Estoy aquí para escucharte sin juicios. ¿Cómo te sientes hoy?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modelType, setModelType] = useState<ModelType>(ModelType.PRO);
  const chatEndRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let modelResponseText = '';
      const responseStream = geminiService.sendMessageStream(input);

      const modelMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: modelMessageId,
        role: 'model',
        text: '',
        timestamp: new Date(),
      }]);

      for await (const chunk of responseStream) {
        modelResponseText += chunk;
        setMessages(prev => prev.map(msg =>
          msg.id === modelMessageId ? { ...msg, text: modelResponseText } : msg
        ));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleModel = () => {
    const nextModel = modelType === ModelType.PRO ? ModelType.FLASH : ModelType.PRO;
    setModelType(nextModel);
    geminiService.startNewChat(nextModel);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-[#191121] dark:to-[#2d1b42] pt-safe pb-safe">
      <header className="flex items-center justify-between px-6 pt-2 pb-4 z-20">
        <button
          onClick={() => navigate('/menu')}
          className="p-2 -ml-2 rounded-full hover:bg-white/20 text-gray-800 dark:text-white"
        >
          <span className="material-symbols-outlined text-[28px]">menu</span>
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold tracking-tight text-primary dark:text-purple-300">GAIA</h1>
          <button
            onClick={toggleModel}
            className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
          >
            {modelType === ModelType.PRO ? 'Modo Reflexivo' : 'Modo Rápido'}
          </button>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 px-4 pb-4 overflow-hidden flex flex-col">
        <div className="flex-1 bg-white/75 dark:bg-black/40 backdrop-blur-md rounded-3xl shadow-sm flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6 no-scrollbar">
            <div className="flex justify-center">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-widest bg-white/50 dark:bg-white/10 px-3 py-1 rounded-full">Hoy</span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden ${msg.role === 'model'
                  ? 'bg-primary/10 text-primary'
                  : 'bg-gaia-purple-vibrant text-white'
                  }`}>
                  <span className="material-symbols-outlined text-sm">
                    {msg.role === 'model' ? 'spa' : 'person'}
                  </span>
                </div>
                <div className={`flex flex-col gap-1 max-w-[80%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                  <span className="text-xs text-gray-500 ml-1">
                    {msg.role === 'model' ? 'GAIA' : 'Tú'}
                  </span>
                  <div className={`p-4 rounded-2xl shadow-sm text-[15px] leading-relaxed ${msg.role === 'model'
                    ? 'bg-white dark:bg-[#2d1b42] rounded-bl-none text-text-main dark:text-text-dark-main'
                    : 'bg-primary text-white rounded-br-none'
                    }`}>
                    {msg.text || (isLoading && msg.role === 'model' && msg.id === messages[messages.length - 1].id ? '...' : '')}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-t border-white/20">
            <div className="relative flex items-end gap-2">
              <div className="flex-1 bg-white dark:bg-[#2d1b42] rounded-3xl border border-purple-100 dark:border-purple-900/30">
                <textarea
                  className="w-full bg-transparent border-0 rounded-3xl py-3.5 px-5 placeholder:text-gray-400 focus:ring-0 resize-none max-h-32 text-text-main dark:text-text-dark-main"
                  placeholder="Escribe cómo te sientes..."
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                ></textarea>
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`h-[52px] w-[52px] rounded-full flex items-center justify-center shadow-lg transition-all ${!input.trim() || isLoading
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-purple-700 active:scale-95'
                  }`}
              >
                <span className="material-symbols-outlined">
                  {isLoading ? 'hourglass_empty' : 'arrow_upward'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatScreen;

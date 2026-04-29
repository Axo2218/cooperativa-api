import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "¡Hola! Soy la IA de CooPesca. ¿En qué puedo ayudarte hoy?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Respuesta
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "todavia no he habilitado esta funcion xdd",
        isBot: true
      }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Ventana del Chat */}
      {isOpen && (
        <div className="mb-4 w-80 h-96 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-emerald-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-wider leading-none">Asistente IA</p>
                <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse"></span> En línea
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-hide"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${msg.isBot
                    ? 'bg-zinc-800 text-zinc-300 rounded-tl-none'
                    : 'bg-emerald-600 text-white rounded-tr-none'
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-zinc-800 bg-zinc-900/50">
            <div className="relative">
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-4 pr-10 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-emerald-500 hover:text-emerald-400 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Botón Flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 group ${isOpen
            ? 'bg-zinc-800 text-white rotate-90'
            : 'bg-emerald-500 text-black hover:shadow-emerald-500/20'
          }`}
      >
        {isOpen ? <X size={24} /> : <Bot size={24} className="group-hover:animate-bounce" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default AIChatbot;

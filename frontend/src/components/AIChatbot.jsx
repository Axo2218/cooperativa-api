import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Zap } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../services/api';

const AIChatbot = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Mapa de rutas para la navegación de COOPIA
  const sectionRoutes = {
    'dashboard': '/dashboard',
    'geolocalizacion': '/geolocalizacion',
    'viajes': '/operaciones/viajes',
    'tripulacion': '/operaciones/tripulacion',
    'capturas': '/operaciones/capturas',
    'gastos': '/operaciones/gastos'
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { text: "¡Hola! Soy COOPIA, la IA de CooPesca. ¿En qué puedo ayudarte con la gestión de la cooperativa hoy?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data } = await axios.post('/ai/chat', { 
        message: input,
        context: location.pathname
      });
      
      let aiText = data.text;

      // DETECTOR DE NAVEGACIÓN: [GOTO:seccion]
      const gotoMatch = aiText.match(/\[GOTO:(.*?)\]/);
      if (gotoMatch) {
        const section = gotoMatch[1].trim().toLowerCase();
        const route = sectionRoutes[section];
        
        if (route) {
          console.log(`COOPIA navegando a: ${route}`);
          navigate(route);
          // Limpiamos el comando del texto para que el usuario no lo vea
          aiText = aiText.replace(/\[GOTO:.*?\]/g, '').trim();
        }
      }
      
      setMessages(prev => [...prev, { ...data, text: aiText }]);
    } catch (error) {
      console.error('Error en COOPIA:', error);
      const serverError = error.response?.data?.error || "Hubo un error al conectar con mis sistemas.";
      setMessages(prev => [...prev, { 
        text: serverError, 
        isBot: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Ventana del Chat */}
      {isOpen && (
        <div className="mb-4 w-80 h-96 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                <Zap size={18} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-widest leading-none">COOPIA <span className="text-[8px] text-emerald-500 ml-1 opacity-50">v1.5</span></p>
                <p className="text-[10px] text-zinc-500 flex items-center gap-1 mt-1">
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isLoading ? 'bg-amber-500' : 'bg-emerald-500'}`}></span> 
                  {isLoading ? 'Analizando...' : 'Sistema Activo'}
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
                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end animate-in slide-in-from-right-2 duration-300'}`}
              >
                <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] leading-relaxed shadow-sm ${msg.isBot
                    ? 'bg-zinc-800/50 text-zinc-200 border border-zinc-700/50 rounded-tl-none'
                    : 'bg-emerald-500 text-black font-medium rounded-tr-none'
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-zinc-800/50 p-3 rounded-2xl rounded-tl-none border border-zinc-700/50">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-zinc-500 rounded-full"></div>
                    <div className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-zinc-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
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

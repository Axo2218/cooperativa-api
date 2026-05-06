import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmar", cancelText = "Cancelar", type = "danger" }) => {
  if (!isOpen) return null;

  const colors = {
    danger: {
      icon: 'bg-red-500/20 text-red-500',
      button: 'bg-red-600 hover:bg-red-500 shadow-red-500/20',
      border: 'border-red-500/20'
    },
    warning: {
      icon: 'bg-amber-500/20 text-amber-500',
      button: 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20',
      border: 'border-amber-500/20'
    },
    success: {
      icon: 'bg-emerald-500/20 text-emerald-500',
      button: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20',
      border: 'border-emerald-500/20'
    }
  };

  const style = colors[type] || colors.danger;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] px-4 animate-in fade-in duration-300">
      <div className={`bg-zinc-900 border ${style.border} rounded-2xl w-full max-w-md p-8 relative shadow-2xl animate-in zoom-in-95 duration-300`}>
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className={`flex items-center justify-center w-16 h-16 rounded-full ${style.icon} mb-6 mx-auto`}>
          <AlertTriangle size={32} />
        </div>

        <h3 className="text-2xl font-black text-white mb-3 text-center tracking-tight">{title}</h3>
        <p className="text-zinc-400 text-sm mb-8 text-center leading-relaxed">
          {message}
        </p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-xl transition-all border border-zinc-700/50"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 ${style.button} text-white font-bold py-4 rounded-xl transition-all shadow-lg`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

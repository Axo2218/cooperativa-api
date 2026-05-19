import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { ShieldCheck, User, Lock, ArrowRight } from 'lucide-react';
import topoBg from '../assets/topo-bg.png';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network request
    setTimeout(() => {
      if (username === 'SuperAdmin' && password === 'superadmin') {
        toast.success('Acceso autorizado. Bienvenido.');
        onLogin(true);
      } else {
        toast.error('Credenciales incorrectas. Acceso denegado.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center relative overflow-hidden">
      {/* Background Topo */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 z-0"
        style={{ 
          backgroundImage: `url(${topoBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
        }}
      />
      
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="w-full max-w-md relative z-10 px-6">
        <div className="bg-[#18181b]/80 backdrop-blur-xl rounded-2xl border border-zinc-800 p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center mb-4 shadow-inner">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">COOPESCA</h1>
            <p className="text-zinc-400 text-sm mt-1">Acceso Administrativo Seguro</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Usuario</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-zinc-800 rounded-xl leading-5 bg-zinc-900/50 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all sm:text-sm"
                  placeholder="Ingrese su usuario"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-zinc-800 rounded-xl leading-5 bg-zinc-900/50 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all sm:text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-zinc-900 transition-all shadow-lg shadow-emerald-900/20 mt-6 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verificando...</span>
                </div>
              ) : (
                <>
                  <span>Ingresar al Sistema</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-zinc-800/50 pt-6">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
              Módulo de Seguridad V1.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

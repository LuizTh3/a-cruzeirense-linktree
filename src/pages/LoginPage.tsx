import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Email ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="
      relative max-w-120 mx-auto min-h-screen
      bg-container-radial border-x border-white/5
      shadow-lateral flex flex-col items-center
      overflow-x-hidden pb-10 px-6
    ">
      <div className="w-full max-w-sm mt-20">
        <h1 className="text-[2rem] font-roboto font-bold text-white text-center mb-2">
          A Cruzeirense
        </h1>
        <p className="text-white/60 text-center mb-10 font-roboto">
          Área Administrativa
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label 
              htmlFor="email" 
              className="text-white font-roboto text-sm font-medium"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full py-3.5 px-4 
                bg-white/10 border border-white/20 
                rounded-xl text-white font-roboto
                placeholder:text-white/40
                focus:outline-none focus:border-[#1a5fa8] focus:bg-white/15
                transition-all duration-200
              "
              placeholder="seu@email.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label 
              htmlFor="password" 
              className="text-white font-roboto text-sm font-medium"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full py-3.5 px-4 
                bg-white/10 border border-white/20 
                rounded-xl text-white font-roboto
                placeholder:text-white/40
                focus:outline-none focus:border-[#1a5fa8] focus:bg-white/15
                transition-all duration-200
              "
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center font-roboto">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              flex items-center justify-center w-full py-4.5 mt-2
              bg-[linear-gradient(135deg,#082d5e,#1a5fa8)]
              text-white no-underline rounded-2xl
              font-roboto font-bold uppercase text-[0.85rem] tracking-[1px]
              border-none transition-all duration-300
              ease-[cubic-bezier(0.25,0.8,0.25,1)]
              hover:brightness-110 hover:-translate-y-0.75
              hover:shadow-[0_8px_25px_rgba(0,86,179,0.4)]
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
            "
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="text-white/60 hover:text-white font-roboto text-sm transition-colors"
          >
            ← Voltar ao site
          </a>
        </div>
      </div>
    </main>
  );
}

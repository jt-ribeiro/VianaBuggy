'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Search, AlertCircle } from 'lucide-react';
import { validateGroupCode } from '@/app/actions/groups';

export default function GrupoJoinPage() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const res = await validateGroupCode(code);
      if (res.error) {
        setError(res.error);
      } else {
        router.push(`/grupo/${code.toUpperCase()}`);
      }
    } catch (err) {
      setError('Erro ao verificar o grupo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-brand-black texture-overlay flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-brand-gray border border-brand-gray-light rounded-sm p-8 text-center animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-orange/10 rounded-full mb-6">
            <Users size={40} className="text-brand-orange" />
          </div>
          
          <h1 className="font-heading text-3xl font-black text-white mb-2">
            JUNTAR A UM GRUPO
          </h1>
          <p className="font-body text-white/70 mb-8">
            Insere o código de 6 letras que o teu amigo te enviou para te juntares à mesma saída.
          </p>

          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={6}
                placeholder="Ex: BUGGY7"
                className="w-full bg-brand-black border border-brand-gray-light rounded-sm px-4 py-4 text-center text-white font-body focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all uppercase tracking-widest font-black text-2xl"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-sm p-3 flex items-start gap-2 text-left">
                <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-200 text-sm font-body">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="w-full flex items-center justify-center gap-2 bg-brand-orange text-white font-heading font-bold tracking-wider px-8 py-4 rounded-sm transform -skew-x-3 hover:bg-brand-orange-light transition-all shadow-aggressive disabled:opacity-50 disabled:animate-none"
            >
              <span className="skew-x-3">{isLoading ? 'A VERIFICAR...' : 'VERIFICAR CÓDIGO'}</span>
              {!isLoading && <Search size={20} className="skew-x-3" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

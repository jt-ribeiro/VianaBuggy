'use client';

import { useState } from 'react';
import { Users, Copy, Check, ChevronRight } from 'lucide-react';
import { createGroup } from '@/app/actions/groups';

interface CreateGroupCardProps {
  reservationId: string;
}

export default function CreateGroupCard({ reservationId }: CreateGroupCardProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [group, setGroup] = useState<{ id: string; group_code: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateGroup = async () => {
    setIsCreating(true);
    setError(null);
    try {
      const res = await createGroup(reservationId, 'Novo Grupo');
      if (res.error) {
        setError(res.error);
      } else if (res.group) {
        setGroup(res.group);
      }
    } catch (err) {
      setError('Erro ao criar grupo.');
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = () => {
    if (!group) return;
    navigator.clipboard.writeText(group.group_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (group) {
    return (
      <div className="bg-brand-orange/10 border border-brand-orange/30 rounded-sm p-6 text-left mt-8">
        <div className="flex items-center gap-3 mb-4">
          <Users className="text-brand-orange" size={24} />
          <h3 className="font-heading text-2xl font-bold text-white">GRUPO CRIADO!</h3>
        </div>
        <p className="font-body text-white/80 text-sm mb-6">
          Partilha este código com os teus amigos para eles se juntarem à mesma saída que tu.
        </p>
        
        <div className="flex gap-2">
          <div className="bg-brand-black border border-brand-orange px-6 py-3 rounded-sm flex-1 flex items-center justify-center">
            <span className="font-heading text-3xl font-black text-white tracking-widest">{group.group_code}</span>
          </div>
          <button
            onClick={copyToClipboard}
            className="bg-brand-orange text-white px-6 rounded-sm transition-colors hover:bg-brand-orange-light flex flex-col items-center justify-center gap-1 min-w-[100px]"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
            <span className="text-xs font-bold font-heading">{copied ? 'COPIADO' : 'COPIAR'}</span>
          </button>
        </div>
        
        <p className="text-xs text-brand-orange mt-4 font-semibold text-center">
          Os teus amigos devem usar este código no passo 1 da reserva.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-brand-black border border-brand-gray-light rounded-sm p-6 text-left mt-8 flex flex-col sm:flex-row items-center gap-6">
      <div className="bg-brand-gray p-4 rounded-full shrink-0">
        <Users className="text-white" size={32} />
      </div>
      <div className="flex-1 text-center sm:text-left">
        <h3 className="font-heading text-xl font-bold text-white mb-1">VAIS TRAZER AMIGOS?</h3>
        <p className="font-body text-brand-gray-text text-sm">
          Cria um grupo para esta reserva e partilha o código com os teus amigos para garantir que vão todos na mesma saída.
        </p>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>
      <button
        onClick={handleCreateGroup}
        disabled={isCreating}
        className="flex items-center gap-2 bg-brand-orange text-white font-heading font-bold tracking-wider px-6 py-3 rounded-sm transform -skew-x-3 hover:bg-brand-orange-light transition-all shadow-aggressive shrink-0 whitespace-nowrap disabled:opacity-50"
      >
        <span className="skew-x-3">{isCreating ? 'A CRIAR...' : 'CRIAR GRUPO'}</span>
        {!isCreating && <ChevronRight size={16} className="skew-x-3" />}
      </button>
    </div>
  );
}

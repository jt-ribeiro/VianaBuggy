'use client';

import { useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import { addUser } from '@/app/actions/users';

export default function AddUserModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await addUser(formData);

    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setIsOpen(false);
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-light text-brand-white px-4 py-2 rounded transition-colors text-sm font-bold"
      >
        <UserPlus className="w-4 h-4" />
        Adicionar Utilizador
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-brand-gray border border-brand-gray-light rounded-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-brand-gray-text hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-2xl font-heading text-white uppercase mb-6">Novo Utilizador</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 text-red-500 border border-red-500/30 p-3 rounded text-sm">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm text-brand-gray-text mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  className="w-full bg-brand-black border border-brand-gray-light rounded px-3 py-2 text-white focus:border-brand-orange outline-none" 
                  placeholder="Nome do membro da equipa"
                />
              </div>

              <div>
                <label className="block text-sm text-brand-gray-text mb-1">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  className="w-full bg-brand-black border border-brand-gray-light rounded px-3 py-2 text-white focus:border-brand-orange outline-none" 
                  placeholder="email@vianabuggy.pt"
                />
              </div>

              <div>
                <label className="block text-sm text-brand-gray-text mb-1">Password</label>
                <input 
                  type="password" 
                  name="password" 
                  required 
                  minLength={6}
                  className="w-full bg-brand-black border border-brand-gray-light rounded px-3 py-2 text-white focus:border-brand-orange outline-none" 
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label className="block text-sm text-brand-gray-text mb-1">Nível de Acesso (Role)</label>
                <select 
                  name="role" 
                  required 
                  className="w-full bg-brand-black border border-brand-gray-light rounded px-3 py-2 text-white focus:border-brand-orange outline-none"
                >
                  <option value="staff">Staff / Guia (Apenas vista de Saídas e Check-ins)</option>
                  <option value="admin">Administrador (Acesso Total e Financeiro)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm text-brand-gray-text hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-brand-orange hover:bg-brand-orange-light text-white px-6 py-2 rounded font-bold disabled:opacity-50"
                >
                  {loading ? 'A Criar...' : 'Criar Utilizador'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

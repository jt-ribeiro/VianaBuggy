'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Erro ao enviar mensagem');
      
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-8 animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-4">
          <CheckCircle2 size={32} className="text-green-500" />
        </div>
        <h4 className="font-heading text-2xl font-bold text-white mb-2">Mensagem Enviada!</h4>
        <p className="text-brand-gray-text font-body mb-6">
          Obrigado pelo teu contacto. Vamos responder-te o mais breve possível.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-brand-orange hover:text-brand-orange-light font-heading font-bold tracking-widest transition-colors"
        >
          ENVIAR OUTRA MENSAGEM
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status === 'error' && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-sm p-4 flex items-start gap-3 animate-fade-in">
          <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-red-200 text-sm font-body">
            Ocorreu um erro ao enviar a tua mensagem. Por favor, tenta novamente ou contacta-nos por telefone.
          </p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-body text-white/80 mb-2">Nome</label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-brand-black border border-brand-gray-light rounded-sm px-4 py-3 text-white font-body focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all"
          placeholder="O teu nome"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-body text-white/80 mb-2">E-mail</label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full bg-brand-black border border-brand-gray-light rounded-sm px-4 py-3 text-white font-body focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all"
          placeholder="teu@email.com"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-body text-white/80 mb-2">Mensagem</label>
        <textarea
          id="message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-brand-black border border-brand-gray-light rounded-sm px-4 py-3 text-white font-body focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all resize-none"
          placeholder="Como podemos ajudar?"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full flex items-center justify-center gap-2 bg-brand-orange text-white font-heading font-bold tracking-wider px-8 py-4 rounded-sm transform -skew-x-3 hover:bg-brand-orange-light transition-all shadow-aggressive disabled:opacity-50 disabled:animate-none"
      >
        <span className="skew-x-3 flex items-center gap-2">
          {status === 'submitting' ? 'A ENVIAR...' : 'ENVIAR MENSAGEM'}
          <Send size={18} />
        </span>
      </button>
    </form>
  );
}

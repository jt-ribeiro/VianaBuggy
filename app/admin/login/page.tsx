"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const details = searchParams.get("details");
  
  const [error, setError] = useState<string | null>(
    urlError === 'unauthorized' ? `Sem permissão. Detalhes: ${details || 'N/A'}` : null
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded text-sm text-center">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-brand-gray-text mb-2">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-brand-gray-light border border-brand-gray-light rounded text-brand-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors outline-none"
          placeholder="admin@vianabuggy.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-brand-gray-text mb-2">
          Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-brand-gray-light border border-brand-gray-light rounded text-brand-white focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-colors outline-none"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-orange hover:bg-brand-orange-light text-brand-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "A entrar..." : "Entrar"}
      </button>
    </form>
  );
}

export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black p-4">
      <div className="w-full max-w-md bg-brand-gray p-8 rounded-lg shadow-aggressive">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading text-brand-white uppercase tracking-wider mb-2">
            Viana <span className="text-brand-orange">Buggy</span>
          </h1>
          <p className="text-brand-gray-text">Admin Panel Login</p>
        </div>
        <Suspense fallback={<div className="text-white text-center">Carregando...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

import { createServiceRoleClient } from "@/lib/supabase/service";
import { UserCog } from "lucide-react";
import AddUserModal from "./AddUserModal";

export const revalidate = 0;

export default async function AdminUsers() {
  const supabase = createServiceRoleClient();

  const { data: users, error } = await supabase
    .from("admin_users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-heading text-brand-white uppercase mb-4">Equipa</h1>
        <div className="bg-red-500/10 text-red-500 border border-red-500 p-4 rounded">
          Erro ao carregar utilizadores: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading text-brand-white uppercase mb-2">Equipa</h1>
          <p className="text-brand-gray-text">Gestão de acessos ao painel de administração e staff.</p>
        </div>
        <AddUserModal />
      </div>

      <div className="bg-brand-gray rounded-lg border border-brand-gray-light overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-gray-light border-b border-brand-gray-light">
              <th className="p-4 text-sm font-medium text-brand-gray-text">ID / Utilizador</th>
              <th className="p-4 text-sm font-medium text-brand-gray-text">Role</th>
              <th className="p-4 text-sm font-medium text-brand-gray-text">Estado</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id} className="border-b border-brand-gray-light last:border-0 hover:bg-brand-gray-light/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-brand-gray-light p-2 rounded-full">
                      <UserCog className="w-4 h-4 text-brand-white" />
                    </div>
                    <div>
                      <div className="font-medium text-brand-white">{user.email || 'Sem email'}</div>
                      <div className="text-xs text-brand-gray-text font-mono">{user.id}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium uppercase tracking-wider ${
                    user.role === 'admin' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  {user.is_active ? (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-500">
                      Ativo
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-500/10 text-red-500">
                      Inativo
                    </span>
                  )}
                </td>
              </tr>
            ))}
            
            {(!users || users.length === 0) && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-brand-gray-text">
                  Nenhum utilizador encontrado na base de dados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

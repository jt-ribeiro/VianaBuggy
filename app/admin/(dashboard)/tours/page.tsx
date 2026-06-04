import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Edit, Eye } from "lucide-react";

export const revalidate = 0;

export default async function AdminTours() {
  const supabase = await createClient();
  
  const { data: tours, error } = await supabase
    .from('tours_config')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-heading text-brand-white uppercase mb-4">Tours</h1>
        <div className="bg-red-500/10 text-red-500 border border-red-500 p-4 rounded">
          Erro ao carregar tours: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading text-brand-white uppercase mb-2">Tours Configuração</h1>
        <p className="text-brand-gray-text">Gere as configurações, preços e informações dos tours.</p>
      </div>

      <div className="bg-brand-gray rounded-lg border border-brand-gray-light overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-gray-light border-b border-brand-gray-light">
              <th className="p-4 text-sm font-medium text-brand-gray-text">Nome do Tour</th>
              <th className="p-4 text-sm font-medium text-brand-gray-text">Duração</th>
              <th className="p-4 text-sm font-medium text-brand-gray-text">Preço 2 Lug.</th>
              <th className="p-4 text-sm font-medium text-brand-gray-text">Preço 4 Lug.</th>
              <th className="p-4 text-sm font-medium text-brand-gray-text">Estado</th>
              <th className="p-4 text-sm font-medium text-brand-gray-text text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {tours?.map((tour) => (
              <tr key={tour.id} className="border-b border-brand-gray-light last:border-0 hover:bg-brand-gray-light/50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-brand-white">{tour.name}</div>
                  <div className="text-xs text-brand-gray-text">{tour.slug}</div>
                </td>
                <td className="p-4 text-brand-white">{tour.duration}</td>
                <td className="p-4 text-brand-white">€{tour.price_2_seater}</td>
                <td className="p-4 text-brand-white">€{tour.price_4_seater}</td>
                <td className="p-4">
                  {tour.is_active ? (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-500">
                      Ativo
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-500/10 text-red-500">
                      Inativo
                    </span>
                  )}
                </td>
                <td className="p-4 flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/tours/${tour.id}`}
                    className="p-2 text-brand-gray-text hover:text-brand-orange hover:bg-brand-orange/10 rounded transition-colors"
                    title="Editar Tour"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
            
            {(!tours || tours.length === 0) && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-brand-gray-text">
                  Nenhum tour encontrado na base de dados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

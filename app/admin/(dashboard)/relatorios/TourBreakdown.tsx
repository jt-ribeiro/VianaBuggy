'use client';

import { formatPrice } from '@/lib/utils';

export default function TourBreakdown({ data, totalRevenue }: { data: any[], totalRevenue: number }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-brand-gray-text text-center py-6">
        Sem dados de tours para o período selecionado.
      </div>
    );
  }

  // Ordena por receita descrescente
  const sortedData = [...data].sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-brand-gray-light">
            <th className="py-3 px-4 text-xs font-bold text-brand-gray-text uppercase tracking-wider">Tour</th>
            <th className="py-3 px-4 text-xs font-bold text-brand-gray-text uppercase tracking-wider text-right">Reservas</th>
            <th className="py-3 px-4 text-xs font-bold text-brand-gray-text uppercase tracking-wider text-right">Buggies</th>
            <th className="py-3 px-4 text-xs font-bold text-brand-gray-text uppercase tracking-wider text-right">Receita</th>
            <th className="py-3 px-4 text-xs font-bold text-brand-gray-text uppercase tracking-wider text-right">% do Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-gray-light/50">
          {sortedData.map((item, idx) => {
            const percentage = totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0;
            return (
              <tr key={idx} className="hover:bg-brand-gray-light/10 transition-colors">
                <td className="py-3 px-4 font-bold text-white">{item.name}</td>
                <td className="py-3 px-4 text-right text-brand-gray-text">{item.reservationsCount}</td>
                <td className="py-3 px-4 text-right text-brand-gray-text">{item.buggiesCount}</td>
                <td className="py-3 px-4 text-right font-mono font-bold text-brand-orange">
                  {formatPrice(item.revenue)}
                </td>
                <td className="py-3 px-4 text-right text-brand-gray-text">
                  <div className="flex items-center justify-end gap-2">
                    <span className="w-12">{percentage.toFixed(1)}%</span>
                    <div className="w-16 h-1.5 bg-brand-gray-light rounded-full overflow-hidden">
                      <div className="bg-brand-orange h-full" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-brand-gray-light font-bold text-white bg-brand-gray-light/20">
            <td className="py-4 px-4 uppercase tracking-wider text-sm">Total</td>
            <td className="py-4 px-4 text-right">{data.reduce((acc, curr) => acc + curr.reservationsCount, 0)}</td>
            <td className="py-4 px-4 text-right">{data.reduce((acc, curr) => acc + curr.buggiesCount, 0)}</td>
            <td className="py-4 px-4 text-right font-mono text-brand-orange">{formatPrice(totalRevenue)}</td>
            <td className="py-4 px-4 text-right">100%</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

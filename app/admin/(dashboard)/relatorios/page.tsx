import { createClient } from '@/lib/supabase/server';
import { format, subDays, startOfWeek, startOfMonth, startOfYear, endOfDay, isAfter, isBefore } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CreditCard, Smartphone, Calendar as CalendarIcon, Download, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import RevenueChart from './RevenueChart';
import TourBreakdown from './TourBreakdown';

export const revalidate = 0;

export default async function AdminRelatorios(props: { searchParams: Promise<{ period?: string, from?: string, to?: string }> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  // Determine date range based on filters
  const today = new Date();
  let fromDate = startOfMonth(today); // default
  let toDate = endOfDay(today);
  
  const period = searchParams.period || 'month';

  if (period === 'week') {
    fromDate = startOfWeek(today, { weekStartsOn: 1 });
  } else if (period === 'year') {
    fromDate = startOfYear(today);
  } else if (period === 'custom' && searchParams.from && searchParams.to) {
    fromDate = new Date(searchParams.from);
    toDate = endOfDay(new Date(searchParams.to));
  }

  const fromStr = format(fromDate, 'yyyy-MM-dd');
  const toStr = format(toDate, 'yyyy-MM-dd');

  // Fetch reservations
  const { data: reservations, error } = await supabase
    .from('reservations')
    .select(`
      *,
      tours_config:tour_id (name)
    `)
    .in('status', ['confirmado', 'concluido'])
    .gte('created_at', fromDate.toISOString())
    .lte('created_at', toDate.toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-8 text-red-500">Erro ao carregar relatórios: {error.message}</div>;
  }

  // Calculate Metrics
  const totalRevenue = reservations.reduce((acc, curr) => acc + curr.total_price, 0);
  const totalBookings = reservations.length;
  const avgTicket = totalBookings > 0 ? totalRevenue / totalBookings : 0;

  // Group by Tour for Breakdown
  const tourStats: Record<string, any> = {};
  reservations.forEach(r => {
    const tourName = r.tours_config?.name || 'Tour Desconhecido';
    if (!tourStats[tourName]) {
      tourStats[tourName] = { name: tourName, revenue: 0, reservationsCount: 0, buggiesCount: 0 };
    }
    tourStats[tourName].revenue += r.total_price;
    tourStats[tourName].reservationsCount += 1;
    tourStats[tourName].buggiesCount += r.buggy_quantity;
  });
  const tourBreakdownData = Object.values(tourStats);
  
  // Find top tour
  let topTourName = '-';
  let maxRev = -1;
  tourBreakdownData.forEach(t => {
    if (t.revenue > maxRev) {
      maxRev = t.revenue;
      topTourName = t.name;
    }
  });

  // Group by Payment Method
  const stripeBookings = reservations.filter(r => r.payment_method === 'stripe');
  const mbwayBookings = reservations.filter(r => r.payment_method === 'mbway');
  
  const stripeRev = stripeBookings.reduce((acc, curr) => acc + curr.total_price, 0);
  const mbwayRev = mbwayBookings.reduce((acc, curr) => acc + curr.total_price, 0);

  // Data for Chart (group by date)
  const chartDataObj: Record<string, number> = {};
  reservations.forEach(r => {
    const date = r.created_at.split('T')[0]; // Format YYYY-MM-DD
    if (!chartDataObj[date]) chartDataObj[date] = 0;
    chartDataObj[date] += (r.total_price / 100); // Recharts uses numbers
  });
  const chartData = Object.entries(chartDataObj)
    .map(([date, revenue]) => ({ date: format(new Date(date), 'dd/MM'), revenue, originalDate: date }))
    .sort((a, b) => a.originalDate.localeCompare(b.originalDate));

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading text-brand-white uppercase mb-2">Relatórios Financeiros</h1>
          <p className="text-brand-gray-text">Análise de vendas, receitas e performance de tours.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 bg-brand-black p-1 border border-brand-gray-light rounded-lg">
          <Link href="/admin/relatorios?period=week" className={`px-4 py-2 text-sm font-semibold rounded ${period === 'week' ? 'bg-brand-gray text-brand-white shadow' : 'text-brand-gray-text hover:text-white'}`}>Esta Semana</Link>
          <Link href="/admin/relatorios?period=month" className={`px-4 py-2 text-sm font-semibold rounded ${period === 'month' ? 'bg-brand-gray text-brand-white shadow' : 'text-brand-gray-text hover:text-white'}`}>Este Mês</Link>
          <Link href="/admin/relatorios?period=year" className={`px-4 py-2 text-sm font-semibold rounded ${period === 'year' ? 'bg-brand-gray text-brand-white shadow' : 'text-brand-gray-text hover:text-white'}`}>Este Ano</Link>
        </div>
      </div>

      {/* Resumo Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-brand-gray border border-brand-gray-light p-6 rounded-lg">
          <div className="flex items-center gap-3 text-brand-gray-text mb-2">
            <BarChart2 size={18} />
            <h3 className="font-semibold">Receita Total</h3>
          </div>
          <p className="text-3xl font-heading font-bold text-brand-white">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="bg-brand-gray border border-brand-gray-light p-6 rounded-lg">
          <div className="flex items-center gap-3 text-brand-gray-text mb-2">
            <CalendarIcon size={18} />
            <h3 className="font-semibold">Reservas Confirmadas</h3>
          </div>
          <p className="text-3xl font-heading font-bold text-brand-white">{totalBookings}</p>
        </div>
        <div className="bg-brand-gray border border-brand-gray-light p-6 rounded-lg">
          <div className="flex items-center gap-3 text-brand-gray-text mb-2">
            <CreditCard size={18} />
            <h3 className="font-semibold">Ticket Médio</h3>
          </div>
          <p className="text-3xl font-heading font-bold text-brand-white">{formatPrice(avgTicket)}</p>
        </div>
        <div className="bg-brand-gray border border-brand-gray-light p-6 rounded-lg">
          <div className="flex items-center gap-3 text-brand-gray-text mb-2">
            <CarFront size={18} />
            <h3 className="font-semibold">Tour Mais Vendido</h3>
          </div>
          <p className="text-xl font-heading font-bold text-brand-orange truncate mt-1">{topTourName}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Chart */}
          <div className="bg-brand-gray border border-brand-gray-light rounded-lg p-6">
            <h3 className="text-xl font-heading font-bold text-brand-white uppercase mb-4">Evolução da Receita</h3>
            <RevenueChart data={chartData} />
          </div>

          {/* Breakdown por Tour */}
          <div className="bg-brand-gray border border-brand-gray-light rounded-lg p-6">
            <h3 className="text-xl font-heading font-bold text-brand-white uppercase mb-4">Performance por Tour</h3>
            <TourBreakdown data={tourBreakdownData} totalRevenue={totalRevenue} />
          </div>
        </div>

        <div className="space-y-8">
          {/* Payment Methods */}
          <div className="bg-brand-gray border border-brand-gray-light rounded-lg p-6">
            <h3 className="text-xl font-heading font-bold text-brand-white uppercase mb-6">Métodos de Pagamento</h3>
            
            <div className="space-y-4">
              <div className="bg-brand-black border border-brand-gray-light p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#635BFF]/10 flex items-center justify-center">
                    <CreditCard size={20} className="text-[#635BFF]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white leading-none">Stripe</h4>
                    <span className="text-sm text-brand-gray-text">{stripeBookings.length} reservas</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold font-mono text-white">{formatPrice(stripeRev)}</div>
                  <div className="text-xs text-brand-gray-text">{totalRevenue > 0 ? ((stripeRev/totalRevenue)*100).toFixed(0) : 0}% do total</div>
                </div>
              </div>

              <div className="bg-brand-black border border-brand-gray-light p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#00A2D9]/10 flex items-center justify-center">
                    <Smartphone size={20} className="text-[#00A2D9]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white leading-none">MBWay</h4>
                    <span className="text-sm text-brand-gray-text">{mbwayBookings.length} reservas</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold font-mono text-white">{formatPrice(mbwayRev)}</div>
                  <div className="text-xs text-brand-gray-text">{totalRevenue > 0 ? ((mbwayRev/totalRevenue)*100).toFixed(0) : 0}% do total</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Reservas Recentes */}
      <div className="bg-brand-gray border border-brand-gray-light rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-heading font-bold text-brand-white uppercase">Reservas no Período</h3>
          <a 
            href={`/api/admin/relatorios/export?from=${fromStr}&to=${toStr}`}
            className="flex items-center gap-2 bg-brand-gray-light hover:bg-brand-gray-light/80 text-white px-4 py-2 rounded transition-colors text-sm font-semibold"
          >
            <Download size={16} />
            Exportar CSV
          </a>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-gray-light">
                <th className="py-3 px-4 text-xs font-bold text-brand-gray-text uppercase tracking-wider">Data Compra</th>
                <th className="py-3 px-4 text-xs font-bold text-brand-gray-text uppercase tracking-wider">Ref / Cliente</th>
                <th className="py-3 px-4 text-xs font-bold text-brand-gray-text uppercase tracking-wider">Tour</th>
                <th className="py-3 px-4 text-xs font-bold text-brand-gray-text uppercase tracking-wider">Data Tour</th>
                <th className="py-3 px-4 text-xs font-bold text-brand-gray-text uppercase tracking-wider text-right">Pagamento</th>
                <th className="py-3 px-4 text-xs font-bold text-brand-gray-text uppercase tracking-wider text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-gray-light/50">
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-brand-gray-text">Nenhuma reserva confirmada neste período.</td>
                </tr>
              ) : (
                reservations.map((r) => (
                  <tr key={r.id} className="hover:bg-brand-gray-light/10 transition-colors">
                    <td className="py-3 px-4 text-sm text-brand-gray-text">
                      {format(new Date(r.created_at), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{r.customer_name}</div>
                      <div className="text-xs font-mono text-brand-gray-text">{r.booking_ref}</div>
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-brand-gray-text">
                      {r.tours_config?.name}
                      <div className="text-xs mt-0.5">{r.buggy_quantity}x {r.buggy_type}</div>
                    </td>
                    <td className="py-3 px-4 text-sm text-brand-gray-text">
                      {format(new Date(r.slot_date), 'dd/MM/yyyy')} às {r.slot_time}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`text-xs px-2 py-1 rounded font-bold uppercase tracking-wider ${
                        r.payment_method === 'stripe' ? 'bg-[#635BFF]/10 text-[#635BFF]' : 'bg-[#00A2D9]/10 text-[#00A2D9]'
                      }`}>
                        {r.payment_method}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-brand-orange">
                      {formatPrice(r.total_price)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Helper icon
function CarFront(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.64 5H8.4a2 2 0 0 0-1.9 1.3L5 10 3 8" />
      <path d="M7 14h.01" />
      <path d="M17 14h.01" />
      <rect width="18" height="8" x="3" y="10" rx="2" />
      <path d="M5 18v2" />
      <path d="M19 18v2" />
    </svg>
  );
}

import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { 
  Calendar, 
  CarFront, 
  TrendingUp, 
  Clock,
  AlertTriangle,
  ArrowRight,
  Eye
} from "lucide-react";
import Link from "next/link";
import { format, subDays, isBefore } from "date-fns";
import { pt } from "date-fns/locale";

export const revalidate = 0;

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  // Today's date as string YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  // 1. Reservas Hoje
  const { count: reservasHoje } = await supabase
    .from('reservations')
    .select('*', { count: 'exact', head: true })
    .eq('slot_date', today);

  // 2. Buggies a sair hoje
  const { data: buggiesData } = await supabase
    .from('reservations')
    .select('buggy_quantity')
    .eq('slot_date', today)
    .in('status', ['confirmado', 'concluido']);
    
  const buggiesSair = buggiesData?.reduce((acc, curr) => acc + (curr.buggy_quantity || 0), 0) || 0;

  // 3. Receita Semanal (Reservations created in the last 7 days, confirmed/completed)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const { data: receitaData } = await supabase
    .from('reservations')
    .select('total_price')
    .gte('created_at', sevenDaysAgo.toISOString())
    .in('status', ['confirmado', 'concluido']);

  const receitaSemanal = receitaData?.reduce((acc, curr) => acc + (curr.total_price || 0), 0) || 0;

  // 4. Pendentes MBWay
  const { count: pendentesMBWay } = await supabase
    .from('reservations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pendente_mbway');

  const stats = [
    {
      name: "Reservas Hoje",
      value: reservasHoje || 0,
      icon: Calendar,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      name: "Buggies a Sair (Hoje)",
      value: buggiesSair,
      icon: CarFront,
      color: "text-brand-orange",
      bg: "bg-brand-orange/10"
    },
    {
      name: "Receita (7 dias)",
      value: formatPrice(receitaSemanal),
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-500/10"
    },
    {
      name: "Pendentes MBWay",
      value: pendentesMBWay || 0,
      icon: Clock,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10"
    }
  ];

  // Fetch Saídas de Hoje
  const { data: saidasHojeData } = await supabase
    .from('reservations')
    .select('slot_time, tour_id, buggy_quantity, tours_config(name)')
    .eq('slot_date', today)
    .in('status', ['confirmado', 'concluido']);

  const saidasHoje = Object.values((saidasHojeData || []).reduce((acc: any, curr: any) => {
    const key = `${curr.slot_time}_${curr.tour_id}`;
    if (!acc[key]) {
      acc[key] = { time: curr.slot_time, tourName: curr.tours_config?.name, buggies: 0 };
    }
    acc[key].buggies += curr.buggy_quantity;
    return acc;
  }, {})).sort((a: any, b: any) => a.time.localeCompare(b.time));

  // Fetch Reservas Recentes (últimas 5)
  const { data: reservasRecentes } = await supabase
    .from('reservations')
    .select('id, booking_ref, customer_name, status, total_price, created_at, tours_config(name)')
    .order('created_at', { ascending: false })
    .limit(5);

  // Alertas
  const twentyFourHoursAgo = subDays(new Date(), 1);
  const { data: mbwayAtrasados } = await supabase
    .from('reservations')
    .select('id, customer_name, booking_ref')
    .eq('status', 'pendente_mbway')
    .lt('created_at', twentyFourHoursAgo.toISOString());

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  const { data: saidasAmanhaData } = await supabase
    .from('reservations')
    .select('slot_time, tour_id, buggy_quantity, tours_config(name)')
    .eq('slot_date', tomorrowStr)
    .in('status', ['confirmado', 'concluido']);

  const saidasAmanha = Object.values((saidasAmanhaData || []).reduce((acc: any, curr: any) => {
    const key = `${curr.slot_time}_${curr.tour_id}`;
    if (!acc[key]) {
      acc[key] = { time: curr.slot_time, tourName: curr.tours_config?.name, buggies: 0 };
    }
    acc[key].buggies += curr.buggy_quantity;
    return acc;
  }, {})).filter((s: any) => s.buggies < 2);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading text-brand-white uppercase mb-2">Dashboard</h1>
        <p className="text-brand-gray-text">Bem-vindo ao painel de controlo Viana Buggy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-brand-gray p-6 rounded-lg border border-brand-gray-light">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-md ${stat.bg} ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-brand-gray-text text-sm font-medium">{stat.name}</h3>
              <p className="text-3xl font-bold text-brand-white mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {((mbwayAtrasados && mbwayAtrasados.length > 0) || (saidasAmanha && saidasAmanha.length > 0)) && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
          <h2 className="text-lg font-heading font-bold text-red-500 uppercase flex items-center gap-2 mb-4">
            <AlertTriangle size={20} />
            Alertas que requerem atenção
          </h2>
          <div className="space-y-3">
            {mbwayAtrasados?.map(res => (
              <div key={res.id} className="flex items-center justify-between bg-brand-black/50 p-3 rounded border border-red-500/20">
                <div>
                  <span className="font-bold text-white">{res.customer_name}</span> tem um pagamento MBWay pendente há mais de 24h.
                  <span className="text-xs text-brand-gray-text ml-2 font-mono">Ref: {res.booking_ref}</span>
                </div>
                <Link href="/admin/reservas" className="text-sm font-semibold text-red-500 hover:text-red-400">Ver Reserva</Link>
              </div>
            ))}
            {saidasAmanha?.map((saida: any, idx) => (
              <div key={idx} className="flex items-center justify-between bg-brand-black/50 p-3 rounded border border-yellow-500/20">
                <div>
                  <span className="text-yellow-500"><AlertTriangle size={14} className="inline mr-2"/>Baixa Ocupação Amanhã:</span>
                  <span className="font-bold text-white ml-1">{saida.tourName} às {saida.time}</span> tem apenas {saida.buggies} buggy confirmado.
                </div>
                <Link href="/admin/saidas" className="text-sm font-semibold text-yellow-500 hover:text-yellow-400">Ver Calendário</Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Saídas de Hoje */}
        <div className="bg-brand-gray border border-brand-gray-light rounded-lg p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-bold text-brand-white uppercase">Saídas de Hoje</h2>
            <Link href="/admin/saidas" className="text-sm text-brand-orange hover:text-brand-orange/80 flex items-center gap-1 font-semibold">
              Calendário <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="flex-1 space-y-3">
            {!saidasHoje || saidasHoje.length === 0 ? (
              <div className="h-full flex items-center justify-center text-brand-gray-text bg-brand-black/50 rounded border border-brand-gray-light/50 p-8 text-center">
                Nenhuma saída agendada para hoje.
              </div>
            ) : (
              (saidasHoje as any[]).map((saida, idx) => (
                <div key={idx} className="flex items-center justify-between bg-brand-black p-4 rounded-lg border border-brand-gray-light">
                  <div className="flex items-center gap-4">
                    <div className="bg-brand-orange/20 text-brand-orange font-bold font-heading px-3 py-1 rounded">
                      {saida.time}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{saida.tourName}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white flex items-center gap-1">
                      {saida.buggies} <CarFront size={16} className="text-brand-gray-text" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reservas Recentes */}
        <div className="bg-brand-gray border border-brand-gray-light rounded-lg p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-bold text-brand-white uppercase">Reservas Recentes</h2>
            <Link href="/admin/reservas" className="text-sm text-brand-orange hover:text-brand-orange/80 flex items-center gap-1 font-semibold">
              Ver Todas <ArrowRight size={16} />
            </Link>
          </div>

          <div className="flex-1">
            {!reservasRecentes || reservasRecentes.length === 0 ? (
              <div className="h-full flex items-center justify-center text-brand-gray-text bg-brand-black/50 rounded border border-brand-gray-light/50 p-8 text-center">
                Sem reservas recentes.
              </div>
            ) : (
              <div className="divide-y divide-brand-gray-light/50">
                {reservasRecentes.map((res: any) => (
                  <div key={res.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-sm">{res.customer_name}</div>
                      <div className="text-xs text-brand-gray-text mt-0.5">{res.tours_config?.name} • <span className="font-mono">{res.booking_ref}</span></div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-brand-orange text-sm">{formatPrice(res.total_price)}</div>
                      <div className="mt-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                          res.status === 'confirmado' || res.status === 'concluido' ? 'bg-green-500/10 text-green-500' :
                          res.status === 'pendente' || res.status === 'pendente_mbway' ? 'bg-yellow-500/10 text-yellow-500' : 
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {res.status.replace('_mbway', '')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

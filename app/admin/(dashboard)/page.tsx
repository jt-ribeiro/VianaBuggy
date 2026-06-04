import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { 
  Calendar, 
  CarFront, 
  TrendingUp, 
  Clock 
} from "lucide-react";

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

  // 2. Buggies a sair hoje (sum of number_of_buggies)
  const { data: buggiesData } = await supabase
    .from('reservations')
    .select('number_of_buggies')
    .eq('slot_date', today)
    .in('status', ['confirmed', 'completed']);
    
  const buggiesSair = buggiesData?.reduce((acc, curr) => acc + (curr.number_of_buggies || 0), 0) || 0;

  // 3. Receita Semanal (Reservations created in the last 7 days, confirmed/completed)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const { data: receitaData } = await supabase
    .from('reservations')
    .select('total_price')
    .gte('created_at', sevenDaysAgo.toISOString())
    .in('status', ['confirmed', 'completed']);

  const receitaSemanal = receitaData?.reduce((acc, curr) => acc + (curr.total_price || 0), 0) || 0;

  // 4. Pendentes MBWay
  const { count: pendentesMBWay } = await supabase
    .from('reservations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')
    .eq('payment_method', 'mbway');

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
    </div>
  );
}

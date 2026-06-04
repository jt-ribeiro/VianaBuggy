import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Users, Car, Calendar, MapPin, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export const revalidate = 0; // Don't cache this page so reservations are up to date

export default async function GroupDetailsPage({ params }: { params: { code: string } }) {
  const code = params.code.toUpperCase();
  const supabase = await createClient();

  // 1. Fetch group
  const { data: group, error: groupError } = await supabase
    .from('groups')
    .select(`
      *,
      tours_config (name, destination, icon, duration)
    `)
    .eq('group_code', code)
    .single();

  if (groupError || !group) {
    notFound();
  }

  // 2. Fetch reservations
  const { data: reservations } = await supabase
    .from('reservations')
    .select('customer_name, buggy_quantity, buggy_type, people_count, status')
    .eq('group_id', group.id)
    .neq('status', 'cancelado')
    .order('created_at', { ascending: true });

  const currentBuggies = reservations?.reduce((acc, curr) => acc + curr.buggy_quantity, 0) || 0;
  const currentPeople = reservations?.reduce((acc, curr) => acc + curr.people_count, 0) || 0;
  const availableBuggies = group.max_buggies - currentBuggies;
  const isFull = availableBuggies <= 0;

  return (
    <div className="min-h-screen pt-32 pb-24 bg-brand-black texture-overlay">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <span className="text-brand-orange text-sm font-body font-semibold tracking-widest uppercase">
              Página do Grupo
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-black text-white mt-2">
              {group.name}
            </h1>
          </div>
          <div className="bg-brand-gray border border-brand-orange px-6 py-3 rounded-sm flex items-center gap-4">
            <span className="text-brand-gray-text text-sm font-body uppercase tracking-wider">CÓDIGO</span>
            <span className="font-heading text-3xl font-black text-white tracking-widest">{group.group_code}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Info - 2 cols */}
          <div className="md:col-span-2 space-y-8">
            
            <div className="bg-brand-gray border border-brand-gray-light rounded-sm p-6 sm:p-8">
              <h2 className="font-heading text-2xl font-bold text-white mb-6">DETALHES DA SAÍDA</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <MapPin className="text-brand-orange shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-brand-gray-text text-sm font-body mb-1">Tour</p>
                    <p className="text-white font-bold font-heading text-lg">{group.tours_config.name}</p>
                    <p className="text-white/60 text-xs font-body">{group.tours_config.destination}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="text-brand-orange shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-brand-gray-text text-sm font-body mb-1">Data e Hora</p>
                    <p className="text-white font-bold font-heading text-lg">{group.slot_date}</p>
                    <p className="text-white/60 text-xs font-body">{group.slot_time} • {group.tours_config.duration}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-brand-gray border border-brand-gray-light rounded-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl font-bold text-white">MEMBROS DO GRUPO</h2>
                <div className="flex items-center gap-2 bg-brand-black px-3 py-1 rounded-full border border-brand-gray-light">
                  <Users size={14} className="text-brand-orange" />
                  <span className="text-xs font-bold text-white">{currentPeople} Pessoas</span>
                </div>
              </div>

              {reservations && reservations.length > 0 ? (
                <div className="space-y-4">
                  {reservations.map((res, i) => (
                    <div key={i} className="flex items-center justify-between bg-brand-black border border-brand-gray-light rounded-sm p-4">
                      <div>
                        <p className="text-white font-bold font-heading text-lg flex items-center gap-2">
                          {res.customer_name}
                          {res.status === 'pendente_mbway' && (
                            <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded uppercase tracking-wider">Aguardando Pagamento</span>
                          )}
                        </p>
                        <p className="text-brand-gray-text text-sm font-body mt-1">
                          {res.buggy_quantity}x Buggy {res.buggy_type === '2-seater' ? '2 Lugares' : '4 Lugares'}
                        </p>
                      </div>
                      <div className="text-brand-orange font-bold font-heading">
                        {res.people_count} Pax
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/60 font-body text-center py-8">Nenhum membro encontrado.</p>
              )}
            </div>
            
          </div>

          {/* Sidebar - 1 col */}
          <div className="space-y-8">
            <div className="bg-brand-gray border border-brand-gray-light rounded-sm p-6">
              <h2 className="font-heading text-xl font-bold text-white mb-6">ESTADO DO GRUPO</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-body mb-2">
                    <span className="text-brand-gray-text">Buggies Reservados</span>
                    <span className="text-white font-bold">{currentBuggies} de {group.max_buggies}</span>
                  </div>
                  <div className="h-2 w-full bg-brand-black rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${isFull ? 'bg-red-500' : 'bg-brand-orange'}`} 
                      style={{ width: `${Math.min(100, (currentBuggies / group.max_buggies) * 100)}%` }}
                    />
                  </div>
                </div>
                
                {isFull ? (
                  <div className="flex items-start gap-2 bg-red-500/10 p-3 rounded-sm border border-red-500/30">
                    <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-red-200 text-xs font-body">Este grupo já atingiu o limite máximo de buggies e não aceita mais membros.</p>
                  </div>
                ) : !group.is_open ? (
                  <div className="flex items-start gap-2 bg-yellow-500/10 p-3 rounded-sm border border-yellow-500/30">
                    <AlertCircle size={18} className="text-yellow-500 shrink-0 mt-0.5" />
                    <p className="text-yellow-200 text-xs font-body">As inscrições para este grupo foram fechadas pelo administrador.</p>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 bg-green-500/10 p-3 rounded-sm border border-green-500/30">
                    <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                    <p className="text-green-200 text-xs font-body">Grupo aberto! Faltam reservar {availableBuggies} buggy(s).</p>
                  </div>
                )}
              </div>

              {!isFull && group.is_open && (
                <div className="mt-8 pt-6 border-t border-brand-gray-light">
                  <Link 
                    href={`/reservas?grupo=${group.group_code}`}
                    className="flex items-center justify-center gap-2 w-full bg-brand-orange text-white font-heading font-bold tracking-wider px-6 py-4 rounded-sm transform -skew-x-3 hover:bg-brand-orange-light transition-all shadow-aggressive"
                  >
                    <span className="skew-x-3">JUNTAR-ME AGORA</span>
                    <ArrowRight size={18} className="skew-x-3" />
                  </Link>
                </div>
              )}
            </div>
            
            <div className="bg-brand-gray border border-brand-gray-light rounded-sm p-6 text-center">
              <Car className="text-brand-gray-text mx-auto mb-3" size={32} />
              <h3 className="font-heading text-lg font-bold text-white mb-2">PARTILHAR CÓDIGO</h3>
              <p className="text-sm font-body text-white/60 mb-4">
                Envia este link ou código aos teus amigos para eles se inscreverem.
              </p>
              <a 
                href={`whatsapp://send?text=Junta-te ao meu passeio de buggy na Viana Buggy! Usa o código de grupo ${group.group_code} em https://www.vianabuggy.pt/grupo`}
                className="inline-block w-full border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-heading font-bold px-4 py-2 rounded-sm transition-colors text-sm"
              >
                PARTILHAR NO WHATSAPP
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { X, Lock, Unlock, Plus, Trash2, Calendar, Car, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DayModal({ date, data, onClose }: { date: Date, data: any, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'saidas' | 'gestao'>('saidas');
  const dateStr = format(date, 'yyyy-MM-dd');
  
  // Tab 1 Data
  const dayReservations = data.reservations.filter((r: any) => r.slot_date === dateStr);
  const groupedReservations = dayReservations.reduce((acc: any, curr: any) => {
    const key = `${curr.slot_time}_${curr.tour_id}`;
    if (!acc[key]) {
      acc[key] = {
        time: curr.slot_time,
        tourId: curr.tour_id,
        tourName: curr.tours_config?.name,
        maxBuggies: curr.tours_config?.max_buggies_per_slot || 6,
        reservations: [],
        totalBuggies: 0
      };
    }
    acc[key].reservations.push(curr);
    acc[key].totalBuggies += curr.buggy_quantity;
    return acc;
  }, {});

  const sortedGroups = Object.values(groupedReservations).sort((a: any, b: any) => a.time.localeCompare(b.time));

  // Tab 2 Data
  const dayBlocked = data.blockedDates.find((b: any) => b.date === dateStr && !b.time_slot && !b.tour_id);
  const partialBlocks = data.blockedDates.filter((b: any) => b.date === dateStr && (b.time_slot || b.tour_id));
  const extraSlots = data.extraSlots.filter((e: any) => e.date === dateStr);

  // States for forms
  const [extraSlotTime, setExtraSlotTime] = useState('');
  const [extraSlotTour, setExtraSlotTour] = useState('');
  const [isBlockingDay, setIsBlockingDay] = useState(false);
  const [blockReason, setBlockReason] = useState(dayBlocked?.reason || '');

  const handleAddExtraSlot = async () => {
    if (!extraSlotTime || !extraSlotTour) return toast.error('Preenche todos os campos');
    
    try {
      const res = await fetch('/api/admin/extra-slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateStr, time: extraSlotTime, tour_id: extraSlotTour })
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success('Horário extra adicionado!');
      setExtraSlotTime('');
      setExtraSlotTour('');
      onClose(); // Will trigger refresh
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleRemoveExtraSlot = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/extra-slots?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Horário removido!');
      onClose();
    } catch {
      toast.error('Erro ao remover horário');
    }
  };

  const handleToggleDayBlock = async () => {
    try {
      setIsBlockingDay(true);
      if (dayBlocked) {
        // Unblock
        const res = await fetch(`/api/admin/blocked-dates/${dayBlocked.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error();
        toast.success('Dia desbloqueado!');
      } else {
        // Block
        const res = await fetch('/api/admin/blocked-dates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: dateStr, reason: blockReason })
        });
        if (!res.ok) throw new Error();
        toast.success('Dia bloqueado!');
      }
      onClose();
    } catch {
      toast.error('Erro ao alterar bloqueio');
    } finally {
      setIsBlockingDay(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-brand-gray border border-brand-gray-light w-full max-w-3xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-gray-light">
          <div>
            <h2 className="text-2xl font-heading font-bold text-white capitalize">
              {format(date, 'EEEE, d \'de\' MMMM yyyy', { locale: pt })}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-brand-gray-text hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b border-brand-gray-light">
          <button
            onClick={() => setActiveTab('saidas')}
            className={`py-4 px-6 font-semibold font-body text-sm transition-colors border-b-2 ${
              activeTab === 'saidas' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-brand-gray-text hover:text-white'
            }`}
          >
            Saídas do Dia
          </button>
          <button
            onClick={() => setActiveTab('gestao')}
            className={`py-4 px-6 font-semibold font-body text-sm transition-colors border-b-2 ${
              activeTab === 'gestao' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-brand-gray-text hover:text-white'
            }`}
          >
            Gestão do Dia
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'saidas' ? (
            <div className="space-y-6">
              {sortedGroups.length === 0 ? (
                <div className="text-center py-12 text-brand-gray-text">
                  <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Nenhuma reserva para este dia.</p>
                </div>
              ) : (
                (sortedGroups as any[]).map((group, idx) => (
                  <div key={idx} className="bg-brand-black border border-brand-gray-light rounded-lg overflow-hidden">
                    <div className="bg-brand-gray-light/30 p-4 border-b border-brand-gray-light flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-brand-orange/20 text-brand-orange font-bold font-heading px-3 py-1 rounded">
                          {group.time}
                        </div>
                        <h3 className="font-bold text-white text-lg">{group.tourName}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-brand-gray-text mb-1">Ocupação: {group.totalBuggies}/{group.maxBuggies} Buggies</div>
                        <div className="w-32 h-2 bg-brand-gray-light rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${group.totalBuggies >= group.maxBuggies ? 'bg-red-500' : 'bg-brand-orange'}`}
                            style={{ width: `${Math.min(100, (group.totalBuggies / group.maxBuggies) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="divide-y divide-brand-gray-light/30 p-2">
                      {group.reservations.map((res: any) => (
                        <div key={res.id} className="p-3 flex items-center justify-between hover:bg-brand-gray-light/10 transition-colors rounded">
                          <div>
                            <div className="font-semibold text-white">{res.customer_name}</div>
                            <div className="text-xs text-brand-gray-text font-mono mt-0.5">Ref: {res.booking_ref} • {res.buggy_type}</div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="font-bold text-white flex items-center gap-1">
                              {res.buggy_quantity} <Car size={14} className="text-brand-gray-text" />
                            </div>
                            <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider ${
                              res.status === 'confirmado' ? 'bg-green-500/10 text-green-500' :
                              res.status === 'pendente' || res.status === 'pendente_mbway' ? 'bg-yellow-500/10 text-yellow-500' : 
                              'bg-brand-gray-light text-brand-gray-text'
                            }`}>
                              {res.status.replace('_mbway', '')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Bloqueio do Dia */}
              <div className="bg-brand-black border border-brand-gray-light rounded-lg p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                      <Lock size={18} className="text-red-500" />
                      Bloquear Dia Inteiro
                    </h3>
                    <p className="text-sm text-brand-gray-text">Impede novas reservas para todos os tours neste dia. As reservas atuais mantêm-se.</p>
                  </div>
                  <button
                    onClick={handleToggleDayBlock}
                    disabled={isBlockingDay}
                    className={`px-4 py-2 rounded font-bold text-sm transition-colors flex items-center gap-2 ${
                      dayBlocked 
                        ? 'bg-brand-gray-light text-white hover:bg-brand-gray-light/80' 
                        : 'bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/30 hover:border-red-500'
                    }`}
                  >
                    {dayBlocked ? <><Unlock size={16}/> Desbloquear</> : <><Lock size={16}/> Bloquear Dia</>}
                  </button>
                </div>
                
                {dayBlocked && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded p-4 flex items-start gap-3">
                    <AlertCircle size={20} className="text-red-500 shrink-0" />
                    <div>
                      <p className="text-red-500 font-bold text-sm mb-1">O dia está bloqueado.</p>
                      {dayBlocked.reason && <p className="text-sm text-red-500/80">Motivo: {dayBlocked.reason}</p>}
                    </div>
                  </div>
                )}

                {!dayBlocked && (
                  <div>
                    <label className="block text-sm font-semibold text-brand-gray-text mb-2">Motivo do bloqueio (opcional)</label>
                    <input 
                      type="text" 
                      value={blockReason}
                      onChange={e => setBlockReason(e.target.value)}
                      placeholder="Ex: Feriado, Manutenção..."
                      className="w-full bg-brand-gray border border-brand-gray-light rounded px-4 py-2 text-white focus:border-brand-orange outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Extra Slots */}
              <div className="bg-brand-black border border-brand-gray-light rounded-lg p-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                  <Plus size={18} className="text-brand-orange" />
                  Adicionar Saída Extra
                </h3>
                <p className="text-sm text-brand-gray-text mb-6">Abre um novo horário apenas para o dia de hoje.</p>

                <div className="flex gap-4 items-end mb-6">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-brand-gray-text mb-2">Tour</label>
                    <select 
                      value={extraSlotTour}
                      onChange={e => setExtraSlotTour(e.target.value)}
                      className="w-full bg-brand-gray border border-brand-gray-light rounded px-4 py-2 text-white focus:border-brand-orange outline-none"
                    >
                      <option value="">Selecione um tour...</option>
                      {data.tours.map((t: any) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-32">
                    <label className="block text-sm font-semibold text-brand-gray-text mb-2">Hora</label>
                    <input 
                      type="time" 
                      value={extraSlotTime}
                      onChange={e => setExtraSlotTime(e.target.value)}
                      className="w-full bg-brand-gray border border-brand-gray-light rounded px-4 py-2 text-white focus:border-brand-orange outline-none"
                    />
                  </div>
                  <button 
                    onClick={handleAddExtraSlot}
                    className="bg-brand-orange text-white px-4 py-2 rounded font-bold hover:bg-brand-orange/90 transition-colors h-[42px]"
                  >
                    Adicionar
                  </button>
                </div>

                {extraSlots.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-white mb-3">Saídas Extra Atuais:</h4>
                    <div className="space-y-2">
                      {extraSlots.map((slot: any) => {
                        const tour = data.tours.find((t: any) => t.id === slot.tour_id);
                        return (
                          <div key={slot.id} className="bg-brand-gray border border-brand-gray-light rounded px-4 py-2 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="font-heading font-bold text-brand-orange">{slot.time}</span>
                              <span className="text-sm text-white">{tour?.name}</span>
                            </div>
                            <button 
                              onClick={() => handleRemoveExtraSlot(slot.id)}
                              className="text-brand-gray-text hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek, isToday as isTodayDate } from 'date-fns';
import { pt } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Lock, Car, Clock } from 'lucide-react';
import { getMonthData } from './actions';
import DayModal from './DayModal';

export default function CalendarView({ initialData, initialDate }: { initialData: any, initialDate: string }) {
  const [currentDate, setCurrentDate] = useState(new Date(initialDate));
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  useEffect(() => {
    // Se mudou de mês em relação ao initialDate, faz fetch
    if (!isSameMonth(currentDate, new Date(initialDate))) {
      const fetchNewMonth = async () => {
        setIsLoading(true);
        try {
          const newData = await getMonthData(currentDate.toISOString());
          setData(newData);
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      };
      fetchNewMonth();
    } else {
      setData(initialData);
    }
  }, [currentDate, initialDate, initialData]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getDayData = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    
    // Total bugs for this day
    const dayReservations = data.reservations.filter((r: any) => r.slot_date === dateStr);
    const confirmedCount = dayReservations.filter((r: any) => r.status === 'confirmado' || r.status === 'concluido').reduce((acc: number, r: any) => acc + r.buggy_quantity, 0);
    const pendingCount = dayReservations.filter((r: any) => r.status === 'pendente' || r.status === 'pendente_mbway').reduce((acc: number, r: any) => acc + r.buggy_quantity, 0);
    
    // Check if fully blocked
    const fullyBlocked = data.blockedDates.find((b: any) => b.date === dateStr && !b.time_slot && !b.tour_id);

    return {
      reservations: dayReservations,
      confirmedCount,
      pendingCount,
      fullyBlocked
    };
  };

  return (
    <div className="bg-brand-gray border border-brand-gray-light rounded-xl overflow-hidden flex flex-col h-[800px]">
      {/* Header */}
      <div className="p-4 border-b border-brand-gray-light flex items-center justify-between bg-brand-black">
        <h2 className="text-2xl font-heading font-bold text-white capitalize">
          {format(currentDate, 'MMMM yyyy', { locale: pt })}
        </h2>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={goToToday}
            className="px-4 py-2 bg-brand-gray-light hover:bg-white/10 text-white rounded text-sm transition-colors font-semibold"
          >
            Hoje
          </button>
          <div className="flex bg-brand-gray-light rounded overflow-hidden ml-2">
            <button onClick={prevMonth} className="p-2 hover:bg-white/10 transition-colors" disabled={isLoading}>
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-white/10 transition-colors border-l border-brand-gray/30" disabled={isLoading}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 border-b border-brand-gray-light bg-brand-gray-light/30">
        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => (
          <div key={day} className="p-3 text-center text-sm font-semibold text-brand-gray-text">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-5 bg-brand-gray-light gap-px">
        {calendarDays.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isTodayDate(day);
          const dayData = getDayData(day);
          
          return (
            <div 
              key={idx}
              onClick={() => setSelectedDay(day)}
              className={`bg-brand-gray relative p-2 cursor-pointer transition-colors hover:bg-brand-gray-light/50 overflow-hidden flex flex-col
                ${!isCurrentMonth ? 'opacity-40' : ''}
                ${isToday ? 'ring-2 ring-inset ring-brand-orange z-10' : ''}
              `}
            >
              <div className={`text-right text-sm font-bold mb-1 ${isToday ? 'text-brand-orange' : 'text-white/60'}`}>
                {format(day, 'd')}
              </div>

              {dayData.fullyBlocked && (
                <div className="absolute inset-0 bg-red-500/20 backdrop-blur-[1px] flex flex-col items-center justify-center pointer-events-none border border-red-500/30 m-1 rounded">
                  <Lock size={20} className="text-red-500 mb-1" />
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Bloqueado</span>
                </div>
              )}

              <div className="flex-1 flex flex-col gap-1 mt-1 z-10 relative pointer-events-none">
                {dayData.confirmedCount > 0 && (
                  <div className="bg-brand-orange/20 text-brand-orange text-xs px-2 py-1 rounded flex items-center justify-between font-bold border border-brand-orange/30">
                    <span>Conf.</span>
                    <span className="flex items-center gap-1"><Car size={12}/> {dayData.confirmedCount}</span>
                  </div>
                )}
                {dayData.pendingCount > 0 && (
                  <div className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded flex items-center justify-between font-bold border border-yellow-500/30">
                    <span>Pend.</span>
                    <span className="flex items-center gap-1"><Clock size={12}/> {dayData.pendingCount}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-brand-black/50 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="w-8 h-8 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin" />
        </div>
      )}

      {selectedDay && (
        <DayModal 
          date={selectedDay} 
          data={data} 
          onClose={() => {
            setSelectedDay(null);
            // Refresh local data to show new blocks/slots
            const refresh = async () => {
              const newData = await getMonthData(currentDate.toISOString());
              setData(newData);
            };
            refresh();
          }} 
        />
      )}
    </div>
  );
}

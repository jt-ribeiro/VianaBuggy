'use client';

import { useState } from 'react';
import { Check, Users, Car, Phone, Mail } from 'lucide-react';

type Reservation = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  people_count: number;
  buggy_type: string;
  buggy_quantity: number;
  group_id: string | null;
  groups?: { name: string; group_code: string } | null;
};

export default function CheckinList({ reservations }: { reservations: Reservation[] }) {
  // Local state to keep track of who is checked in
  const [checkedIn, setCheckedIn] = useState<Record<string, boolean>>({});

  const toggleCheckin = (id: string) => {
    setCheckedIn(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="space-y-4">
      {reservations.map((res) => {
        const isGroup = !!res.group_id;
        const isChecked = !!checkedIn[res.id];

        return (
          <div 
            key={res.id} 
            className={`
              relative overflow-hidden border rounded-xl p-5 transition-all duration-300
              ${isGroup ? 'bg-brand-orange/10 border-brand-orange/30' : 'bg-brand-gray-light border-brand-gray-light'}
              ${isChecked ? 'opacity-60 grayscale-[50%]' : ''}
            `}
          >
            {isGroup && (
              <div className="absolute top-0 right-0 bg-brand-orange text-brand-black text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                Grupo: {res.groups?.name || res.groups?.group_code}
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex-1">
                <h3 className={`font-bold text-xl mb-1 ${isChecked ? 'line-through text-brand-gray-text' : 'text-brand-white'}`}>
                  {res.customer_name}
                </h3>
                
                <div className="flex flex-col gap-1 text-sm text-brand-gray-text mt-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{res.customer_phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{res.customer_email}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-4 md:min-w-[140px]">
                <div className="flex gap-4 bg-brand-black/40 p-3 rounded-lg flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <Users className="w-4 h-4 text-brand-orange mb-1" />
                    <span className="font-bold">{res.people_count}</span>
                  </div>
                  <div className="w-px bg-brand-gray-light"></div>
                  <div className="flex flex-col items-center flex-1">
                    <Car className="w-4 h-4 text-brand-orange mb-1" />
                    <span className="font-bold">{res.buggy_quantity}</span>
                    <span className="text-[10px] text-brand-gray-text">{res.buggy_type.includes('4') ? '4L' : '2L'}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleCheckin(res.id)}
                  className={`
                    flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold transition-all
                    ${isChecked 
                      ? 'bg-brand-gray text-brand-gray-text hover:bg-brand-gray-light' 
                      : 'bg-brand-orange text-brand-white hover:bg-brand-orange-light shadow-aggressive-sm hover:translate-y-[-2px]'}
                  `}
                >
                  <Check className={`w-5 h-5 ${isChecked ? 'opacity-50' : ''}`} />
                  {isChecked ? 'Check-in Feito' : 'Fazer Check-in'}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

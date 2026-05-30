'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Car, 
  Calendar, 
  Users, 
  CreditCard, 
  Smartphone,
  AlertCircle
} from 'lucide-react';
import { tours } from '@/lib/tours';
import { formatPrice } from '@/lib/utils';
import { pt } from 'date-fns/locale';

// Removed loadStripe

type Step = 1 | 2 | 3;

interface BookingState {
  tourId: string;
  date: Date | undefined;
  buggyType: '2-seater' | '4-seater';
  quantity: number;
  name: string;
  email: string;
  phone: string;
  notes: string;
  paymentMethod: 'stripe' | 'mbway';
}

export default function BookingForm() {
  const searchParams = useSearchParams();
  const initialTour = searchParams.get('tour');
  
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<BookingState>({
    tourId: initialTour || tours[0].id,
    date: undefined,
    buggyType: '2-seater',
    quantity: 1,
    name: '',
    email: '',
    phone: '',
    notes: '',
    paymentMethod: 'stripe',
  });

  const selectedTour = tours.find(t => t.id === formData.tourId) || tours[0];
  
  const unitPrice = formData.buggyType === '2-seater' 
    ? selectedTour.price2Seater 
    : selectedTour.price4Seater;
    
  const totalPrice = unitPrice * formData.quantity;

  const updateForm = (updates: Partial<BookingState>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setError(null);
  };

  const validateStep1 = () => {
    if (!formData.tourId) return 'Por favor seleciona um tour.';
    if (!formData.date) return 'Por favor escolhe uma data.';
    if (formData.quantity < 1) return 'Quantidade mínima é 1 buggy.';
    return null;
  };

  const validateStep2 = () => {
    if (!formData.name.trim()) return 'Nome completo é obrigatório.';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) return 'Email inválido.';
    if (!formData.phone.trim()) return 'Telemóvel é obrigatório.';
    return null;
  };

  const handleNextStep = () => {
    let err = null;
    if (step === 1) err = validateStep1();
    if (step === 2) err = validateStep2();
    
    if (err) {
      setError(err);
      return;
    }
    
    setStep(prev => (prev + 1) as Step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setStep(prev => (prev - 1) as Step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      if (formData.paymentMethod === 'stripe') {
        const response = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tourId: formData.tourId,
            date: formData.date?.toISOString(),
            buggyType: formData.buggyType,
            quantity: formData.quantity,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            notes: formData.notes,
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erro ao processar pagamento');
        }

        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error('URL de pagamento não encontrado');
        }
      } else {
        // MBWay Booking
        const response = await fetch('/api/reserva', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erro ao criar reserva');
        }

        window.location.href = `/reservas/confirmacao?ref=${data.reference}&method=mbway`;
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro inesperado. Tenta novamente.');
      setIsSubmitting(false);
    }
  };

  // Only allow Saturdays and Sundays
  const isDateDisabled = (date: Date) => {
    const day = date.getDay();
    const isPast = date.getTime() < new Date().setHours(0, 0, 0, 0);
    return isPast || (day !== 0 && day !== 6);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Form Area */}
      <div className="lg:col-span-2">
        {/* Step Progress */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-brand-gray-light -z-10" />
          
          {[
            { num: 1, label: 'Detalhes' },
            { num: 2, label: 'Dados' },
            { num: 3, label: 'Pagamento' }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-lg transition-colors ${
                  step > s.num 
                    ? 'bg-brand-orange text-white' 
                    : step === s.num 
                      ? 'bg-brand-orange border-4 border-brand-black text-white shadow-aggressive-sm' 
                      : 'bg-brand-gray-light text-brand-gray-text'
                }`}
              >
                {step > s.num ? <CheckCircle2 size={20} /> : s.num}
              </div>
              <span className={`text-xs font-body font-semibold uppercase tracking-wider ${
                step >= s.num ? 'text-white' : 'text-brand-gray-text'
              }`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-sm p-4 mb-8 flex items-start gap-3 animate-fade-in">
            <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-200 text-sm font-body">{error}</p>
          </div>
        )}

        {/* STEP 1: Tour Details */}
        {step === 1 && (
          <div className="space-y-8 animate-fade-in">
            {/* Tour Selection */}
            <div>
              <h3 className="font-heading text-2xl font-bold text-white mb-4">ESCOLHE O TOUR</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tours.map(tour => (
                  <button
                    key={tour.id}
                    onClick={() => updateForm({ tourId: tour.id })}
                    className={`text-left p-4 rounded-sm border transition-all ${
                      formData.tourId === tour.id 
                        ? 'bg-brand-gray border-brand-orange shadow-aggressive-sm' 
                        : 'bg-brand-black border-brand-gray-light hover:border-white/20'
                    }`}
                  >
                    <div className="relative h-24 mb-3 rounded-sm overflow-hidden">
                      <Image src={tour.image} alt={tour.name} fill className="object-cover" />
                    </div>
                    <h4 className="font-heading font-bold text-lg text-white mb-1">{tour.name}</h4>
                    <p className="text-brand-gray-text text-xs font-body mb-2">{tour.duration}</p>
                    <p className="font-heading font-bold text-brand-orange">Desde €{tour.price2Seater}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Date Selection */}
              <div>
                <h3 className="font-heading text-2xl font-bold text-white mb-4">ESCOLHE A DATA</h3>
                <div className="bg-brand-gray border border-brand-gray-light rounded-sm p-4 flex justify-center">
                  <DayPicker
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => updateForm({ date })}
                    disabled={isDateDisabled}
                    locale={pt}
                    className="rdp-dark"
                  />
                </div>
                <p className="text-brand-gray-text text-xs font-body mt-2 text-center">
                  * Tours disponíveis apenas aos sábados e domingos
                </p>
              </div>

              {/* Buggy Details */}
              <div className="space-y-8">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-4">TIPO DE BUGGY</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => updateForm({ buggyType: '2-seater' })}
                      className={`p-4 rounded-sm border flex flex-col items-center gap-2 transition-all ${
                        formData.buggyType === '2-seater' 
                          ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' 
                          : 'bg-brand-black border-brand-gray-light text-brand-gray-text hover:border-white/20'
                      }`}
                    >
                      <Car size={32} />
                      <span className="font-body font-semibold text-sm">2 Lugares</span>
                      <span className="font-heading text-lg text-white">€{selectedTour.price2Seater}</span>
                    </button>
                    <button
                      onClick={() => updateForm({ buggyType: '4-seater' })}
                      className={`p-4 rounded-sm border flex flex-col items-center gap-2 transition-all ${
                        formData.buggyType === '4-seater' 
                          ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' 
                          : 'bg-brand-black border-brand-gray-light text-brand-gray-text hover:border-white/20'
                      }`}
                    >
                      <Users size={32} />
                      <span className="font-body font-semibold text-sm">4 Lugares</span>
                      <span className="font-heading text-lg text-white">€{selectedTour.price4Seater}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-4">QUANTIDADE</h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => updateForm({ quantity: Math.max(1, formData.quantity - 1) })}
                      className="w-12 h-12 flex items-center justify-center bg-brand-gray border border-brand-gray-light rounded-sm text-white hover:border-brand-orange hover:text-brand-orange transition-colors font-heading text-2xl"
                    >
                      -
                    </button>
                    <span className="font-heading text-3xl font-black text-white w-12 text-center">
                      {formData.quantity}
                    </span>
                    <button
                      onClick={() => updateForm({ quantity: Math.min(10, formData.quantity + 1) })}
                      className="w-12 h-12 flex items-center justify-center bg-brand-gray border border-brand-gray-light rounded-sm text-white hover:border-brand-orange hover:text-brand-orange transition-colors font-heading text-2xl"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Personal Info */}
        {step === 2 && (
          <div className="bg-brand-gray border border-brand-gray-light rounded-sm p-8 animate-fade-in">
            <h3 className="font-heading text-2xl font-bold text-white mb-6">OS TEUS DADOS</h3>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-body text-white/80 mb-2">Nome Completo *</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateForm({ name: e.target.value })}
                  className="w-full bg-brand-black border border-brand-gray-light rounded-sm px-4 py-3 text-white font-body focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all"
                  placeholder="Insere o teu nome"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-body text-white/80 mb-2">Email *</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => updateForm({ email: e.target.value })}
                    className="w-full bg-brand-black border border-brand-gray-light rounded-sm px-4 py-3 text-white font-body focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all"
                    placeholder="teu@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-body text-white/80 mb-2">Telemóvel *</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateForm({ phone: e.target.value })}
                    className="w-full bg-brand-black border border-brand-gray-light rounded-sm px-4 py-3 text-white font-body focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all"
                    placeholder="+351 9XX XXX XXX"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-body text-white/80 mb-2">Notas / Observações (Opcional)</label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => updateForm({ notes: e.target.value })}
                  rows={4}
                  className="w-full bg-brand-black border border-brand-gray-light rounded-sm px-4 py-3 text-white font-body focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-all resize-none"
                  placeholder="Alguma nota para a equipa Viana Buggy?"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Payment */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h3 className="font-heading text-2xl font-bold text-white mb-6">MÉTODO DE PAGAMENTO</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => updateForm({ paymentMethod: 'stripe' })}
                className={`p-6 rounded-sm border flex flex-col items-center gap-3 transition-all ${
                  formData.paymentMethod === 'stripe' 
                    ? 'bg-brand-gray border-brand-orange shadow-aggressive-sm' 
                    : 'bg-brand-black border-brand-gray-light text-brand-gray-text hover:border-white/20'
                }`}
              >
                <CreditCard size={32} className={formData.paymentMethod === 'stripe' ? 'text-brand-orange' : ''} />
                <span className="font-heading font-bold text-lg text-white">CARTÃO DE CRÉDITO</span>
                <span className="text-xs font-body text-brand-gray-text text-center">
                  Pagamento 100% seguro via Stripe
                </span>
              </button>

              <button
                onClick={() => updateForm({ paymentMethod: 'mbway' })}
                className={`p-6 rounded-sm border flex flex-col items-center gap-3 transition-all ${
                  formData.paymentMethod === 'mbway' 
                    ? 'bg-brand-gray border-brand-orange shadow-aggressive-sm' 
                    : 'bg-brand-black border-brand-gray-light text-brand-gray-text hover:border-white/20'
                }`}
              >
                <Smartphone size={32} className={formData.paymentMethod === 'mbway' ? 'text-brand-orange' : ''} />
                <span className="font-heading font-bold text-lg text-white">MBWAY</span>
                <span className="text-xs font-body text-brand-gray-text text-center">
                  Confirmação manual após pagamento
                </span>
              </button>
            </div>

            {formData.paymentMethod === 'mbway' && (
              <div className="bg-brand-gray border border-brand-orange/50 rounded-sm p-6 mb-8 text-center animate-fade-in">
                <h4 className="font-heading font-bold text-xl text-brand-orange mb-4">INSTRUÇÕES MBWAY</h4>
                <ol className="text-sm font-body text-white/80 space-y-3 max-w-sm mx-auto text-left mb-6">
                  <li>1. Abre a app MBWay ou banco no teu telemóvel</li>
                  <li>2. Seleciona &quot;Enviar Dinheiro&quot;</li>
                  <li>3. Introduz o número: <strong className="text-white bg-brand-black px-2 py-1 rounded mx-1">+351 923 040 807</strong></li>
                  <li>4. Introduz o valor de: <strong className="text-white">{formatPrice(totalPrice * 100)}</strong></li>
                  <li>5. Coloca o teu Nome nas observações</li>
                  <li>6. Clica em &quot;Confirmar Pagamento&quot; abaixo</li>
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-8 border-t border-brand-gray-light">
          {step > 1 ? (
            <button
              onClick={handlePrevStep}
              className="flex items-center gap-2 text-white/70 hover:text-brand-orange font-heading font-bold tracking-wider px-6 py-3 transition-colors"
            >
              <ChevronLeft size={20} />
              VOLTAR
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              onClick={handleNextStep}
              className="flex items-center gap-2 bg-brand-orange text-white font-heading font-bold tracking-wider px-8 py-3 rounded-sm transform -skew-x-3 hover:bg-brand-orange-light transition-all shadow-lg shadow-brand-orange/20"
            >
              <span className="skew-x-3">SEGUINTE</span>
              <ChevronRight size={20} className="skew-x-3" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-brand-orange text-white font-heading font-bold tracking-wider px-8 py-4 rounded-sm transform -skew-x-3 hover:bg-brand-orange-light hover:animate-pulse-cta transition-all shadow-aggressive disabled:opacity-50 disabled:animate-none"
            >
              <span className="skew-x-3">
                {isSubmitting ? 'A PROCESSAR...' : formData.paymentMethod === 'stripe' ? 'PAGAR AGORA' : 'CONFIRMAR PAGAMENTO'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Sidebar Summary */}
      <div className="lg:col-span-1">
        <div className="bg-brand-gray border border-brand-gray-light rounded-sm p-6 sticky top-24">
          <h3 className="font-heading text-xl font-bold text-white mb-6 flex items-center gap-2">
            RESUMO DA RESERVA
          </h3>

          <div className="space-y-4 font-body text-sm">
            <div className="flex justify-between pb-4 border-b border-brand-gray-light/50">
              <span className="text-brand-gray-text">Tour</span>
              <span className="text-white font-semibold text-right">{selectedTour.name}</span>
            </div>
            
            <div className="flex justify-between pb-4 border-b border-brand-gray-light/50">
              <span className="text-brand-gray-text">Data</span>
              <span className="text-white font-semibold text-right">
                {formData.date ? formData.date.toLocaleDateString('pt-PT') : '-'}
              </span>
            </div>

            <div className="flex justify-between pb-4 border-b border-brand-gray-light/50">
              <span className="text-brand-gray-text">Tipo de Buggy</span>
              <span className="text-white font-semibold">{formData.buggyType === '2-seater' ? '2 Lugares' : '4 Lugares'}</span>
            </div>

            <div className="flex justify-between pb-4 border-b border-brand-gray-light/50">
              <span className="text-brand-gray-text">Quantidade</span>
              <span className="text-white font-semibold">{formData.quantity}x</span>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-end mb-1">
                <span className="text-brand-gray-text uppercase font-bold tracking-widest text-xs">Total a Pagar</span>
                <span className="font-heading text-3xl font-black text-brand-orange">
                  {formatPrice(totalPrice * 100)}
                </span>
              </div>
              <p className="text-xs text-brand-gray-text text-right mt-2">
                IVA incluído à taxa legal em vigor
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

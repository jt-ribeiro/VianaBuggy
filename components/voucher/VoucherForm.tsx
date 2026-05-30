'use client';

import { useState, useRef } from 'react';
import { tours } from '@/lib/tours';
import { formatPrice } from '@/lib/utils';
import { CreditCard, Smartphone, Download, CheckCircle2, Car, Users } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function VoucherForm() {
  const [formData, setFormData] = useState({
    tourId: tours[0].id,
    buggyType: '2-seater',
    recipientName: '',
    senderName: '',
    message: '',
    paymentMethod: 'mbway',
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const voucherRef = useRef<HTMLDivElement>(null);

  const selectedTour = tours.find(t => t.id === formData.tourId) || tours[0];
  const unitPrice = formData.buggyType === '2-seater' ? selectedTour.price2Seater : selectedTour.price4Seater;

  const handleGeneratePDF = async () => {
    if (!formData.recipientName || !formData.senderName) {
      alert('Por favor, preenche o nome do destinatário e o teu nome.');
      return;
    }

    setIsGenerating(true);
    try {
      if (voucherRef.current) {
        const canvas = await html2canvas(voucherRef.current, {
          scale: 2,
          backgroundColor: '#111111',
          useCORS: true,
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`Voucher-Viana-Buggy-${formData.recipientName.replace(/\s+/g, '-')}.pdf`);
        setIsSuccess(true);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erro ao gerar PDF. Tenta novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Form Side */}
      <div className="space-y-8">
        <div className="bg-brand-gray border border-brand-gray-light rounded-sm p-6 sm:p-8">
          <h3 className="font-heading text-2xl font-bold text-white mb-6">PERSONALIZAR VALE</h3>
          
          <div className="space-y-6">
            {/* Tour Selection */}
            <div>
              <label className="block text-sm font-body text-white/80 mb-2">Tour a Oferecer</label>
              <select
                value={formData.tourId}
                onChange={(e) => setFormData({ ...formData, tourId: e.target.value })}
                className="w-full bg-brand-black border border-brand-gray-light rounded-sm px-4 py-3 text-white font-body focus:border-brand-orange outline-none"
              >
                {tours.map(tour => (
                  <option key={tour.id} value={tour.id}>
                    {tour.name} (desde €{tour.price2Seater})
                  </option>
                ))}
              </select>
            </div>

            {/* Buggy Type */}
            <div>
              <label className="block text-sm font-body text-white/80 mb-2">Tipo de Buggy</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setFormData({ ...formData, buggyType: '2-seater' })}
                  className={`p-3 rounded-sm border flex items-center justify-center gap-2 transition-all ${
                    formData.buggyType === '2-seater' 
                      ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' 
                      : 'bg-brand-black border-brand-gray-light text-brand-gray-text'
                  }`}
                >
                  <Car size={20} />
                  <span className="font-body font-semibold text-sm">2 Lugares</span>
                </button>
                <button
                  onClick={() => setFormData({ ...formData, buggyType: '4-seater' })}
                  className={`p-3 rounded-sm border flex items-center justify-center gap-2 transition-all ${
                    formData.buggyType === '4-seater' 
                      ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' 
                      : 'bg-brand-black border-brand-gray-light text-brand-gray-text'
                  }`}
                >
                  <Users size={20} />
                  <span className="font-body font-semibold text-sm">4 Lugares</span>
                </button>
              </div>
            </div>

            {/* Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-body text-white/80 mb-2">Para (Destinatário)</label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  placeholder="Nome do felizardo"
                  className="w-full bg-brand-black border border-brand-gray-light rounded-sm px-4 py-3 text-white font-body focus:border-brand-orange outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-body text-white/80 mb-2">De (O teu nome)</label>
                <input
                  type="text"
                  value={formData.senderName}
                  onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                  placeholder="O teu nome"
                  className="w-full bg-brand-black border border-brand-gray-light rounded-sm px-4 py-3 text-white font-body focus:border-brand-orange outline-none"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-body text-white/80 mb-2">Mensagem Curta (Opcional)</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Ex: Parabéns! Prepara-te para a aventura!"
                rows={2}
                maxLength={60}
                className="w-full bg-brand-black border border-brand-gray-light rounded-sm px-4 py-3 text-white font-body focus:border-brand-orange outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Payment & Download */}
        <div className="bg-brand-gray border border-brand-gray-light rounded-sm p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading text-xl font-bold text-white">TOTAL A PAGAR</h3>
            <span className="font-heading text-3xl font-black text-brand-orange">{formatPrice(unitPrice * 100)}</span>
          </div>

          {!isSuccess ? (
            <>
              <p className="text-sm font-body text-brand-gray-text mb-4">
                Como este é um processo manual, envia o comprovativo de pagamento por MBWay para o número <strong>+351 923 040 807</strong> após gerares o PDF.
              </p>
              
              <button
                onClick={handleGeneratePDF}
                disabled={isGenerating || !formData.recipientName || !formData.senderName}
                className="w-full flex items-center justify-center gap-2 bg-brand-orange text-white font-heading font-bold text-lg tracking-wider px-8 py-4 rounded-sm transform -skew-x-3 hover:bg-brand-orange-light transition-all shadow-aggressive disabled:opacity-50 disabled:animate-none"
              >
                <span className="skew-x-3 flex items-center gap-2">
                  <Download size={20} />
                  {isGenerating ? 'A GERAR PDF...' : 'GERAR E DESCARREGAR VALE'}
                </span>
              </button>
            </>
          ) : (
            <div className="text-center animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-4">
                <CheckCircle2 size={32} className="text-green-500" />
              </div>
              <h4 className="font-heading text-xl font-bold text-white mb-2">Voucher Gerado com Sucesso!</h4>
              <p className="text-sm font-body text-white/70 mb-4">
                Por favor efetua o pagamento de <strong>{formatPrice(unitPrice * 100)}</strong> por MBWay para o número +351 923 040 807 para validar o teu voucher.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="text-brand-orange text-sm font-bold font-body hover:underline"
              >
                Gerar outro voucher
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Preview Side */}
      <div>
        <h3 className="font-heading text-xl font-bold text-white mb-6">PRÉ-VISUALIZAÇÃO</h3>
        
        {/* Render actual printable voucher but scaled down for preview */}
        <div className="relative overflow-hidden rounded-lg shadow-aggressive-sm border border-brand-gray-light bg-[#111111]">
          {/* This is the div that will be converted to PDF */}
          <div 
            ref={voucherRef} 
            className="w-[800px] h-[400px] bg-[#111111] p-10 relative overflow-hidden flex transform scale-50 origin-top-left sm:scale-75 md:scale-100 lg:scale-[0.55] xl:scale-75"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40"
                style={{ backgroundImage: `url(https://www.vianabuggy.pt${selectedTour.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/80 to-transparent" />
            </div>
            
            <div className="absolute -top-10 -right-10 w-40 h-40 border-[8px] border-[#E8600A] transform rotate-12 opacity-20" />
            <div className="absolute bottom-0 left-0 w-full h-2 bg-[#E8600A]" />

            <div className="relative z-10 w-2/3 pr-8 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-black text-white tracking-widest uppercase mb-1">
                  VIANA <span style={{ color: '#E8600A' }}>BUGGY</span>
                </h1>
                <p className="text-[#999999] text-sm uppercase tracking-widest font-bold">Vale Presente</p>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-[#999999] text-xs uppercase font-bold tracking-widest mb-1">Experiência</p>
                  <h2 className="text-4xl font-black text-white uppercase">{selectedTour.name}</h2>
                  <p className="text-[#E8600A] font-bold mt-1">Buggy Can-Am {formData.buggyType === '2-seater' ? '2' : '4'} Lugares • {selectedTour.duration}</p>
                </div>

                <div className="flex gap-12">
                  <div>
                    <p className="text-[#999999] text-xs uppercase font-bold tracking-widest mb-1">Para</p>
                    <p className="text-2xl font-bold text-white">{formData.recipientName || 'Nome do Destinatário'}</p>
                  </div>
                  <div>
                    <p className="text-[#999999] text-xs uppercase font-bold tracking-widest mb-1">De</p>
                    <p className="text-2xl font-bold text-white">{formData.senderName || 'O teu nome'}</p>
                  </div>
                </div>

                {formData.message && (
                  <div>
                    <p className="text-white/80 italic text-lg" style={{ fontFamily: 'sans-serif' }}>"{formData.message}"</p>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-[#333333] flex justify-between items-end">
                <div>
                  <p className="text-[#999999] text-xs">Válido por 12 meses. Sujeito a marcação prévia.</p>
                  <p className="text-white font-bold text-sm">vianabuggy.pt • +351 923 040 807</p>
                </div>
                <div className="bg-[#E8600A] px-4 py-2 transform -skew-x-6 text-white font-black">
                  VÁLIDO
                </div>
              </div>
            </div>
          </div>
          
          {/* Invisible spacer to maintain height based on scaling */}
          <div className="h-[200px] sm:h-[300px] md:h-[400px] lg:h-[220px] xl:h-[300px]" />
        </div>
      </div>
    </div>
  );
}

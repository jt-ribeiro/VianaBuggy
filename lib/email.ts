import { Resend } from 'resend';
import { formatPrice, formatDate } from './utils';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromEmail = 'onboarding@resend.dev'; // Default for testing
const operatorEmail = process.env.CONTACT_EMAIL || 'vianabuggy@gmail.com';

export interface BookingData {
  reference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tourName: string;
  date: string;
  buggyType: string;
  quantity: number;
  totalPrice: number;
  paymentMethod: string;
  notes?: string;
  status: string;
}

export async function sendBookingConfirmation(booking: BookingData) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not set. Email not sent.');
    return { success: false, error: 'RESEND_API_KEY missing' };
  }

  try {
    const data = await resend.emails.send({
      from: `Viana Buggy <${fromEmail}>`,
      to: booking.customerEmail,
      subject: `Reserva Confirmada - Viana Buggy (${booking.reference})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #111111; color: #ffffff; padding: 20px; border-top: 5px solid #E8600A;">
          <h1 style="color: #E8600A; font-size: 24px; text-transform: uppercase;">A TUA RESERVA ESTÁ CONFIRMADA!</h1>
          <p style="color: #ffffff;">Olá ${booking.customerName},</p>
          <p style="color: #ffffff;">Obrigado por escolheres a Viana Buggy. Prepara-te para uma aventura inesquecível!</p>
          
          <div style="background-color: #1A1A1A; padding: 15px; margin: 20px 0; border-left: 4px solid #E8600A;">
            <h2 style="color: #E8600A; font-size: 18px; margin-top: 0;">Detalhes da Reserva</h2>
            <p style="color: #ffffff;"><strong>Referência:</strong> ${booking.reference}</p>
            <p style="color: #ffffff;"><strong>Tour:</strong> ${booking.tourName}</p>
            <p style="color: #ffffff;"><strong>Data:</strong> ${formatDate(booking.date)}</p>
            <p style="color: #ffffff;"><strong>Buggies:</strong> ${booking.quantity}x (${booking.buggyType})</p>
            <p style="color: #ffffff;"><strong>Total:</strong> ${formatPrice(booking.totalPrice)}</p>
            <p style="color: #ffffff;"><strong>Método de Pagamento:</strong> ${booking.paymentMethod}</p>
          </div>

          <h3 style="color: #E8600A;">Onde nos encontrar?</h3>
          <p style="color: #ffffff;">R. da Zona Industrial fase 2 pav. Nº 9, 4935-232 Neiva, Viana do Castelo</p>
          
          <h3 style="color: #E8600A;">Importante:</h3>
          <ul style="color: #ffffff;">
            <li>Por favor, chega 15 minutos antes da hora marcada.</li>
            <li>Não te esqueças de trazer a tua carta de condução válida.</li>
            <li>Recomendamos roupa confortável que se possa sujar.</li>
          </ul>

          <p style="color: #ffffff; margin-top: 30px;">Com os melhores cumprimentos,<br>A Equipa Viana Buggy</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

export async function sendOperatorNotification(booking: BookingData) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not set. Operator email not sent.');
    return { success: false, error: 'RESEND_API_KEY missing' };
  }

  try {
    const data = await resend.emails.send({
      from: `Viana Buggy System <${fromEmail}>`,
      to: operatorEmail,
      subject: `Nova Reserva - ${booking.tourName} (${booking.reference})`,
      html: `
        <h2>Nova Reserva Recebida</h2>
        <p><strong>Referência:</strong> ${booking.reference}</p>
        <p><strong>Status:</strong> ${booking.status}</p>
        <p><strong>Nome:</strong> ${booking.customerName}</p>
        <p><strong>Email:</strong> ${booking.customerEmail}</p>
        <p><strong>Telemóvel:</strong> ${booking.customerPhone}</p>
        <p><strong>Tour:</strong> ${booking.tourName}</p>
        <p><strong>Data:</strong> ${formatDate(booking.date)}</p>
        <p><strong>Buggies:</strong> ${booking.quantity}x (${booking.buggyType})</p>
        <p><strong>Total:</strong> ${formatPrice(booking.totalPrice)}</p>
        <p><strong>Método de Pagamento:</strong> ${booking.paymentMethod}</p>
        ${booking.notes ? `<p><strong>Notas:</strong> ${booking.notes}</p>` : ''}
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send operator email:', error);
    return { success: false, error };
  }
}

export async function sendContactMessage(data: { name: string; email: string; message: string }) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not set. Contact email not sent.');
    return { success: false, error: 'RESEND_API_KEY missing' };
  }

  try {
    const result = await resend.emails.send({
      from: `Website Contact Form <${fromEmail}>`,
      to: operatorEmail,
      replyTo: data.email,
      subject: `Nova Mensagem de Contacto de ${data.name}`,
      text: `Nome: ${data.name}\nEmail: ${data.email}\n\nMensagem:\n${data.message}`,
    });
    return { success: true, result };
  } catch (error) {
    console.error('Failed to send contact email:', error);
    return { success: false, error };
  }
}

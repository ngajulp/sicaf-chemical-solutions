import emailjs from '@emailjs/browser';

// EmailJS Configuration
const SERVICE_ID = 'service_kgrb9cj';
const TEMPLATE_ID = 'template_xb3kdtv';
const PUBLIC_KEY = 'DeEmic4-sZdSQiGH5';

// Initialize EmailJS
emailjs.init(PUBLIC_KEY);

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  subject?: string;
}

interface QuoteFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  products: string;
  quantity?: string;
  description?: string;
  budget?: string;
  deadline?: string;
}

export const sendContactEmail = async (data: ContactFormData): Promise<void> => {
  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      from_name: data.name,
      from_email: data.email,
      phone: data.phone || 'Non renseigné',
      company: data.company || 'Non renseigné',
      message: data.message,
      subject: data.subject || 'Message depuis le site SICAF',
      to_name: 'SICAF',
      to_email: 'sicaf@chimistry.com',
      reply_to: data.email,
    });
  } catch (error) {
    console.error('EmailJS Error:', error);
    throw new Error('Failed to send email');
  }
};

export const sendQuoteEmail = async (data: QuoteFormData): Promise<void> => {
  const message = `
=== DEMANDE DE DEVIS ===

Produits sélectionnés:
${data.products}

Quantité souhaitée: ${data.quantity || 'Non spécifiée'}

Description du besoin:
${data.description || 'Non spécifiée'}

Budget estimé: ${data.budget || 'Non spécifié'}

Délai souhaité: ${data.deadline || 'Non spécifié'}

========================
  `.trim();

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      from_name: data.name,
      from_email: data.email,
      phone: data.phone || 'Non renseigné',
      company: data.company || 'Non renseigné',
      message: message,
      subject: 'Demande de devis - SICAF',
      to_name: 'SICAF',
      to_email: 'sicaf@chimistry.com',
      reply_to: data.email,
    });
  } catch (error) {
    console.error('EmailJS Error:', error);
    throw new Error('Failed to send email');
  }
};

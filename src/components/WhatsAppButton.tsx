import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface WhatsAppButtonProps {
  variant?: 'floating' | 'inline' | 'hero';
  className?: string;
  customMessage?: string;
}

const WHATSAPP_NUMBER = '237651254307';

const WhatsAppButton = ({ variant = 'floating', className = '', customMessage }: WhatsAppButtonProps) => {
  const { language } = useLanguage();
  
  const defaultMessage = language === 'fr' 
    ? 'Bonjour, je souhaite avoir des informations sur vos produits chimiques.'
    : 'Hello, I would like to get information about your chemical products.';
  
  const message = customMessage || defaultMessage;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  
  const buttonText = language === 'fr' ? 'Discuter sur WhatsApp' : 'Chat on WhatsApp';

  if (variant === 'floating') {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group ${className}`}
        aria-label={buttonText}
      >
        <MessageCircle className="h-6 w-6 fill-white" />
        <span className="hidden md:inline font-medium">{buttonText}</span>
      </a>
    );
  }

  if (variant === 'hero') {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 ${className}`}
      >
        <MessageCircle className="h-5 w-5 fill-white" />
        {buttonText}
      </a>
    );
  }

  // inline variant
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${className}`}
    >
      <MessageCircle className="h-5 w-5 fill-white" />
      {buttonText}
    </a>
  );
};

export const getWhatsAppUrl = (message: string) => {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

export default WhatsAppButton;

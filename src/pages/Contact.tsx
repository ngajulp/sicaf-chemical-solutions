import { useState } from 'react';
import { MapPin, Phone, Mail, Globe, Send, CheckCircle, MessageCircle, Building2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { sendContactEmail } from '@/lib/emailjs';
import WhatsAppButton from '@/components/WhatsAppButton';

const WatermarkOverlay: React.FC<{
  image: string;
  opacity?: number;
  size?: string | number;
  variant?: 'light' | 'dark'; 
  zIndex?: number;
  repeat?: 'repeat' | 'no-repeat';
}> = ({ image, opacity = 0.2, size = 'cover', variant = 'dark', zIndex = 0, repeat = 'no-repeat' }) => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `url(${image})`,
      backgroundRepeat: repeat,
      backgroundSize: typeof size === 'number' ? `${size}px` : size,
      opacity,
      zIndex,
      filter: variant === 'light' ? 'brightness(0) invert(1) contrast(1.5)' : 'grayscale(100%) contrast(1.3)',
    } as React.CSSProperties}
  />
);

const Contact = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const LOGO_URL = "https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/sicaf.png";
  const IMG_LAB = "https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/labochimie.png";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await sendContactEmail(formData);
      setIsSubmitted(true);
      toast({ title: t('contact.success') });
    } catch (error) {
      toast({ title: "Erreur", variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: MapPin, label: t('contact.address'), values: ['BP : 13135, Akwa', 'Douala, Cameroun'] },
    { icon: Phone, label: 'Téléphone', values: ['+237 691 83 70 39'], href: 'tel:+237691837039' },
    { icon: Mail, label: 'Email', values: ['sicaf@chimistry.com'], href: 'mailto:sicaf@chimistry.com' },
    { icon: Globe, label: 'Website', values: ['www.sicaf-chemical.com'], href: '#' }
  ];

  return (
    <Layout>
      <WhatsAppButton variant="floating" />

      {/* 1. HERO SECTION */}
      <section className="relative py-24 md:py-32 text-white overflow-hidden bg-slate-900 border-t-8 border-accent">
        <WatermarkOverlay image={IMG_LAB} variant="dark" opacity={0.4} zIndex={0} />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl border-l-4 border-accent pl-8 md:pl-12">
            <h1 className="text-5xl md:text-7xl font-black mb-4 uppercase tracking-tighter italic">
              {t('contact.title')}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-bold uppercase italic bg-slate-800/50 inline-block p-2">
              {t('contact.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* 2. FORM & INFO SECTION */}
      <section className="py-20 bg-white border-t-8 border-accent border-b-8 border-accent">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
            
            {/* Formulaire Brutaliste */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 border-t-4 border-l-4 border-accent z-0" />
              <div className="relative z-10 bg-slate-50 border-4 border-slate-900 p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(251,146,60,1)]">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-20 w-20 text-accent mx-auto mb-6" />
                    <h3 className="text-3xl font-black text-slate-900 uppercase mb-4 italic">{t('contact.success')}</h3>
                    <div className="bg-white border-2 border-slate-900 p-6 mb-8">
                       <WhatsAppButton variant="inline" />
                    </div>
                    <Button onClick={() => setIsSubmitted(false)} className="rounded-none bg-slate-900 text-white px-8 h-14 font-black uppercase">
                      Nouveau Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="font-black uppercase text-xs tracking-widest text-slate-500">{t('contact.name')} *</Label>
                        <Input name="name" value={formData.name} onChange={handleChange} required className="rounded-none border-2 border-slate-200 focus:border-accent h-14 font-bold text-lg" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-black uppercase text-xs tracking-widest text-slate-500">{t('contact.email')} *</Label>
                        <Input name="email" type="email" value={formData.email} onChange={handleChange} required className="rounded-none border-2 border-slate-200 focus:border-accent h-14 font-bold text-lg" />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="font-black uppercase text-xs tracking-widest text-slate-500">{t('contact.phone')}</Label>
                        <Input name="phone" value={formData.phone} onChange={handleChange} className="rounded-none border-2 border-slate-200 focus:border-accent h-14 font-bold text-lg" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-black uppercase text-xs tracking-widest text-slate-500">{t('contact.company')}</Label>
                        <Input name="company" value={formData.company} onChange={handleChange} className="rounded-none border-2 border-slate-200 focus:border-accent h-14 font-bold text-lg" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-black uppercase text-xs tracking-widest text-slate-500">{t('contact.message')} *</Label>
                      <Textarea name="message" rows={6} value={formData.message} onChange={handleChange} required className="rounded-none border-2 border-slate-200 focus:border-accent font-bold text-lg" />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full h-16 rounded-none bg-slate-900 hover:bg-accent text-white font-black uppercase tracking-[0.2em] text-xl transition-all">
                      {isSubmitting ? "ENVOI..." : t('contact.send')}
                    </Button>
                  </form>
                )}
              </div>
            </div>

            {/* Informations & Map */}
            <div className="flex flex-col justify-center">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic mb-12 border-l-8 border-accent pl-6">
                {t('contact.info_title')}
              </h2>

              <div className="grid sm:grid-cols-2 gap-10 mb-12">
                {contactInfo.map((info, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 bg-slate-900 text-accent flex items-center justify-center">
                        <info.icon size={20} />
                      </div>
                      <span className="font-black uppercase text-xs tracking-widest text-slate-400">{info.label}</span>
                    </div>
                    {info.values.map((v, i) => (
                      <p key={i} className="text-xl font-bold text-slate-800 leading-tight">{v}</p>
                    ))}
                  </div>
                ))}
              </div>

              {/* Map/Location Visual */}
              <div className="relative border-4 border-slate-900 h-64 overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                <WatermarkOverlay image={LOGO_URL} opacity={0.1} size={100} repeat="repeat" />
                <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center p-8 text-center">
                  <MapPin className="text-accent h-12 w-12 mb-4 animate-bounce" />
                  <p className="text-2xl font-black text-slate-900 uppercase tracking-tighter">SICAF CHIMIE S.A.</p>
                  <p className="font-bold text-slate-500">Akwa, Douala - Cameroun</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;

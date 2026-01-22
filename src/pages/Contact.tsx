import { useState } from 'react';
import { MapPin, Phone, Mail, Globe, Send, CheckCircle, Factory, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { sendContactEmail } from '@/lib/emailjs';
import WhatsAppButton from '@/components/WhatsAppButton';

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
    { icon: Mail, label: 'Email', values: ['sicaf@chimistry.com'], href: 'mailto:sicaf@chimistry.com' }
  ];

  return (
    <Layout>
      <WhatsAppButton variant="floating" />

      {/* --- 1. HERO SECTION UNIFORMISÉE --- */}
      <section className="relative text-white min-h-[450px] md:h-[550px] flex items-center py-24 overflow-hidden bg-slate-900">
        <div 
          className="absolute inset-0 z-0 opacity-25 grayscale brightness-125 scale-105 pointer-events-none"
          style={{
            backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/labochimie.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent z-1" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 bg-primary/20 text-secondary px-4 py-2 border-l-4 border-secondary mb-8">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                {language === 'fr' ? 'Support & Devis Rapide' : 'Support & Quick Quote'}
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-8 uppercase italic tracking-tighter leading-[0.9] drop-shadow-2xl">
              Contact <br/>
              <span className="text-primary-foreground/40">Technique</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 font-medium italic border-l-4 border-primary pl-8 max-w-2xl leading-relaxed">
              {t('contact.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* --- 2. SECTION FORMULAIRE & INFOS --- */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Filigrane discret en fond de page */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-[0.03] pointer-events-none">
            <Factory className="w-full h-full" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 max-w-7xl mx-auto">
            
            {/* Colonne Gauche : Infos */}
            <div className="lg:col-span-5 space-y-12">
              <div>
                <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter mb-6">
                  {t('contact.info_title')}
                </h2>
                <div className="h-1.5 bg-primary w-20 mb-10"></div>
                
                <div className="space-y-8">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex gap-6 group">
                      <div className="flex-shrink-0 w-14 h-14 bg-slate-900 text-white flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                        <info.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">{info.label}</h3>
                        {info.values.map((v, i) => (
                          <p key={i} className="text-lg font-bold text-slate-700 leading-tight">{v}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box Localisation */}
              <div className="p-8 bg-slate-50 border-l-4 border-secondary">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Logistique & Siège</p>
                <p className="text-xl font-black italic text-slate-900 uppercase">Douala, Akwa</p>
                <p className="text-slate-500 font-medium italic">Zone Industrielle Portuaire</p>
              </div>
            </div>

            {/* Colonne Droite : Formulaire */}
            <div className="lg:col-span-7">
              <Card className="border-none shadow-[0_30px_60px_rgba(0,0,0,0.1)] rounded-none overflow-hidden">
                <div className="h-2 bg-primary w-full"></div>
                <CardContent className="p-8 md:p-12 bg-white">
                  {isSubmitted ? (
                    <div className="text-center py-12 animate-in fade-in zoom-in-95">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10" />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 uppercase italic mb-4">{t('contact.success')}</h3>
                      <p className="text-slate-500 font-bold mb-8 italic">{language === 'fr' ? 'Nos techniciens traitent votre demande.' : 'Our technicians are processing your request.'}</p>
                      <Button onClick={() => setIsSubmitted(false)} variant="outline" className="rounded-none border-slate-900 font-black uppercase tracking-widest">Nouveau message</Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('contact.name')} *</Label>
                          <Input name="name" onChange={handleChange} required className="rounded-none border-slate-200 focus:border-primary h-14 bg-slate-50/50" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('contact.email')} *</Label>
                          <Input type="email" name="email" onChange={handleChange} required className="rounded-none border-slate-200 focus:border-primary h-14 bg-slate-50/50" />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Entreprise</Label>
                          <Input name="company" onChange={handleChange} className="rounded-none border-slate-200 focus:border-primary h-14 bg-slate-50/50" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Téléphone</Label>
                          <Input type="tel" name="phone" onChange={handleChange} className="rounded-none border-slate-200 focus:border-primary h-14 bg-slate-50/50" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Message technique *</Label>
                        <Textarea name="message" rows={5} onChange={handleChange} required className="rounded-none border-slate-200 focus:border-primary bg-slate-50/50" />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full h-16 bg-slate-900 hover:bg-primary text-white font-black uppercase tracking-[0.3em] italic rounded-none transition-all duration-300 shadow-xl"
                      >
                        {isSubmitting ? "ENVOI EN COURS..." : "ENVOYER LA DEMANDE"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;

import { useState } from 'react';
import { MapPin, Phone, Mail, Globe, Send, CheckCircle, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { sendContactEmail } from '@/lib/emailjs';
import WhatsAppButton, { getWhatsAppUrl } from '@/components/WhatsAppButton';

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
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await sendContactEmail(formData);
      setIsSubmitted(true);
      toast({
        title: t('contact.success'),
        description: language === 'fr' 
          ? 'Nous vous répondrons dans les plus brefs délais.'
          : 'We will respond to you as soon as possible.',
      });
    } catch (error) {
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: language === 'fr' 
          ? 'Une erreur est survenue. Veuillez réessayer.'
          : 'An error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: t('contact.address'),
      values: ['BP : 13135, Akwa', 'Siège Social : Douala, Cameroun']
    },
    {
      icon: Phone,
      label: language === 'fr' ? 'Téléphone' : 'Phone',
      values: ['+237 691 83 70 39'],
      href: 'tel:+237651254307'
    },
    {
      icon: Mail,
      label: 'Email',
      values: ['sicaf@chimistry.com'],
      href: 'mailto:sicaf@chimistry.com'
    },
    {
      icon: Globe,
      label: language === 'fr' ? 'Site Web' : 'Website',
      values: ['www.sicaf-chemical.com'],
      href: 'https://www.sicaf-chemical.com'
    }
  ];

  return (
    <Layout>
      {/* Floating WhatsApp Button */}
      <WhatsAppButton variant="floating" />

      {/* Hero avec Filigrane Labo */}
      <section className="gradient-hero text-primary-foreground py-20 md:py-32 relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-20 pointer-events-none grayscale"
          style={{
            backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/labochimie.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4 uppercase tracking-tighter">
            {t('contact.title')}
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto font-medium italic">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      {/* Section Formulaire et Infos avec Filigrane Industrie */}
      <section className="py-16 md:py-28 bg-background relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none grayscale"
          style={{
            backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/industriechimie.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'top', // Assure la visibilité du haut vers le bas
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
            
            {/* Colonne Formulaire */}
            <div className="order-2 lg:order-1">
              <Card className="shadow-2xl border-none bg-white/85 backdrop-blur-md">
                <CardContent className="p-8 md:p-12">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
                      <h3 className="font-heading text-3xl font-black text-foreground mb-4 uppercase italic">
                        {t('contact.success')}
                      </h3>
                      <p className="text-slate-600 font-bold text-lg mb-8">
                        {language === 'fr' 
                          ? 'Nous vous répondrons dans les plus brefs délais.'
                          : 'We will respond to you as soon as possible.'}
                      </p>
                      
                      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
                        <p className="text-green-800 font-black uppercase tracking-tight mb-4">
                          {language === 'fr' 
                            ? '💬 Réponse prioritaire via WhatsApp'
                            : '💬 Priority response via WhatsApp'}
                        </p>
                        <WhatsAppButton variant="inline" />
                      </div>

                      <Button 
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({ name: '', email: '', phone: '', company: '', message: '' });
                        }} 
                        variant="outline"
                        className="border-primary text-primary font-black uppercase tracking-widest"
                      >
                        {language === 'fr' ? 'Nouveau message' : 'New message'}
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="font-black uppercase tracking-widest text-xs text-primary">{t('contact.name')} *</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={formData.name}
                            onChange={handleChange}
                            className="bg-white/50 border-primary/20 focus:border-primary h-12"
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="font-black uppercase tracking-widest text-xs text-primary">{t('contact.email')} *</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={formData.email}
                            onChange={handleChange}
                            className="bg-white/50 border-primary/20 focus:border-primary h-12"
                            required 
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="font-black uppercase tracking-widest text-xs text-primary">{t('contact.phone')}</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            className="bg-white/50 border-primary/20 focus:border-primary h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company" className="font-black uppercase tracking-widest text-xs text-primary">{t('contact.company')}</Label>
                          <Input 
                            id="company" 
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="bg-white/50 border-primary/20 focus:border-primary h-12"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="font-black uppercase tracking-widest text-xs text-primary">{t('contact.message')} *</Label>
                        <Textarea 
                          id="message" 
                          name="message" 
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          className="bg-white/50 border-primary/20 focus:border-primary"
                          required 
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full font-black uppercase tracking-[0.2em] italic" 
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <span className="animate-spin text-xl">⏳</span>
                            {language === 'fr' ? 'Traitement...' : 'Processing...'}
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Send className="h-5 w-5" />
                            {t('contact.send')}
                          </span>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Colonne Infos de Contact */}
            <div className="order-1 lg:order-2">
              <h2 className="font-heading text-3xl md:text-4xl font-black text-foreground mb-10 uppercase italic tracking-tighter">
                {t('contact.info_title')}
              </h2>

              <div className="grid gap-8">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-center gap-6 group">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <info.icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black uppercase tracking-widest text-xs text-primary mb-1">{info.label}</h3>
                      {info.values.map((value, vIndex) => (
                        info.href ? (
                          <a 
                            key={vIndex}
                            href={info.href}
                            className="block text-slate-800 font-bold text-lg hover:text-primary transition-colors"
                            target={info.href.startsWith('http') ? '_blank' : undefined}
                            rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            {value}
                          </a>
                        ) : (
                          <p key={vIndex} className="text-slate-800 font-bold text-lg">{value}</p>
                        )
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map/Localisation Visuelle */}
              <div className="mt-12 rounded-2xl overflow-hidden shadow-2xl border-4 border-white relative group">
                <div className="bg-primary/5 h-72 flex items-center justify-center relative overflow-hidden">
                   {/* Effet visuel de grille pour le côté industriel */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                  
                  <div className="text-center relative z-10">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                       <MapPin className="h-8 w-8 text-primary animate-bounce" />
                    </div>
                    <p className="text-xl font-black text-foreground uppercase tracking-tight">Douala, Cameroun</p>
                    <p className="text-primary font-bold">Akwa - BP 13135</p>
                    <Button variant="link" className="mt-2 text-primary hover:text-primary/80 font-bold uppercase text-xs tracking-widest">
                       {language === 'fr' ? 'Ouvrir dans Google Maps' : 'Open in Google Maps'}
                    </Button>
                  </div>
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

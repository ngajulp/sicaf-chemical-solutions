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
      href: 'tel:+237691837039'
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

      {/* Hero */}
      <section className="gradient-hero text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div>
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                        {t('contact.success')}
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {language === 'fr' 
                          ? 'Nous vous répondrons dans les plus brefs délais.'
                          : 'We will respond to you as soon as possible.'}
                      </p>
                      
                      {/* WhatsApp CTA after submission */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-green-800 mb-3">
                          {language === 'fr' 
                            ? '💬 Pour une réponse plus rapide, contactez-nous sur WhatsApp !'
                            : '💬 For a faster response, contact us on WhatsApp!'}
                        </p>
                        <WhatsAppButton variant="inline" />
                      </div>

                      <Button 
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({ name: '', email: '', phone: '', company: '', message: '' });
                        }} 
                        variant="outline"
                      >
                        {language === 'fr' ? 'Envoyer un autre message' : 'Send another message'}
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t('contact.name')} *</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={formData.name}
                            onChange={handleChange}
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">{t('contact.email')} *</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={formData.email}
                            onChange={handleChange}
                            required 
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">{t('contact.phone')}</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">{t('contact.company')}</Label>
                          <Input 
                            id="company" 
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">{t('contact.message')} *</Label>
                        <Textarea 
                          id="message" 
                          name="message" 
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          required 
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full font-semibold" 
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <span className="animate-spin">⏳</span>
                            {language === 'fr' ? 'Envoi en cours...' : 'Sending...'}
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

            {/* Contact Info */}
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-8">
                {t('contact.info_title')}
              </h2>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{info.label}</h3>
                      {info.values.map((value, vIndex) => (
                        info.href ? (
                          <a 
                            key={vIndex}
                            href={info.href}
                            className="block text-muted-foreground hover:text-primary transition-colors"
                            target={info.href.startsWith('http') ? '_blank' : undefined}
                            rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            {value}
                          </a>
                        ) : (
                          <p key={vIndex} className="text-muted-foreground">{value}</p>
                        )
                      ))}
                    </div>
                  </div>
                ))}

                {/* WhatsApp Contact */}
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-[#25D366]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">WhatsApp</h3>
                    <p className="text-muted-foreground mb-2">
                      {language === 'fr' ? 'Réponse rapide garantie' : 'Fast response guaranteed'}
                    </p>
                    <WhatsAppButton variant="inline" />
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mt-10 rounded-lg overflow-hidden shadow-lg">
                <div className="bg-muted h-64 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="text-muted-foreground font-medium">Douala, Cameroun</p>
                    <p className="text-sm text-muted-foreground">Akwa - BP 13135</p>
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

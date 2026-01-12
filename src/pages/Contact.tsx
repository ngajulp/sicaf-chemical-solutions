import { useState } from 'react';
import { MapPin, Phone, Mail, Globe, Send, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast({
      title: t('contact.success'),
      description: language === 'fr' 
        ? 'Nous vous répondrons dans les plus brefs délais.'
        : 'We will respond to you as soon as possible.',
    });
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
                      <p className="text-muted-foreground">
                        {language === 'fr' 
                          ? 'Nous vous répondrons dans les plus brefs délais.'
                          : 'We will respond to you as soon as possible.'}
                      </p>
                      <Button 
                        onClick={() => setIsSubmitted(false)} 
                        className="mt-6"
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
                          <Input id="name" name="name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">{t('contact.email')} *</Label>
                          <Input id="email" name="email" type="email" required />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">{t('contact.phone')}</Label>
                          <Input id="phone" name="phone" type="tel" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">{t('contact.company')}</Label>
                          <Input id="company" name="company" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">{t('contact.message')} *</Label>
                        <Textarea 
                          id="message" 
                          name="message" 
                          rows={5} 
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

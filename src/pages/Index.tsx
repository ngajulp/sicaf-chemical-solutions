import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Users, Truck, ChevronRight, Loader2, FlaskConical } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WhatsAppButton from '@/components/WhatsAppButton';

// Composant Watermark avec option de flou (blur)
const WatermarkOverlay: React.FC<{
  image: string;
  opacity?: number;
  size?: number;
  rotation?: number;
  animate?: boolean;
  variant?: 'light' | 'dark'; 
  blur?: number; // Nouveau paramètre pour la profondeur
}> = ({ image, opacity = 0.08, size = 150, rotation = -15, animate = true, variant = 'dark', blur = 0 }) => (
  <div
    className={`absolute inset-0 pointer-events-none z-0 ${animate ? 'animate-watermark' : ''}`}
    style={{
      backgroundImage: `url(${image})`,
      backgroundRepeat: 'repeat',
      backgroundSize: `${size}px`,
      backgroundPosition: 'center',
      opacity,
      // Combinaison du filtre de couleur et du flou
      filter: `${variant === 'light' ? 'brightness(0) invert(1)' : 'grayscale(100%)'} blur(${blur}px)`,
      mixBlendMode: variant === 'dark' ? 'multiply' : 'screen', 
      '--rotation': `${rotation}deg`,
    } as React.CSSProperties}
  />
);

export default function Index() {
  const { language, t } = useLanguage();
  const { categories, loading } = useGitHubProducts();

  const LOGO_URL = "https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/sicaf.png";

  const features = [
    { icon: Shield, titleKey: 'home.quality', descKey: 'home.quality_desc' },
    { icon: Award, titleKey: 'home.expertise', descKey: 'home.expertise_desc' },
    { icon: Users, titleKey: 'home.service', descKey: 'home.service_desc' },
    { icon: Truck, titleKey: 'home.delivery', descKey: 'home.delivery_desc' },
  ];

  return (
    <Layout>
      <WhatsAppButton variant="floating" />

      {/* ======================= HERO ======================= */}
      <section className="relative py-24 md:py-32 text-white overflow-hidden bg-slate-900">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1581093588401-22d07cddf79b?auto=format&fit=crop&w=1600&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-slate-900/85" />
        
        {/* Motif Hero : Très dense, léger flou pour la profondeur */}
        <WatermarkOverlay 
          image={LOGO_URL} 
          variant="light" 
          opacity={0.15} 
          rotation={-15} 
          size={120} 
          blur={1.5} // Flou subtil pour détacher le texte
        />

        <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl font-extrabold mb-6 leading-tight uppercase tracking-tighter">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-slate-200/90 mb-10 font-light max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/catalog" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-slate-900 w-full px-10 h-14 text-lg">
                {t('hero.cta')}
              </Button>
            </Link>
            <Link to="/quote" className="w-full sm:w-auto">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold w-full px-10 h-14 text-lg">
                {t('nav.quote')}
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ======================= PRODUCT CATEGORIES ======================= */}
      <section className="relative py-24 overflow-hidden bg-slate-50">
        <WatermarkOverlay image={LOGO_URL} variant="dark" opacity={0.06} size={200} rotation={10} blur={0.5} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">{t('home.products_title')}</h2>
            <div className="h-1.5 bg-primary w-24 mx-auto rounded-full"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-6">
              {t('home.products_subtitle')}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link key={category.id} to={`/products/${category.id}`}>
                  <Card className="group h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/95 border-none">
                    <CardContent className="p-8">
                      <div className="flex flex-col gap-5 text-center items-center">
                        <div className="text-4xl w-20 h-20 flex items-center justify-center bg-primary/5 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                          {category.icon || <FlaskConical />}
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-xl text-slate-900 mb-3 uppercase tracking-wide">
                            {category.name[language]}
                          </h3>
                          <p className="text-slate-600 leading-relaxed">
                            {category.description[language]}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ======================= WHY CHOOSE US ======================= */}
      <section className="relative py-24 overflow-hidden bg-white">
        <WatermarkOverlay image={LOGO_URL} variant="dark" opacity={0.04} size={300} rotation={-10} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">{t('home.why_title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('home.why_subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-8 rounded-3xl bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all duration-300 text-center border border-slate-100">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white text-primary mb-6 shadow-sm">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-3 text-slate-900">{t(feature.titleKey)}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{t(feature.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= CTA ======================= */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-primary to-slate-900 text-white overflow-hidden">
        {/* Motif CTA : Très petit logo, flou artistique pour effet "Premium" */}
        <WatermarkOverlay 
          image={LOGO_URL} 
          variant="light" 
          opacity={0.12} 
          size={100} 
          rotation={25} 
          blur={2} // Un peu plus de flou ici pour l'aspect "vaporeux"
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter uppercase italic">
            {language === 'fr' ? "Prêt à démarrer ?" : 'Ready to start?'}
          </h2>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto font-light">
            {language === 'fr'
              ? "Demandez votre devis gratuit aujourd'hui et recevez une réponse sous 24h."
              : 'Request your free quote today and get a response within 24 hours.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/quote">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-black px-12 h-16 text-xl shadow-2xl uppercase tracking-widest">
                {t('nav.quote')}
              </Button>
            </Link>
            <WhatsAppButton variant="hero" />
          </div>
        </div>
      </section>

      <style>
        {`
          @keyframes watermarkMove {
            0% { transform: translate(0, 0) rotate(var(--rotation)); }
            50% { transform: translate(-20px, -15px) rotate(calc(var(--rotation) + 1deg)); }
            100% { transform: translate(0, 0) rotate(var(--rotation)); }
          }
          .animate-watermark {
            animation: watermarkMove 35s ease-in-out infinite;
            will-change: transform, filter;
          }
        `}
      </style>
    </Layout>
  );
}

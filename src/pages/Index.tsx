import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Users, Truck, ChevronRight, Loader2, FlaskConical } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WhatsAppButton from '@/components/WhatsAppButton';

// Composant Watermark flexible
const WatermarkOverlay: React.FC<{
  image: string;
  opacity?: number;
  size?: number;
  rotation?: number;
  animate?: boolean;
  variant?: 'light' | 'dark'; // 'light' pour fond sombre, 'dark' pour fond clair
}> = ({ image, opacity = 0.08, size = 350, rotation = -10, animate = true, variant = 'dark' }) => (
  <div
    className={`absolute inset-0 pointer-events-none z-0 ${animate ? 'animate-watermark' : ''}`}
    style={{
      backgroundImage: `url(${image})`,
      backgroundRepeat: 'repeat',
      backgroundSize: `${size}px`,
      backgroundPosition: 'center',
      opacity,
      // On ajuste le filtre selon le fond pour garantir la visibilité
      filter: variant === 'light' ? 'brightness(0) invert(1)' : 'grayscale(100%)',
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

      {/* ======================= HERO (RESTAURÉ) ======================= */}
      <section className="relative py-24 md:py-32 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1581093588401-22d07cddf79b?auto=format&fit=crop&w=1600&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-slate-900/75" />
        
        {/* Filigrane version 'light' pour ressortir sur le bleu sombre */}
        <WatermarkOverlay 
          image={LOGO_URL} 
          variant="light" 
          opacity={0.15} 
          rotation={-10} 
          size={400} 
        />

        <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-slate-200/90 mb-8">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <Link to="/catalog">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900 w-full sm:w-auto">
                {t('hero.cta')}
              </Button>
            </Link>
            <Link to="/quote">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold w-full sm:w-auto">
                {t('nav.quote')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ======================= PRODUCT CATEGORIES (FILIGRANE VISIBLE) ======================= */}
      <section className="relative py-20 overflow-hidden bg-slate-50">
        <WatermarkOverlay 
          image={LOGO_URL} 
          variant="dark" 
          opacity={0.07} 
          size={250} 
          rotation={15} 
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">{t('home.products_title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.products_subtitle')}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link key={category.id} to={`/products/${category.id}`}>
                  <Card className="group h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl p-3 bg-primary/10 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                          {category.icon || <FlaskConical />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                            {category.name[language]}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
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
      <section className="relative py-20 overflow-hidden bg-white">
        <WatermarkOverlay 
          image={LOGO_URL} 
          variant="dark" 
          opacity={0.05} 
          size={300} 
          rotation={-15} 
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.why_title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('home.why_subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-none shadow-md bg-slate-50/50">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{t(feature.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground">{t(feature.descKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= CTA (RESTAURÉ) ======================= */}
      <section className="relative py-20 bg-gradient-to-r from-primary to-slate-800 text-white overflow-hidden">
        {/* Filigrane version 'light' pour le dégradé sombre */}
        <WatermarkOverlay 
          image={LOGO_URL} 
          variant="light" 
          opacity={0.12} 
          size={250} 
          rotation={5} 
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === 'fr' ? "Besoin d'un devis personnalisé ?" : 'Need a custom quote?'}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {language === 'fr'
              ? "Notre équipe d'experts est prête à vous accompagner dans vos projets"
              : 'Our team of experts is ready to assist you with your projects'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quote">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold w-full sm:w-auto">
                {t('nav.quote')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-slate-900 w-full sm:w-auto">
                {t('nav.contact')}
              </Button>
            </Link>
          </div>
          <div className="pt-8">
            <WhatsAppButton variant="hero" />
          </div>
        </div>
      </section>

      <style>
        {`
          @keyframes watermarkMove {
            0% { transform: translate(0, 0) rotate(var(--rotation)); }
            50% { transform: translate(-10px, -15px) rotate(calc(var(--rotation) + 2deg)); }
            100% { transform: translate(0, 0) rotate(var(--rotation)); }
          }
          .animate-watermark {
            animation: watermarkMove 25s ease-in-out infinite;
          }
        `}
      </style>
    </Layout>
  );
}

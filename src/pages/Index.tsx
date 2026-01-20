import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Users, Truck, ChevronRight, Loader2, FlaskConical } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WhatsAppButton from '@/components/WhatsAppButton';

// Composant Watermark optimisé
const WatermarkOverlay: React.FC<{
  image: string;
  opacity?: number;
  size?: number;
  rotation?: number;
  animate?: boolean;
}> = ({ image, opacity = 0.05, size = 280, rotation = -15, animate = true }) => (
  <div
    className={`absolute inset-0 pointer-events-none z-0 ${animate ? 'animate-watermark' : ''}`}
    style={{
      backgroundImage: `url(${image})`,
      backgroundRepeat: 'repeat',
      backgroundSize: `${size}px`,
      backgroundPosition: 'center',
      opacity: opacity,
      mixBlendMode: 'multiply', // Crucial pour la visibilité sur fond clair
      filter: 'grayscale(100%) brightness(1.1)',
      '--rotation': `${rotation}deg`,
    } as React.CSSProperties}
  />
);

export default function Index() {
  const { language, t } = useLanguage();
  const { categories, loading } = useGitHubProducts();

  const features = [
    { icon: Shield, titleKey: 'home.quality', descKey: 'home.quality_desc' },
    { icon: Award, titleKey: 'home.expertise', descKey: 'home.expertise_desc' },
    { icon: Users, titleKey: 'home.service', descKey: 'home.service_desc' },
    { icon: Truck, titleKey: 'home.delivery', descKey: 'home.delivery_desc' },
  ];

  const LOGO_URL = "https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/sicaf.png";

  return (
    <Layout>
      <WhatsAppButton variant="floating" />

      {/* ======================= HERO ======================= */}
      <section className="relative py-24 md:py-32 text-white overflow-hidden bg-slate-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1581093588401-22d07cddf79b?auto=format&fit=crop&w=1600&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900/80" />
        
        {/* Filigrane Hero - Opacité plus forte sur fond sombre */}
        <WatermarkOverlay image={LOGO_URL} opacity={0.08} size={350} rotation={-10} />

        <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-slate-200/90 mb-8">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
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

      {/* ======================= PRODUCT CATEGORIES ======================= */}
      <section className="relative py-24 overflow-hidden bg-slate-50"> {/* Fond légèrement grisé pour contraste */}
        {/* Motif Filigrane Logo */}
        <WatermarkOverlay image={LOGO_URL} opacity={0.06} size={220} rotation={15} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">{t('home.products_title')}</h2>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
                  <Card className="group h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-none bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-8">
                      <div className="flex flex-col gap-5">
                        <div className="w-16 h-16 flex items-center justify-center text-3xl bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          {category.icon || <FlaskConical />}
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-xl text-slate-900 mb-3 group-hover:text-primary transition-colors">
                            {category.name[language]}
                          </h3>
                          <p className="text-slate-600 leading-relaxed mb-4">
                            {category.description[language]}
                          </p>
                          <div className="flex items-center text-primary font-bold text-sm uppercase tracking-wider">
                            {t('common.view_products')}
                            <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </div>
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
        {/* Filigrane inversé pour varier le design */}
        <WatermarkOverlay image={LOGO_URL} opacity={0.05} size={300} rotation={-20} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">{t('home.why_title')}</h2>
            <div className="h-1.5 w-24 bg-accent mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('home.why_subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="relative p-8 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white text-primary shadow-inner mb-6">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="font-heading font-bold text-lg text-slate-900 mb-3">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">{t(feature.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= CTA ======================= */}
      <section className="relative py-24 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20" />
        <WatermarkOverlay image={LOGO_URL} opacity={0.1} size={250} rotation={5} />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 italic">
            {language === 'fr' ? "Besoin d'un devis personnalisé ?" : 'Need a custom quote?'}
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            {language === 'fr'
              ? "Notre équipe d'experts est prête à vous accompagner dans vos projets"
              : 'Our team of experts is ready to assist you with your projects'}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/quote">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-10 h-14 text-lg font-bold">
                {t('nav.quote')}
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-slate-900 px-10 h-14 text-lg">
                {t('nav.contact')}
              </Button>
            </Link>
          </div>
          <div className="mt-12">
            <WhatsAppButton variant="hero" />
          </div>
        </div>
      </section>

      {/* ======================= ANIMATION CSS ======================= */}
      <style>
        {`
          @keyframes watermarkMove {
            0% { transform: translate(0, 0) rotate(var(--rotation)); }
            50% { transform: translate(-15px, -20px) rotate(calc(var(--rotation) + 2deg)); }
            100% { transform: translate(0, 0) rotate(var(--rotation)); }
          }
          .animate-watermark {
            animation: watermarkMove 25s ease-in-out infinite;
            will-change: transform;
          }
        `}
      </style>
    </Layout>
  );
}

import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Users, Truck, ChevronRight, Loader2, FlaskConical, Beaker, Microscope, TestTube2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WhatsAppButton from '@/components/WhatsAppButton';

// Composant Watermark polyvalent
const WatermarkOverlay: React.FC<{
  image: string;
  opacity?: number;
  size?: number;
  rotation?: number;
  animate?: boolean;
  variant?: 'light' | 'dark'; 
  blur?: number;
  zIndex?: number;
  repeat?: 'repeat' | 'no-repeat';
  position?: string;
}> = ({ image, opacity = 0.08, size = 150, rotation = -15, animate = true, variant = 'dark', blur = 0, zIndex = 0, repeat = 'repeat', position = 'center' }) => (
  <div
    className={`absolute inset-0 pointer-events-none ${animate ? 'animate-watermark' : ''}`}
    style={{
      backgroundImage: `url(${image})`,
      backgroundRepeat: repeat,
      backgroundSize: repeat === 'repeat' ? `${size}px` : size,
      backgroundPosition: position,
      opacity,
      zIndex,
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
  
  // URLs d'images corporate gratuites (Unsplash) - Style Laboratoire/Science
  const IMG_LAB = "https://images.unsplash.com/photo-1532187875460-12d0c2cf36e5?auto=format&fit=crop&w=800&q=80"; // Verrerie Labo
  const IMG_MOLECULE = "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=800&q=80"; // Recherche
  const IMG_CHEMICALS = "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?auto=format&fit=crop&w=800&q=80"; // R&D Industriel

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
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1581093588401-22d07cddf79b?auto=format&fit=crop&w=1600&q=80)' }}
        />
        <div className="absolute inset-0 bg-slate-900/85" />
        
        {/* COUCHE 1 : Motif Logo (Corporate Pattern) */}
        <WatermarkOverlay image={LOGO_URL} variant="light" opacity={0.1} rotation={-15} size={120} zIndex={1} />
        
        {/* COUCHE 2 : Filigrane Scientifique (Laboratoire) */}
        <WatermarkOverlay 
          image={IMG_LAB} 
          variant="light" 
          opacity={0.05} 
          size={600} 
          rotation={0} 
          blur={2} 
          zIndex={2}
          animate={false}
        />

        <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-md">
            <Microscope className="h-4 w-4 text-accent" />
            <span className="text-xs font-bold uppercase tracking-widest">{language === 'fr' ? 'Solutions Chimiques de Pointe' : 'Advanced Chemical Solutions'}</span>
          </div>
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
        {/* COUCHE 1 : Logo */}
        <WatermarkOverlay image={LOGO_URL} variant="dark" opacity={0.05} size={180} rotation={10} zIndex={1} />
        
        {/* COUCHE 2 : Iconographie Matériaux Chimiques */}
        <WatermarkOverlay 
          image={IMG_CHEMICALS} 
          variant="dark" 
          opacity={0.03} 
          size={700} 
          rotation={-5} 
          blur={1} 
          zIndex={2}
          animate={false}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">{t('home.products_title')}</h2>
            <div className="h-1.5 bg-primary w-24 mx-auto rounded-full"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-6 italic">
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
                  <Card className="group h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/95 border-none border-l-4 border-l-primary/10 hover:border-l-primary">
                    <CardContent className="p-8">
                      <div className="flex flex-col gap-5">
                        <div className="w-16 h-16 flex items-center justify-center bg-slate-900 text-white rounded-xl group-hover:bg-primary transition-all duration-500">
                          {category.icon || <Beaker className="h-8 w-8" />}
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-xl text-slate-900 mb-3 tracking-wide">
                            {category.name[language]}
                          </h3>
                          <p className="text-slate-600 leading-relaxed text-sm">
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
        <WatermarkOverlay image={LOGO_URL} variant="dark" opacity={0.04} size={250} rotation={-10} zIndex={1} />
        
        {/* Motif Moléculaire / Structure */}
        <WatermarkOverlay 
          image={IMG_MOLECULE} 
          variant="dark" 
          opacity={0.04} 
          size={500} 
          rotation={15} 
          blur={3} 
          zIndex={2}
          animate={true}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 uppercase tracking-tight">{t('home.why_title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('home.why_subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-900 hover:text-white transition-all duration-500 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary group-hover:bg-white group-hover:text-slate-900 mb-6 shadow-sm">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-3">{t(feature.titleKey)}</h3>
                <p className="text-sm opacity-80 leading-relaxed">{t(feature.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= CTA ======================= */}
      <section className="relative py-24 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-slate-900 to-accent/30" />
        
        {/* Double Filigrane : Logo dense + Iconographie Labo floutée */}
        <WatermarkOverlay image={LOGO_URL} variant="light" opacity={0.12} size={90} rotation={20} zIndex={1} />
        <WatermarkOverlay 
          image={IMG_LAB} 
          variant="light" 
          opacity={0.06} 
          size={800} 
          blur={4} 
          zIndex={2}
          position="right bottom"
          repeat="no-repeat"
          animate={false}
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="mb-8 flex justify-center gap-4">
             <TestTube2 className="h-10 w-10 text-accent opacity-50" />
             <Beaker className="h-10 w-10 text-primary opacity-50" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter uppercase italic">
            {language === 'fr' ? "Prêt à optimiser vos processus ?" : 'Ready to optimize your processes?'}
          </h2>
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
            50% { transform: translate(-15px, -10px) rotate(calc(var(--rotation) + 0.5deg)); }
            100% { transform: translate(0, 0) rotate(var(--rotation)); }
          }
          .animate-watermark {
            animation: watermarkMove 40s ease-in-out infinite;
            will-change: transform;
          }
        `}
      </style>
    </Layout>
  );
}

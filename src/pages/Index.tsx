import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Users, Truck, ChevronRight, Loader2, FlaskConical, Beaker, Microscope, TestTube2, Binary } from 'lucide-react';
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
  size?: string | number;
  rotation?: number;
  animate?: boolean;
  variant?: 'light' | 'dark'; 
  blur?: number;
  zIndex?: number;
  repeat?: 'repeat' | 'no-repeat';
  position?: string;
}> = ({ image, opacity = 0.08, size = 'cover', rotation = 0, animate = true, variant = 'dark', blur = 0, zIndex = 0, repeat = 'no-repeat', position = 'center' }) => (
  <div
    className={`absolute inset-0 pointer-events-none ${animate ? 'animate-watermark' : ''}`}
    style={{
      backgroundImage: `url(${image})`,
      backgroundRepeat: repeat,
      backgroundSize: typeof size === 'number' ? `${size}px` : size,
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
  
  const IMG_HERO_LAB = "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=2000&q=80";
  const IMG_PRODUCTS_CHEM = "https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?auto=format&fit=crop&w=2000&q=80";
  const IMG_WHY_MOLECULE = "https://images.unsplash.com/photo-1581093588401-22d07cddf79b?auto=format&fit=crop&w=2000&q=80";

  const features = [
    { icon: Shield, titleKey: 'home.quality', descKey: 'home.quality_desc' },
    { icon: Award, titleKey: 'home.expertise', descKey: 'home.expertise_desc' },
    { icon: Users, titleKey: 'home.service', descKey: 'home.service_desc' },
    { icon: Truck, titleKey: 'home.delivery', descKey: 'home.delivery_desc' },
  ];

  return (
    <Layout>
      <WhatsAppButton variant="floating" />

      {/* ======================= HERO (CORPORATE & REPETITION) ======================= */}
      <section className="relative py-40 md:py-64 text-white overflow-hidden bg-[#0A1A2F]">
        {/* Fragmentation de fond (Damier de labo discret) */}
        <div className="absolute inset-0 z-0 opacity-30" 
             style={{ backgroundImage: `url(${IMG_HERO_LAB})`, backgroundSize: '33.33% 50%', backgroundRepeat: 'repeat', filter: 'grayscale(100%) contrast(110%)' }} />
        
        {/* Overlay Progressif Multinational */}
        <div className="absolute inset-0 z-1 bg-gradient-to-r from-[#0A1A2F] via-[#0A1A2F]/80 to-transparent" />
        
        {/* FILIGRANE LOGO : Petit (60px) et répété comme un motif de sécurité */}
        <WatermarkOverlay image={LOGO_URL} variant="light" opacity={0.12} rotation={0} size={60} repeat='repeat' zIndex={2} />

        <div className="relative z-10 container mx-auto px-4 max-w-5xl">
          <div className="inline-flex items-center gap-3 px-4 py-1 border-l-4 border-accent bg-accent/10 mb-10 backdrop-blur-sm">
            <Binary className="h-4 w-4 text-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">{language === 'fr' ? 'Standard Chimique International' : 'International Chemical Standard'}</span>
          </div>
          <h1 className="font-heading text-6xl md:text-9xl font-black mb-8 leading-none uppercase tracking-tighter">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl font-light leading-relaxed border-l border-white/10 pl-8">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Link to="/catalog">
              <Button size="lg" variant="outline" className="rounded-none border-2 border-white text-white hover:bg-white hover:text-slate-900 px-12 h-16 text-lg font-bold uppercase tracking-widest">
                {t('hero.cta')}
              </Button>
            </Link>
            <Link to="/quote">
              <Button size="lg" className="rounded-none bg-accent text-accent-foreground hover:bg-accent/90 font-black px-12 h-16 text-lg uppercase tracking-widest shadow-2xl">
                {t('nav.quote')}
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ======================= PRODUCT CATEGORIES (PAS TOUCHE) ======================= */}
      <section className="relative py-32 overflow-hidden bg-slate-50">
        <WatermarkOverlay image={IMG_PRODUCTS_CHEM} variant="dark" opacity={0.08} size="120%" position="center top" repeat="no-repeat" zIndex={1} />
        <WatermarkOverlay image={LOGO_URL} variant="dark" opacity={0.04} size={180} rotation={10} repeat='repeat' zIndex={2} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-6 text-slate-900 uppercase tracking-tight">{t('home.products_title')}</h2>
            <div className="h-2 bg-primary w-32 mx-auto rounded-full mb-8"></div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto italic font-medium">{t('home.products_subtitle')}</p>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-24"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {categories.map((category) => (
                <Link key={category.id} to={`/products/${category.id}`}>
                  <Card className="group h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/90 backdrop-blur-md border-none ring-1 ring-slate-200/50 hover:ring-primary/50">
                    <CardContent className="p-10">
                      <div className="flex flex-col gap-6">
                        <div className="w-20 h-20 flex items-center justify-center bg-slate-900 text-white rounded-2xl group-hover:bg-primary transition-all duration-500 shadow-lg">{category.icon || <Beaker className="h-10 w-10" />}</div>
                        <div>
                          <h3 className="font-heading font-black text-2xl text-slate-900 mb-4 tracking-wide uppercase">{category.name[language]}</h3>
                          <p className="text-slate-600 leading-relaxed text-base font-medium">{category.description[language]}</p>
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

      {/* ======================= WHY CHOOSE US (PAS TOUCHE) ======================= */}
      <section className="relative py-32 overflow-hidden bg-white">
        <WatermarkOverlay image={IMG_WHY_MOLECULE} variant="dark" opacity={0.06} size="cover" position="center" repeat="no-repeat" zIndex={1} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 uppercase tracking-tight">{t('home.why_title')}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium">{t('home.why_subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-10 rounded-3xl bg-slate-50 border-2 border-slate-100 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-500 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border-2 border-primary/20 text-primary group-hover:bg-white group-hover:text-slate-900 mb-8 shadow-md"><feature.icon className="h-8 w-8" /></div>
                <h3 className="font-heading font-bold text-xl mb-4 uppercase tracking-wide">{t(feature.titleKey)}</h3>
                <p className="text-base opacity-90 leading-relaxed">{t(feature.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= CTA (CORPORATE & REPETITION) ======================= */}
      <section className="relative py-48 bg-[#0A1A2F] text-white overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url(${IMG_PRODUCTS_CHEM})`, filter: 'grayscale(100%)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A2F] via-[#0A1A2F]/90 to-primary/30" />
        
        {/* FILIGRANE LOGO : Petit (60px) et répété */}
        <WatermarkOverlay image={LOGO_URL} variant="light" opacity={0.1} rotation={0} size={60} repeat='repeat' zIndex={2} />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="mb-12 flex justify-center gap-12 opacity-30">
             <TestTube2 className="h-16 w-16" />
             <Beaker className="h-16 w-16" />
             <Factory className="h-16 w-16" />
          </div>
          <h2 className="text-5xl md:text-8xl font-black mb-16 tracking-tighter uppercase italic">
            {language === 'fr' ? "Propulser l'Industrie" : 'Powering Industry'}
          </h2>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Link to="/quote">
              <Button size="lg" className="rounded-none bg-white text-[#0A1A2F] hover:bg-accent hover:text-white font-black px-20 h-24 text-3xl shadow-2xl uppercase tracking-[0.2em] transition-all">
                {t('nav.quote')}
              </Button>
            </Link>
            <WhatsAppButton variant="hero" />
          </div>
          <div className="mt-20 text-[10px] font-bold text-slate-500 uppercase tracking-[1em] opacity-50">
            Sicaf Chemical Solutions • Global Operations • 2026
          </div>
        </div>
      </section>

      <style>
        {`
          @keyframes watermarkMove {
            0% { transform: translate(0, 0) rotate(var(--rotation)); }
            50% { transform: translate(-10px, -5px); }
            100% { transform: translate(0, 0) rotate(var(--rotation)); }
          }
          .animate-watermark {
            animation: watermarkMove 30s linear infinite;
          }
        `}
      </style>
    </Layout>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Shield, Award, Users, Truck, ChevronRight, 
  Loader2, FlaskConical, Beaker, Microscope, TestTube2, 
  Binary, Factory, Activity, Gauge, Globe
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WhatsAppButton from '@/components/WhatsAppButton';

// Composant Watermark optimisé pour la visibilité
const WatermarkOverlay: React.FC<{
  image: string;
  opacity?: number;
  size?: string | number;
  rotation?: number;
  animate?: boolean;
  variant?: 'light' | 'dark'; 
  zIndex?: number;
  repeat?: 'repeat' | 'no-repeat';
  position?: string;
}> = ({ image, opacity = 0.08, size = 'cover', rotation = 0, animate = true, variant = 'dark', zIndex = 0, repeat = 'no-repeat', position = 'center' }) => (
  <div
    className={`absolute inset-0 pointer-events-none ${animate ? 'animate-watermark' : ''}`}
    style={{
      backgroundImage: `url(${image})`,
      backgroundRepeat: repeat,
      backgroundSize: typeof size === 'number' ? `${size}px` : size,
      backgroundPosition: position,
      opacity,
      zIndex,
      filter: variant === 'light' ? 'brightness(0) invert(1)' : 'grayscale(100%)',
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

      {/* ======================= HERO (FILIGRANE RENFORCÉ) ======================= */}
      <section className="relative py-44 md:py-64 text-white overflow-hidden bg-slate-800">
        {/* Fond Image */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay" 
             style={{ 
               backgroundImage: `url(${IMG_HERO_LAB})`, 
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               filter: 'contrast(110%) brightness(1.1)' 
             }} />
        
        {/* Overlay Dégradé */}
        <div className="absolute inset-0 z-1 bg-gradient-to-b from-slate-800/50 via-slate-800 to-slate-900" />
        
        {/* FILIGRANE LOGO 60PX : Opacité augmentée à 0.25 pour visibilité maximale */}
        <WatermarkOverlay 
          image={LOGO_URL} 
          variant="light" 
          opacity={0.25} 
          size={60} 
          repeat='repeat' 
          zIndex={2} 
          animate={false} // Désactivé pour un look plus stable et corporate
        />

        {/* Cadre technique */}
        <div className="absolute inset-8 md:inset-16 z-[3] border border-white/10 pointer-events-none" />
        <div className="absolute top-8 md:top-16 left-8 md:left-16 w-8 h-8 border-t-2 border-l-2 border-accent z-[3]" />
        <div className="absolute bottom-8 md:bottom-16 right-8 md:right-16 w-8 h-8 border-b-2 border-r-2 border-accent z-[3]" />

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-4 mb-10">
              <div className="h-[2px] w-16 bg-accent"></div>
              <span className="text-xs font-black uppercase tracking-[0.6em] text-accent">Division Sicaf Innovation</span>
            </div>
            
            <h1 className="text-6xl md:text-[9rem] font-black mb-10 leading-[0.8] uppercase tracking-tighter text-white drop-shadow-md">
              {t('hero.title')}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <p className="text-xl md:text-2xl text-slate-100 font-light leading-relaxed">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link to="/catalog">
                  <Button size="lg" className="rounded-none bg-white text-slate-900 hover:bg-accent hover:text-white px-12 h-18 text-lg font-black uppercase tracking-widest transition-all shadow-xl">
                    {t('hero.cta')}
                  </Button>
                </Link>
                <Link to="/quote">
                  <Button size="lg" variant="outline" className="rounded-none border-2 border-white/40 text-white hover:bg-white/10 px-12 h-18 text-lg font-black uppercase tracking-widest backdrop-blur-sm">
                    {t('nav.quote')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= STATS BANNER ======================= */}
      <section className="bg-white border-y border-slate-100 py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: 'Chemical Standards', val: 'ISO 14001', icon: Shield },
              { label: 'Production Capacity', val: '500k T/Y', icon: Factory },
              { label: 'Lab Operations', val: '24/7', icon: Activity },
              { label: 'Global Export', val: '65+ Countries', icon: Globe },
            ].map((s, i) => (
              <div key={i} className="flex flex-col border-l-2 border-slate-100 pl-8">
                <s.icon className="h-6 w-6 text-accent mb-4" />
                <span className="text-3xl font-black text-slate-900 tracking-tighter">{s.val}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= PRODUCT CATEGORIES ======================= */}
      <section className="relative py-32 overflow-hidden bg-slate-50">
        <WatermarkOverlay image={IMG_PRODUCTS_CHEM} variant="dark" opacity={0.15} size="110%" position="center" repeat="no-repeat" zIndex={1} />
        <WatermarkOverlay image={LOGO_URL} variant="dark" opacity={0.05} size={200} rotation={15} repeat='repeat' zIndex={2} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black mb-8 text-slate-900 uppercase tracking-tighter">{t('home.products_title')}</h2>
            <div className="h-2 bg-accent w-40 mx-auto mb-10"></div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium italic">{t('home.products_subtitle')}</p>
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-24"><Loader2 className="h-16 w-16 animate-spin text-accent" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 shadow-2xl bg-slate-200">
              {categories.map((category) => (
                <Link key={category.id} to={`/products/${category.id}`} className="group relative bg-white/95 p-14 overflow-hidden transition-all hover:bg-slate-900 hover:text-white">
                  <div className="relative z-10">
                    <div className="mb-10 text-accent group-hover:text-white">{category.icon || <Beaker size={56} strokeWidth={1} />}</div>
                    <h3 className="font-black text-2xl mb-6 uppercase tracking-tight">{category.name[language]}</h3>
                    <p className="text-slate-500 group-hover:text-slate-400 leading-relaxed font-medium mb-10">{category.description[language]}</p>
                    <div className="flex items-center text-[10px] font-bold uppercase tracking-[0.3em] text-accent opacity-0 group-hover:opacity-100 transition-all">
                      Fiche Technique <ChevronRight size={14} className="ml-2" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ======================= WHY CHOOSE US ======================= */}
      <section className="relative py-32 overflow-hidden bg-white">
        <WatermarkOverlay image={IMG_WHY_MOLECULE} variant="dark" opacity={0.06} size="cover" repeat="no-repeat" zIndex={1} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-6 text-slate-900 uppercase tracking-tighter">{t('home.why_title')}</h2>
            <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium">{t('home.why_subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="group p-12 bg-slate-50 border border-slate-100 hover:bg-slate-900 hover:text-white transition-all duration-500">
                <div className="w-16 h-16 flex items-center justify-center bg-white border border-slate-200 text-accent group-hover:bg-accent group-hover:text-white mb-8"><feature.icon className="h-8 w-8" /></div>
                <h3 className="font-black text-xl mb-4 uppercase tracking-wide">{t(feature.titleKey)}</h3>
                <p className="text-sm opacity-80 leading-relaxed font-medium">{t(feature.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= CTA (FILIGRANE RENFORCÉ) ======================= */}
      <section className="relative py-48 bg-slate-700 text-white overflow-hidden border-t border-accent/20">
        <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen" 
             style={{ backgroundImage: `url(${IMG_PRODUCTS_CHEM})`, filter: 'brightness(1.5) contrast(1.1)' }} />
        
        <div className="absolute inset-0 z-1 bg-gradient-to-t from-slate-900 via-slate-800/80 to-transparent" />
        
        {/* LOGO REPETITION 60PX : Opacité 0.20 pour le CTA */}
        <WatermarkOverlay 
          image={LOGO_URL} 
          variant="light" 
          opacity={0.20} 
          size={60} 
          repeat='repeat' 
          zIndex={2} 
          animate={false}
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center p-6 border border-accent/30 bg-slate-800/50 mb-14 backdrop-blur-md">
             <Factory className="h-12 w-12 text-accent" />
          </div>
          
          <h2 className="text-6xl md:text-9xl font-black mb-16 tracking-tighter uppercase leading-[0.85]">
            {language === 'fr' ? "L'Excellence à Grande Échelle" : 'Excellence at Scale'}
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Link to="/quote">
              <Button size="lg" className="rounded-none bg-accent text-white hover:bg-white hover:text-slate-900 px-20 h-24 text-2xl font-black uppercase tracking-[0.2em] shadow-2xl transition-all">
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
            0% { transform: translate(0, 0); }
            100% { transform: translate(-40px, -20px); }
          }
          .animate-watermark {
            animation: watermarkMove 80s linear infinite;
          }
        `}
      </style>
    </Layout>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Shield, Award, Users, Truck, ChevronRight, 
  Loader2, FlaskConical, Beaker, Microscope, TestTube2, 
  Binary, Factory, Activity, Gauge, Globe, Zap
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WhatsAppButton from '@/components/WhatsAppButton';

// Composant Watermark (Filigrane)
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

      {/* ======================= HERO SECTION ======================= */}
      <section className="relative py-44 md:py-64 text-white overflow-hidden bg-[#0F172A]">
        <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay" 
             style={{ 
               backgroundImage: `url(${IMG_HERO_LAB})`, 
               backgroundSize: '50% 100%', 
               backgroundRepeat: 'repeat-x',
               filter: 'grayscale(100%) contrast(120%)' 
             }} />
        
        <div className="absolute inset-0 z-1 bg-gradient-to-b from-[#1E293B]/40 via-[#0F172A] to-[#0F172A]" />
        
        {/* Cadre de précision technique */}
        <div className="absolute inset-8 md:inset-16 z-[2] border border-white/5 pointer-events-none" />
        <div className="absolute top-8 md:top-16 left-8 md:left-16 w-8 h-8 border-t-2 border-l-2 border-accent z-[2]" />
        <div className="absolute bottom-8 md:bottom-16 right-8 md:right-16 w-8 h-8 border-b-2 border-r-2 border-accent z-[2]" />

        {/* LOGO REPETITION 60PX (Look Motif de Sécurité) */}
        <WatermarkOverlay image={LOGO_URL} variant="light" opacity={0.12} size={60} repeat='repeat' zIndex={2} />

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-4 mb-10">
              <div className="h-[2px] w-16 bg-accent"></div>
              <span className="text-xs font-black uppercase tracking-[0.6em] text-accent">Sicaf Global Research Unit</span>
            </div>
            
            <h1 className="text-6xl md:text-[9.5rem] font-black mb-10 leading-[0.8] uppercase tracking-tighter">
              {t('hero.title')}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mt-12">
              <p className="text-xl md:text-2xl text-slate-400 font-light leading-relaxed border-l border-white/10 pl-8">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link to="/catalog">
                  <Button size="lg" className="rounded-none bg-white text-slate-900 hover:bg-accent hover:text-white px-12 h-18 text-lg font-black uppercase tracking-widest transition-all">
                    {t('hero.cta')}
                  </Button>
                </Link>
                <Link to="/quote">
                  <Button size="lg" variant="outline" className="rounded-none border-2 border-white/20 text-white hover:bg-white/10 px-12 h-18 text-lg font-black uppercase tracking-widest">
                    {t('nav.quote')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= STATS BANNER ======================= */}
      <section className="bg-white border-y border-slate-100 py-16 relative z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: 'Chemical Standards', val: 'ISO 14001', icon: Shield },
              { label: 'Production Capacity', val: '500k T/Y', icon: Factory },
              { label: 'Lab Operations', val: '24/7', icon: Activity },
              { label: 'Global Export', val: '65+ Countries', icon: Globe },
            ].map((s, i) => (
              <div key={i} className="flex flex-col border-l-2 border-slate-100 pl-8 group">
                <s.icon className="h-6 w-6 text-accent mb-4 transition-transform group-hover:scale-110" />
                <span className="text-3xl font-black text-slate-900 tracking-tighter">{s.val}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= PRODUCT CATEGORIES ======================= */}
      <section className="relative py-32 overflow-hidden bg-slate-50">
        {/* FILIGRANE PRODUITS : Visibilité augmentée (0.15) */}
        <WatermarkOverlay 
          image={IMG_PRODUCTS_CHEM} 
          variant="dark" 
          opacity={0.15} 
          size="110%" 
          position="center" 
          repeat="no-repeat" 
          zIndex={1} 
        />
        
        {/* LOGO FILIGRANE : Taille 200px pour marquer le fond */}
        <WatermarkOverlay image={LOGO_URL} variant="dark" opacity={0.05} size={200} rotation={15} repeat='repeat' zIndex={2} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black mb-8 text-slate-900 uppercase tracking-tighter">
              {t('home.products_title')}
            </h2>
            <div className="h-2 bg-accent w-40 mx-auto mb-10"></div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium italic">
              {t('home.products_subtitle')}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="h-16 w-16 animate-spin text-accent" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 shadow-2xl bg-slate-200">
              {categories.map((category) => (
                <Link key={category.id} to={`/products/${category.id}`} className="group relative bg-white/95 backdrop-blur-sm p-14 overflow-hidden transition-all hover:bg-slate-900">
                  <div className="relative z-10">
                    <div className="mb-10 text-accent group-hover:text-white transition-colors">
                      {category.icon || <Beaker size={56} strokeWidth={1} />}
                    </div>
                    <h3 className="font-black text-2xl text-slate-900 group-hover:text-white mb-6 uppercase tracking-tight">
                      {category.name[language]}
                    </h3>
                    <p className="text-slate-500 group-hover:text-slate-400 leading-relaxed font-medium mb-10">
                      {category.description[language]}
                    </p>
                    <div className="flex items-center text-[10px] font-bold uppercase tracking-[0.3em] text-accent opacity-0 group-hover:opacity-100 transition-all">
                      View Technical Specs <ChevronRight size={14} className="ml-2" />
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
                <div className="w-16 h-16 flex items-center justify-center bg-white border border-slate-200 text-accent group-hover:bg-accent group-hover:text-white mb-8 shadow-sm">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="font-black text-xl mb-4 uppercase tracking-wide">{t(feature.titleKey)}</h3>
                <p className="text-sm opacity-80 leading-relaxed font-medium">{t(feature.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= CTA SECTION ======================= */}
      <section className="relative py-48 bg-[#1E293B] text-white overflow-hidden border-t border-accent/20">
        <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-soft-light" 
             style={{ backgroundImage: `url(${IMG_PRODUCTS_CHEM})`, filter: 'grayscale(100%)' }} />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/90 to-transparent" />
        
        {/* LOGO REPETITION 60PX */}
        <WatermarkOverlay image={LOGO_URL} variant="light" opacity={0.12} size={60} repeat='repeat' zIndex={2} />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center p-6 border border-accent/20 bg-[#0F172A]/50 mb-14">
             <Factory className="h-12 w-12 text-accent animate-pulse" />
          </div>
          
          <h2 className="text-6xl md:text-9xl font-black mb-16 tracking-tighter uppercase italic leading-[0.85]">
            {language === 'fr' ? "Façonner l'Avenir Chimique" : 'Shaping Chemical Future'}
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Link to="/quote">
              <Button size="lg" className="rounded-none bg-accent text-white hover:bg-white hover:text-slate-900 px-20 h-24 text-2xl font-black uppercase tracking-[0.2em] shadow-2xl transition-all">
                {t('nav.quote')}
              </Button>
            </Link>
            <WhatsAppButton variant="hero" />
          </div>
          
          <div className="mt-24 flex justify-center items-center gap-10 opacity-30">
            {['Reliability', 'Precision', 'Innovation'].map((txt, i) => (
              <React.Fragment key={i}>
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">{txt}</span>
                {i < 2 && <span className="h-1 w-1 bg-accent rounded-full" />}
              </React.Fragment>
            ))}
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

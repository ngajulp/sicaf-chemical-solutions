import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Shield, Award, Users, Truck, ChevronRight, 
  Loader2, FlaskConical, Beaker, Microscope, TestTube2, 
  Binary, Factory, Activity, Gauge, Globe, Database, Droplets
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WhatsAppButton from '@/components/WhatsAppButton';

// Composant Watermark avec filtres industriels
const WatermarkOverlay: React.FC<{
  image: string;
  opacity?: number;
  size?: string | number;
  rotation?: number;
  variant?: 'light' | 'dark'; 
  zIndex?: number;
  repeat?: 'repeat' | 'no-repeat';
  position?: string;
}> = ({ image, opacity = 0.1, size = 'cover', rotation = 0, variant = 'dark', zIndex = 0, repeat = 'no-repeat', position = 'center' }) => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `url(${image})`,
      backgroundRepeat: repeat,
      backgroundSize: typeof size === 'number' ? `${size}px` : size,
      backgroundPosition: position,
      opacity,
      zIndex,
      filter: variant === 'light' ? 'brightness(0) invert(1) contrast(1.2)' : 'grayscale(100%) contrast(1.1)',
      transform: rotation ? `rotate(${rotation}deg)` : 'none',
    } as React.CSSProperties}
  />
);

export default function Index() {
  const { language, t } = useLanguage();
  const { categories, loading } = useGitHubProducts();

  const LOGO_URL = "https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/sicaf.png";
  
  // URLs d'images strictement industrielles/chimiques
  const IMG_INDUSTRIAL_PLANT = "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=2000&q=80"; // Usine chimique complexe
  const IMG_CHEMICAL_R_D = "https://images.unsplash.com/photo-1532187863486-abf9d3a3522a?auto=format&fit=crop&w=2000&q=80"; // Recherche labo avancée
  const IMG_MOLECULAR_STRUCTURE = "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&w=2000&q=80"; // Structure moléculaire technique
  const IMG_LOGISTICS_CHEM = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80"; // Stockage/Logistique industrielle

  const features = [
    { icon: Shield, titleKey: 'home.quality', descKey: 'home.quality_desc' },
    { icon: Award, titleKey: 'home.expertise', descKey: 'home.expertise_desc' },
    { icon: Users, titleKey: 'home.service', descKey: 'home.service_desc' },
    { icon: Truck, titleKey: 'home.delivery', descKey: 'home.delivery_desc' },
  ];

  return (
    <Layout>
      <WhatsAppButton variant="floating" />

      {/* ======================= HERO : CENTRE DE RECHERCHE & USINE ======================= */}
      <section className="relative py-44 md:py-64 text-white overflow-hidden bg-slate-800">
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay" 
             style={{ backgroundImage: `url(${IMG_INDUSTRIAL_PLANT})`, backgroundSize: 'cover' }} />
        
        <div className="absolute inset-0 z-1 bg-gradient-to-br from-slate-900 via-slate-800/90 to-slate-800/40" />
        
        {/* Filigrane Logo Sicaf - Visible mais subtil */}
        <WatermarkOverlay image={LOGO_URL} variant="light" opacity={0.18} size={60} repeat='repeat' zIndex={2} />

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-5xl border-l-2 border-accent/30 pl-8 md:pl-16">
            <div className="inline-flex items-center gap-3 mb-8 bg-white/5 px-4 py-1 backdrop-blur-md">
              <Database className="h-4 w-4 text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em]">{language === 'fr' ? 'Infrastructure Chimique Certifiée' : 'Certified Chemical Infrastructure'}</span>
            </div>
            <h1 className="text-6xl md:text-[8.5rem] font-black mb-8 leading-[0.85] uppercase tracking-tighter">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 mb-12 max-w-2xl font-light">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/catalog">
                <Button size="lg" className="rounded-none bg-white text-slate-900 hover:bg-accent hover:text-white px-12 h-18 text-lg font-black uppercase tracking-widest transition-all">
                  {t('hero.cta')}
                </Button>
              </Link>
              <Link to="/quote">
                <Button size="lg" variant="outline" className="rounded-none border-2 border-white/40 hover:bg-white/10 px-12 h-18 text-lg font-black uppercase tracking-widest">
                  {t('nav.quote')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= STATS BANNER ======================= */}
      <section className="bg-white border-b border-slate-100 py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: 'Quality Control', val: 'ISO 9001', icon: Shield },
              { label: 'Chemical R&D', val: 'Active', icon: Microscope },
              { label: 'Safety Index', val: '99.9%', icon: Gauge },
              { label: 'Units', val: 'Global', icon: Globe },
            ].map((s, i) => (
              <div key={i} className="flex flex-col border-l border-slate-200 pl-8 group">
                <s.icon className="h-5 w-5 text-accent mb-4 group-hover:rotate-12 transition-transform" />
                <span className="text-3xl font-black text-slate-900 tracking-tighter">{s.val}</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= PRODUCT SECTION : LABORATOIRE R&D ======================= */}
      <section className="relative py-32 overflow-hidden bg-slate-50">
        {/* Filigrane Recherche Chimique - Visibilité réglée pour le texte noir */}
        <WatermarkOverlay image={IMG_CHEMICAL_R_D} variant="dark" opacity={0.12} size="100%" zIndex={1} />
        <WatermarkOverlay image={LOGO_URL} variant="dark" opacity={0.06} size={180} rotation={10} repeat='repeat' zIndex={2} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black mb-6 text-slate-900 uppercase tracking-tighter italic">
              {t('home.products_title')}
            </h2>
            <div className="h-1 bg-slate-900 w-32 mx-auto mb-8"></div>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">{t('home.products_subtitle')}</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent h-12 w-12" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-200 shadow-2xl">
              {categories.map((category) => (
                <Link key={category.id} to={`/products/${category.id}`} className="group bg-white/90 backdrop-blur-sm p-14 border-r border-b border-slate-100 hover:bg-slate-900 transition-colors">
                  <div className="text-accent group-hover:text-white mb-8">
                    {category.icon || <Droplets size={48} strokeWidth={1.5} />}
                  </div>
                  <h3 className="font-black text-2xl text-slate-900 group-hover:text-white mb-4 uppercase">{category.name[language]}</h3>
                  <p className="text-slate-500 group-hover:text-slate-400 text-sm leading-relaxed mb-8">{category.description[language]}</p>
                  <div className="text-[10px] font-bold text-accent uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Technical Data Sheet →</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ======================= WHY CHOOSE US : STRUCTURE MOLÉCULAIRE ======================= */}
      <section className="relative py-32 overflow-hidden bg-white">
        <WatermarkOverlay image={IMG_MOLECULAR_STRUCTURE} variant="dark" opacity={0.1} size="cover" zIndex={1} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 uppercase tracking-tight">{t('home.why_title')}</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">{t('home.why_subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="p-10 bg-slate-50 border border-slate-100 hover:border-slate-900 transition-all">
                <feature.icon className="h-8 w-8 text-accent mb-6" />
                <h3 className="font-bold text-lg mb-4 uppercase tracking-wider">{t(feature.titleKey)}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{t(feature.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= CTA (CTD) : LOGISTIQUE INDUSTRIELLE ======================= */}
      <section className="relative py-48 bg-slate-800 text-white overflow-hidden">
        {/* Filigrane Entrepôt/Logistique Chimique */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-soft-light" 
             style={{ backgroundImage: `url(${IMG_LOGISTICS_CHEM})`, backgroundSize: 'cover' }} />
        
        <div className="absolute inset-0 z-1 bg-gradient-to-t from-slate-900 via-slate-800/80 to-transparent" />
        
        {/* Logo Sicaf Filigrane 60px répétition */}
        <WatermarkOverlay image={LOGO_URL} variant="light" opacity={0.15} size={60} repeat='repeat' zIndex={2} />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-block p-4 border border-accent/30 mb-12 bg-slate-900/50 backdrop-blur-sm">
             <Factory className="h-10 w-10 text-accent" />
          </div>
          <h2 className="text-6xl md:text-9xl font-black mb-16 tracking-tighter uppercase leading-[0.85] italic">
            {language === 'fr' ? "Production à Flux Tendu" : 'High Velocity Production'}
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/quote">
              <Button size="lg" className="rounded-none bg-accent text-white hover:bg-white hover:text-slate-900 px-16 h-20 text-xl font-black uppercase tracking-widest shadow-2xl">
                Demander un Devis
              </Button>
            </Link>
            <WhatsAppButton variant="hero" />
          </div>
          <div className="mt-20 opacity-30 text-[9px] font-bold uppercase tracking-[1em]">
            SICAF CHEMICALS • SYSTEM OPERATIONAL
          </div>
        </div>
      </section>

      <style>
        {`
          @keyframes watermarkMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-30px, -15px); }
          }
          .animate-watermark {
            animation: watermarkMove 60s linear infinite;
          }
        `}
      </style>
    </Layout>
  );
}

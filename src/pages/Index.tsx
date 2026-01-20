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
import WhatsAppButton from '@/components/WhatsAppButton';

const WatermarkOverlay: React.FC<{
  image: string;
  opacity?: number;
  size?: string | number;
  variant?: 'light' | 'dark'; 
  zIndex?: number;
  repeat?: 'repeat' | 'no-repeat';
  position?: string;
  className?: string;
}> = ({ image, opacity = 0.2, size = 'cover', variant = 'dark', zIndex = 0, repeat = 'no-repeat', position = 'center', className = "" }) => (
  <div
    className={`absolute inset-0 pointer-events-none ${className}`}
    style={{
      backgroundImage: `url(${image})`,
      backgroundRepeat: repeat,
      backgroundSize: typeof size === 'number' ? `${size}px` : size,
      backgroundPosition: position,
      opacity,
      zIndex,
      filter: variant === 'light' 
        ? 'brightness(0) invert(1) contrast(1.5)' 
        : 'grayscale(100%) contrast(1.3) brightness(0.8)',
    } as React.CSSProperties}
  />
);

export default function Index() {
  const { language, t } = useLanguage();
  const { categories, loading } = useGitHubProducts();

  const LOGO_URL = "https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/sicaf.png";
  const IMG_PLANT = "https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/labochimie.png";
  const IMG_LAB = "https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/industriechimie.png";
  const IMG_MOLECULE = "https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/produitschimique.png";
  const IMG_LOGISTICS = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80";

  // Définition des features pour la section "Why Choose Us"
  const features = [
    { icon: Shield, titleKey: 'home.quality', descKey: 'home.quality_desc' },
    { icon: Microscope, titleKey: 'home.expertise', descKey: 'home.expertise_desc' },
    { icon: Truck, titleKey: 'home.delivery', descKey: 'home.delivery_desc' },
    { icon: Users, titleKey: 'home.service', descKey: 'home.service_desc' },
  ];
  
  return (
    <Layout>
      <WhatsAppButton variant="floating" />

      {/* HERO SECTION */}
      <section className="relative py-44 md:py-64 text-white overflow-hidden bg-slate-900">
        <WatermarkOverlay image={IMG_PLANT} variant="dark" opacity={0.45} zIndex={0} />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        <WatermarkOverlay image={LOGO_URL} variant="light" opacity={0.35} size={60} repeat='repeat' zIndex={2} />

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-5xl border-l-4 border-accent pl-8 md:pl-16">
            <h1 className="text-5xl md:text-[7.6rem] font-black mb-8 leading-[0.85] uppercase tracking-tighter drop-shadow-2xl italic">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-[1.6rem] text-slate-200 mb-12 max-w-2xl font-bold bg-slate-900/40 backdrop-blur-sm inline-block p-2 uppercase italic">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              {/* BOUTON CATALOGUE : Fond blanc, Texte sombre par défaut */}
              <Link to="/catalog">
                <Button 
                  size="lg" 
                  className="rounded-none bg-white text-slate-900 hover:bg-accent hover:text-white px-12 h-20 text-xl font-black uppercase tracking-widest shadow-2xl transition-all border-none"
                >
                  {t('hero.cta')}
                </Button>
              </Link>
            
              {/* BOUTON DEVIS : Bordure blanche, Texte blanc, Fond transparent */}
              <Link to="/quote">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-none border-4 border-white text-white hover:bg-white hover:text-slate-900 px-12 h-20 text-xl font-black uppercase tracking-widest bg-transparent transition-all"
                >
                  {t('nav.quote')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className="bg-white border-y-8 border-slate-100 py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { label: 'Quality Assurance', val: 'ISO 9001', icon: Shield },
              { label: 'Chemical R&D', val: 'Precision', icon: Microscope },
              { label: 'Safety Index', val: '100%', icon: Gauge },
              { label: 'Units', val: 'Global', icon: Globe },
            ].map((s, i) => (
              <div key={i} className="flex flex-col border-l-4 border-accent pl-8">
                <s.icon className="h-8 w-8 text-accent mb-4" />
                <span className="text-4xl font-black text-slate-900 tracking-tighter">{s.val}</span>
                <span className="text-xs uppercase tracking-widest text-slate-500 font-black">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOS PRODUITS */}
      <section className="relative py-32 overflow-hidden bg-slate-50">
        <WatermarkOverlay image={IMG_LAB} variant="dark" opacity={0.30} zIndex={1} />
        <WatermarkOverlay image={LOGO_URL} variant="dark" opacity={0.15} size={250} rotation={-15} repeat='repeat' zIndex={2} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-8xl font-black mb-6 text-slate-900 uppercase tracking-tighter">
              {t('home.products_title')}
            </h2>
            <div className="h-3 bg-accent w-48 mx-auto mb-8 shadow-sm"></div>
            <p className="text-2xl text-slate-800 max-w-2xl mx-auto font-bold bg-white/60 backdrop-blur-sm p-4">{t('home.products_subtitle')}</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent h-16 w-16" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-slate-200 border-4 border-slate-200">
              {categories.map((category) => (
                <Link key={category.id} to={`/products/${category.id}`} className="group bg-white/90 p-16 hover:bg-slate-900 transition-all duration-500">
                  <div className="text-accent group-hover:text-white mb-10 transform group-hover:scale-110 transition-transform">
                    {category.icon || <Beaker size={64} strokeWidth={2} />}
                  </div>
                  <h3 className="font-black text-3xl text-slate-900 group-hover:text-white mb-6 uppercase tracking-tight">{category.name[language]}</h3>
                  <p className="text-slate-600 group-hover:text-slate-300 text-lg leading-relaxed font-bold">{category.description[language]}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHY CHOOSE US (STRUCTURE ENGINEERING / TEXTE FEATURES) */}
      <section className="relative py-32 overflow-hidden bg-white">
        <WatermarkOverlay image={IMG_MOLECULE} variant="dark" opacity={0.25} zIndex={1} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-heading text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight italic mb-4">
              {t('home.why_title')}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium bg-white/50 backdrop-blur-sm inline-block px-2">
              {t('home.why_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-10 bg-white/80 backdrop-blur-md border-b-8 border-accent shadow-2xl flex flex-col items-center text-center transition-transform hover:-translate-y-2">
                <div className="text-accent mb-8">
                  <feature.icon className="h-12 w-12" strokeWidth={1.5} />
                </div>
                <h3 className="font-black text-xl text-slate-900 uppercase mb-4 tracking-tight">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-slate-600 font-bold leading-relaxed text-sm">
                  {t(feature.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="relative py-56 bg-slate-900 text-white overflow-hidden border-t-8 border-accent">
        <WatermarkOverlay image={IMG_LOGISTICS} variant="dark" opacity={0.40} zIndex={0} />
        <div className="absolute inset-0 z-[1] bg-slate-900/60 backdrop-brightness-50" />
        <WatermarkOverlay image={LOGO_URL} variant="light" opacity={0.40} size={60} repeat='repeat' zIndex={2} />

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-heading text-3xl md:text-5xl font-black mb-6 uppercase tracking-tight italic drop-shadow-xl">
            {language === 'fr' ? 'Besoin d\'un devis personnalisé ?' : 'Need a custom quote?'}
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto font-medium uppercase tracking-wider">
            {language === 'fr'
              ? 'Notre équipe d\'experts est prête à vous accompagner dans vos projets'
              : 'Our team of experts is ready to assist you with your projects'}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/quote">
              <Button size="lg" className="bg-accent text-white hover:bg-white hover:text-slate-900 font-black uppercase tracking-widest px-10 h-16 rounded-none shadow-xl transition-all">
                {t('nav.quote')}
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-slate-900 font-black uppercase tracking-widest px-10 h-16 rounded-none transition-all">
                {t('nav.contact')}
              </Button>
            </Link>
          </div>
          <div className="pt-10">
            <WhatsAppButton variant="hero" />
          </div>
        </div>
      </section>
    </Layout>
  );
}

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

// Composant Watermark avec visibilité renforcée
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
  
  // Images à fort contraste pour les filigranes
  const IMG_PLANT = "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=2000&q=80";
  const IMG_LAB = "https://images.unsplash.com/photo-1532187863486-abf9d3a3522a?auto=format&fit=crop&w=2000&q=80";
  const IMG_MOLECULE = "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&w=2000&q=80";
  const IMG_LOGISTICS = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80";

  return (
    <Layout>
      <WhatsAppButton variant="floating" />

      {/* ======================= HERO SECTION ======================= */}
      <section className="relative py-44 md:py-64 text-white overflow-hidden bg-slate-900">
        {/* Filigrane Image Industrielle - Très visible (Opacité 0.45) */}
        <WatermarkOverlay image={IMG_PLANT} variant="dark" opacity={0.45} zIndex={0} />
        
        {/* Voile de couleur pour détacher le texte */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        
        {/* Filigrane Logo SICAF 60px - Net et répété (Opacité 0.35) */}
        <WatermarkOverlay image={LOGO_URL} variant="light" opacity={0.35} size={60} repeat='repeat' zIndex={2} />

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-5xl border-l-4 border-accent pl-8 md:pl-16">
            <h1 className="text-6xl md:text-[9rem] font-black mb-8 leading-[0.85] uppercase tracking-tighter drop-shadow-2xl">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-3xl text-slate-200 mb-12 max-w-2xl font-bold bg-slate-900/40 backdrop-blur-sm inline-block p-2">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/catalog">
                <Button size="lg" className="rounded-none bg-white text-slate-900 hover:bg-accent hover:text-white px-12 h-20 text-xl font-black uppercase tracking-widest shadow-2xl transition-all">
                  {t('hero.cta')}
                </Button>
              </Link>
              <Link to="/quote">
                <Button size="lg" variant="outline" className="rounded-none border-4 border-white text-white hover:bg-white/20 px-12 h-20 text-xl font-black uppercase tracking-widest">
                  {t('nav.quote')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= STATS BANNER ======================= */}
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

      {/* ======================= NOS PRODUITS ======================= */}
      <section className="relative py-32 overflow-hidden bg-slate-50">
        {/* Filigrane Labo R&D - Visibilité Forte (Opacité 0.30) */}
        <WatermarkOverlay image={IMG_LAB} variant="dark" opacity={0.30} zIndex={1} />
        
        {/* Filigrane Logo Large 250px */}
        <WatermarkOverlay image={LOGO_URL} variant="dark" opacity={0.15} size={250} rotation={-15} repeat='repeat' zIndex={2} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-8xl font-black mb-6 text-slate-900 uppercase tracking-tighter shadow-sm">
              {t('home.products_title')}
            </h2>
            <div className="h-3 bg-accent w-48 mx-auto mb-8"></div>
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

      {/* ======================= WHY CHOOSE US ======================= */}
      <section className="relative py-32 overflow-hidden bg-white">
        {/* Filigrane Moléculaire (Opacité 0.25) */}
        <WatermarkOverlay image={IMG_MOLECULE} variant="dark" opacity={0.25} zIndex={1} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-6 text-slate-900 uppercase tracking-tight italic">Engineering Excellence</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {categories.slice(0, 4).map((_, index) => (
              <div key={index} className="p-12 bg-white/80 backdrop-blur-md border-b-8 border-accent shadow-xl">
                <Activity className="h-10 w-10 text-accent mb-8" />
                <h3 className="font-black text-xl mb-4 uppercase">Protocol {index + 1}</h3>
                <p className="text-slate-600 font-bold uppercase text-xs tracking-widest">High Performance Standard</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= CTA (CTD) SECTION ======================= */}
      {/* ======================= SECTION CTA : IMPACT INDUSTRIEL & DEVIS ======================= */}
      <section className="relative py-48 md:py-60 bg-slate-900 text-white overflow-hidden border-t-8 border-accent">
        {/* Filigrane : Fûts industriels (Logistique lourde) - Haute visibilité */}
        <WatermarkOverlay 
          image={IMG_INDUSTRIAL_DRUMS} 
          variant="dark" 
          opacity={0.55} 
          zIndex={0} 
        />
        
        {/* Voile sombre pour détacher le texte blanc */}
        <div className="absolute inset-0 z-[1] bg-slate-900/40 backdrop-brightness-50" />
        
        {/* Logo SICAF répétitif 60px (Sceau de certification) */}
        <WatermarkOverlay 
          image={LOGO_URL} 
          variant="light" 
          opacity={0.4} 
          size={60} 
          repeat='repeat' 
          zIndex={2} 
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Texte de la section 2 injecté dans le style monumental de la section 1 */}
          <h2 className="text-5xl md:text-[8rem] font-black mb-6 tracking-tighter uppercase italic leading-[0.85] drop-shadow-[0_20px_20px_rgba(0,0,0,1)]">
            {language === 'fr' ? "Besoin d'un devis personnalisé ?" : 'Need a custom quote?'}
          </h2>
          
          <p className="text-xl md:text-3xl font-bold mb-16 max-w-3xl mx-auto uppercase tracking-wide bg-accent/10 backdrop-blur-sm p-4 border border-white/5">
            {language === 'fr'
              ? "Notre équipe d'experts est prête à vous accompagner dans vos projets"
              : 'Our team of experts is ready to assist you with your projects'}
          </p>

          {/* Boutons fusionnés */}
          <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
            <Link to="/quote">
              <Button 
                size="lg" 
                className="rounded-none bg-accent text-white hover:bg-white hover:text-slate-900 px-16 h-24 text-3xl font-black uppercase tracking-widest shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all flex items-center gap-4"
              >
                {t('nav.quote')}
                <ArrowRight className="h-8 w-8" />
              </Button>
            </Link>
            
            <Link to="/contact">
              <Button 
                size="lg" 
                variant="outline"
                className="rounded-none border-4 border-white text-white hover:bg-white/20 px-16 h-24 text-3xl font-black uppercase tracking-widest backdrop-blur-sm transition-all"
              >
                {t('nav.contact')}
              </Button>
            </Link>
          </div>

          {/* WhatsApp CTA final */}
          <div className="mt-12">
            <WhatsAppButton variant="hero" />
          </div>

          {/* Signature Technique */}
          <div className="mt-20 text-accent font-black tracking-[1.5em] text-xs uppercase opacity-80">
            DANGER • HIGH QUALITY CHEMICALS • SICAF 2026
          </div>
        </div>
      </section>
    </Layout>
  );
}

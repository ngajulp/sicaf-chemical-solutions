import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Shield, Award, Users, Truck, ChevronRight, 
  Loader2, FlaskConical, Beaker, Microscope, TestTube2, 
  Binary, Factory, Activity, Gauge, Globe, Database, Droplets, FlaskRound
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WhatsAppButton from '@/components/WhatsAppButton';

// Composant Watermark - Visibilité Maximale "Expert"
const WatermarkOverlay: React.FC<{
  image: string;
  opacity?: number;
  size?: string | number;
  variant?: 'light' | 'dark'; 
  zIndex?: number;
  repeat?: 'repeat' | 'no-repeat';
  position?: string;
  grayscale?: boolean;
}> = ({ image, opacity = 0.3, size = 'cover', variant = 'dark', zIndex = 0, repeat = 'no-repeat', position = 'center', grayscale = true }) => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `url(${image})`,
      backgroundRepeat: repeat,
      backgroundSize: typeof size === 'number' ? `${size}px` : size,
      backgroundPosition: position,
      opacity,
      zIndex,
      filter: `${grayscale ? 'grayscale(100%)' : ''} contrast(1.4) brightness(${variant === 'light' ? '1.5' : '0.7'})`,
    } as React.CSSProperties}
  />
);

export default function Index() {
  const { language, t } = useLanguage();
  const { categories, loading } = useGitHubProducts();

  const LOGO_URL = "https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/sicaf.png";
  
  // SELECTION D'IMAGES PRECISES ET PARLANTES
  const IMG_LAB_ENGINEER = "https://images.unsplash.com/photo-1581093588401-22d07cddf79b?auto=format&fit=crop&w=2000&q=80"; // Ingénieur manipulant des instruments de précision
  const IMG_CHEMICAL_REACTION = "https://images.unsplash.com/photo-1603126738563-6a3ef5615f47?auto=format&fit=crop&w=2000&q=80"; // Verrerie, béchers et solutions colorées en gros plan
  const IMG_FORMULA_TECH = "https://images.unsplash.com/photo-1532187863486-abf9d3a3522a?auto=format&fit=crop&w=2000&q=80"; // Formules chimiques et recherche appliquée
  const IMG_INDUSTRIAL_DRUMS = "https://images.unsplash.com/photo-1624391976761-d51e1bd1fb46?auto=format&fit=crop&w=2000&q=80"; // Fûts industriels et produits finis (aspect toxique/sécurisé)

  return (
    <Layout>
      <WhatsAppButton variant="floating" />

      {/* ======================= HERO : L'INGENIEUR & LA RECHERCHE ======================= */}
      <section className="relative py-44 md:py-64 text-white overflow-hidden bg-slate-900">
        {/* Filigrane : Ingénieur et Centre de recherche (Opacité 0.50) */}
        <WatermarkOverlay image={IMG_LAB_ENGINEER} variant="dark" opacity={0.5} zIndex={0} />
        
        {/* Voile de protection pour le texte */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent" />
        
        {/* Logo SICAF 60px en trame de sécurité (Opacité 0.40) */}
        <WatermarkOverlay image={LOGO_URL} variant="light" opacity={0.4} size={60} repeat='repeat' zIndex={2} />

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-5xl border-l-4 border-accent pl-8 md:pl-16">
            <h1 className="text-6xl md:text-[8.5rem] font-black mb-8 leading-[0.85] uppercase tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,1)]">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-3xl text-slate-100 mb-12 max-w-2xl font-black bg-accent/20 backdrop-blur-md inline-block p-4 border border-white/10">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/catalog">
                <Button size="lg" className="rounded-none bg-white text-slate-900 hover:bg-accent hover:text-white px-12 h-20 text-xl font-black uppercase tracking-widest transition-all">
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
              { label: 'Analyses de Labo', val: '100%', icon: FlaskRound },
              { label: 'R&D Avancée', val: 'Expertise', icon: Microscope },
              { label: 'Sécurité Chimique', val: 'Zéro Risque', icon: Shield },
              { label: 'Infrastructure', val: 'Industrielle', icon: Factory },
            ].map((s, i) => (
              <div key={i} className="flex flex-col border-l-4 border-accent pl-8">
                <s.icon className="h-8 w-8 text-accent mb-4" />
                <span className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{s.val}</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-black">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= PRODUITS : VERRERIE & SOLUTIONS ======================= */}
      <section className="relative py-32 overflow-hidden bg-slate-50">
        {/* Filigrane : Verrerie, Bécher, Réaction chimique (Opacité 0.40) */}
        <WatermarkOverlay image={IMG_CHEMICAL_REACTION} variant="dark" opacity={0.4} zIndex={1} />
        
        {/* Logo SICAF Filigrane 250px répétition */}
        <WatermarkOverlay image={LOGO_URL} variant="dark" opacity={0.1} size={250} rotation={-15} repeat='repeat' zIndex={2} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-8xl font-black mb-6 text-slate-900 uppercase tracking-tighter drop-shadow-md">
              {t('home.products_title')}
            </h2>
            <div className="h-3 bg-accent w-48 mx-auto mb-8 shadow-xl"></div>
            <p className="text-2xl text-slate-900 max-w-3xl mx-auto font-black bg-white/80 border-2 border-slate-200 p-6 shadow-2xl uppercase italic">
              {t('home.products_subtitle')}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent h-16 w-16" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-slate-200 border-8 border-slate-200 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
              {categories.map((category) => (
                <Link key={category.id} to={`/products/${category.id}`} className="group relative bg-white/95 p-16 hover:bg-slate-900 transition-all duration-700 overflow-hidden">
                  <div className="relative z-10">
                    <div className="text-accent group-hover:text-white mb-10 transform group-hover:rotate-12 transition-transform duration-500">
                      {category.icon || <TestTube2 size={72} strokeWidth={1} />}
                    </div>
                    <h3 className="font-black text-3xl text-slate-900 group-hover:text-white mb-6 uppercase tracking-tight">{category.name[language]}</h3>
                    <p className="text-slate-600 group-hover:text-slate-300 text-lg leading-relaxed font-bold uppercase text-xs tracking-widest">{category.description[language]}</p>
                  </div>
                  {/* Petit rappel de formule en fond de carte au hover */}
                  <div className="absolute bottom-[-20px] right-[-20px] opacity-0 group-hover:opacity-10 transition-opacity">
                    <Binary size={150} color="white" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ======================= WHY US : FORMULES & TECHNIQUE ======================= */}
      <section className="relative py-32 overflow-hidden bg-white">
        {/* Filigrane : Formules chimiques et Recherche (Opacité 0.35) */}
        <WatermarkOverlay image={IMG_FORMULA_TECH} variant="dark" opacity={0.35} zIndex={1} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-6xl font-black mb-6 text-slate-900 uppercase tracking-tight italic">Protocoles SICAF</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {categories.slice(0, 4).map((_, index) => (
              <div key={index} className="p-12 bg-white/90 border-t-8 border-slate-900 shadow-2xl hover:-translate-y-4 transition-transform">
                <Activity className="h-10 w-10 text-accent mb-8" />
                <h3 className="font-black text-xl mb-4 uppercase">Batch Control {2024 + index}</h3>
                <p className="text-slate-600 font-bold text-xs tracking-[0.2em] uppercase">Rigueur de Laboratoire</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= CTA (CTD) : PRODUITS FINIS TOXIQUES/INDUSTRIELS ======================= */}
      <section className="relative py-60 bg-slate-900 text-white overflow-hidden border-t-8 border-accent">
        {/* Filigrane : Fûts industriels et produits finis (Opacité 0.55) */}
        <WatermarkOverlay image={IMG_INDUSTRIAL_DRUMS} variant="dark" opacity={0.55} zIndex={0} />
        
        <div className="absolute inset-0 z-[1] bg-slate-900/40" />
        
        {/* Logo SICAF 60px répétition (Opacité 0.40) */}
        <WatermarkOverlay image={LOGO_URL} variant="light" opacity={0.4} size={60} repeat='repeat' zIndex={2} />

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-6xl md:text-[11rem] font-black mb-20 tracking-tighter uppercase italic leading-[0.8] drop-shadow-[0_20px_20px_rgba(0,0,0,1)]">
            {language === 'fr' ? "Impact Industriel" : 'Industrial Impact'}
          </h2>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Link to="/quote">
              <Button size="lg" className="rounded-none bg-accent text-white hover:bg-white hover:text-slate-900 px-24 h-24 text-4xl font-black uppercase tracking-widest shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all">
                Lancer la Production
              </Button>
            </Link>
            <WhatsAppButton variant="hero" />
          </div>
          <div className="mt-24 text-accent font-black tracking-[1.5em] text-xs uppercase opacity-80">
            DANGER • HIGH QUALITY CHEMICALS • SICAF 2026
          </div>
        </div>
      </section>
    </Layout>
  );
}

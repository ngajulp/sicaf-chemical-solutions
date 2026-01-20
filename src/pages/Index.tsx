import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Shield, Award, Users, Truck, 
  Loader2, FlaskConical, Beaker, Microscope, 
  TestTube2, Atom, Factory, FileBadge2, Binary,
  Activity, Globe2, Gauge, Zap, ChevronRight // Ajouté ici
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WhatsAppButton from '@/components/WhatsAppButton';

// --- COMPOSANT DAMIER CORPORATE AVEC SCANLINE ---
const CorporateGrid: React.FC<{ variant: 'light' | 'dark', opacity?: number }> = ({ variant, opacity = 0.08 }) => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    {/* Effet Scanline (Laser de balayage technique) */}
    <div className="absolute inset-0 z-10 animate-scanline opacity-[0.2]" 
      style={{
        background: `linear-gradient(to bottom, transparent, ${variant === 'light' ? '#60A5FA' : '#3B82F6'} 50%, transparent)`,
        height: '120px',
        width: '100%',
      }} 
    />

    {/* Le Quadrillage (Grille de précision type papier millimétré) */}
    <div className="absolute inset-0" 
      style={{
        backgroundImage: `linear-gradient(${variant === 'light' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.12)'} 1px, transparent 1px), 
                          linear-gradient(90deg, ${variant === 'light' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.12)'} 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }}
    />
    
    {/* Micro-Filigranes Logo Sicaf (Style Damier Serré) */}
    <div className="absolute inset-0" 
      style={{
        backgroundImage: `url("https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/sicaf.png")`,
        backgroundSize: '65px', 
        backgroundRepeat: 'repeat',
        opacity: opacity,
        filter: variant === 'light' ? 'brightness(0) invert(1)' : 'grayscale(100%)',
      }}
    />
    
    {/* Texture d'images de laboratoire fragmentées (Subtil) */}
    <div className="absolute inset-0 opacity-[0.05]" 
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=400&q=80")`,
        backgroundSize: '350px 350px',
        backgroundRepeat: 'repeat',
        filter: 'grayscale(100%) contrast(140%)',
      }}
    />
  </div>
);

export default function Index() {
  const { language, t } = useLanguage();
  const { categories, loading } = useGitHubProducts();

  const stats = [
    { label: 'R&D Investment', value: '24%', icon: Activity },
    { label: 'Global Reach', value: '45+', icon: Globe2 },
    { label: 'Quality Control', value: '100%', icon: Gauge },
    { label: 'Innovation Patents', value: '120+', icon: FileBadge2 },
  ];

  return (
    <Layout>
      <WhatsAppButton variant="floating" />

      {/* ======================= HERO SECTION ======================= */}
      <section className="relative min-h-[95vh] flex items-center text-white overflow-hidden bg-[#020617]">
        <CorporateGrid variant="light" opacity={0.15} />
        
        {/* Overlay pour la lisibilité */}
        <div className="absolute inset-0 z-1 bg-gradient-to-r from-[#020617] via-[#020617]/40 to-transparent" />

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-3 px-4 py-2 border-l-4 border-primary bg-primary/10 mb-8 backdrop-blur-md">
              <Binary className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-blue-100">
                SICAF Chemical Solutions • Global R&D Unit
              </span>
            </div>
            
            <h1 className="text-6xl md:text-[10rem] font-black mb-8 uppercase tracking-tighter leading-[0.85] drop-shadow-2xl">
              {t('hero.title')}
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 mb-14 max-w-2xl font-light leading-relaxed border-l border-slate-700 pl-8">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/catalog">
                <Button size="lg" className="bg-white text-black hover:bg-primary hover:text-white px-14 h-20 text-xl rounded-none font-black uppercase tracking-widest transition-all">
                  {t('hero.cta')}
                </Button>
              </Link>
              <Link to="/quote">
                <Button size="lg" variant="outline" className="border-2 border-white/20 text-white hover:border-white px-14 h-20 text-xl rounded-none font-black uppercase tracking-widest backdrop-blur-sm">
                  {t('nav.quote')}
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= STATS SECTION ======================= */}
      <section className="relative py-16 bg-[#020617] border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-5 group border-r border-white/10 last:border-none">
                <div className="p-4 bg-primary/10 border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <stat.icon className="h-7 w-7" />
                </div>
                <div>
                  <div className="text-4xl font-black text-white tracking-tighter">{stat.value}</div>
                  <div className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= PRODUCT GRID SECTION ======================= */}
      <section className="relative py-32 bg-[#F1F5F9] overflow-hidden">
        <CorporateGrid variant="dark" opacity={0.05} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-8xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-8">
                {t('home.products_title')}
              </h2>
              <p className="text-xl text-slate-600 font-medium border-l-4 border-primary pl-8 italic">
                {t('home.products_subtitle')}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin h-12 w-12 text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-200 shadow-2xl">
              {categories.map((category) => (
                <Link key={category.id} to={`/products/${category.id}`} className="group relative bg-white border-r border-b border-slate-200 p-16 overflow-hidden transition-all hover:bg-[#020617] hover:z-10">
                  <div className="relative z-10">
                    <div className="text-primary group-hover:text-white transition-colors mb-10 transform group-hover:scale-110 duration-500">
                      {category.icon || <FlaskConical size={56} strokeWidth={1.5} />}
                    </div>
                    <h3 className="text-3xl font-black uppercase mb-6 text-slate-900 group-hover:text-white tracking-tighter leading-none">
                      {category.name[language]}
                    </h3>
                    <p className="text-slate-500 group-hover:text-slate-400 text-base leading-relaxed mb-10">
                      {category.description[language]}
                    </p>
                    <div className="flex items-center text-xs font-bold uppercase tracking-[0.2em] text-primary group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-2">
                      Technical Specs <ChevronRight size={16} className="ml-2" />
                    </div>
                  </div>
                  {/* Filigrane d'icône dynamique */}
                  <div className="absolute -bottom-6 -right-6 opacity-[0.03] text-slate-900 group-hover:text-white group-hover:opacity-[0.05] transition-all duration-700">
                     <Beaker size={200} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ======================= CTA SECTION ======================= */}
      <section className="relative py-48 bg-[#020617] text-white overflow-hidden">
        <CorporateGrid variant="light" opacity={0.25} />
        
        {/* Glow effect */}
        <div className="absolute inset-0 z-1 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-primary/20" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-flex justify-center items-center w-28 h-28 bg-white/5 border border-white/10 mb-14 rotate-45 group hover:rotate-90 transition-transform duration-700">
            <Zap className="h-14 w-14 text-primary -rotate-45" />
          </div>
          
          <h2 className="text-6xl md:text-9xl font-black mb-16 uppercase tracking-tighter leading-none italic">
            {language === 'fr' ? "L'Excellence Sans Limites" : 'Excellence Without Limits'}
          </h2>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <Link to="/quote">
              <Button size="lg" className="bg-primary hover:bg-white hover:text-black text-white px-24 h-24 text-3xl font-black rounded-none uppercase tracking-[0.2em] shadow-[0_0_70px_rgba(var(--primary-rgb),0.5)] transition-all transform hover:scale-105">
                {t('nav.quote')}
              </Button>
            </Link>
            <WhatsAppButton variant="hero" />
          </div>
          
          <div className="mt-24 text-[11px] font-bold text-slate-600 uppercase tracking-[0.8em] opacity-50">
            Certified • Industrial • Chemical • Global
          </div>
        </div>
      </section>

      <style>
        {`
          @keyframes scanline {
            0% { transform: translateY(-150%); }
            100% { transform: translateY(1000%); }
          }
          .animate-scanline {
            animation: scanline 10s linear infinite;
          }
          :root {
            --primary-rgb: 37, 99, 235;
          }
        `}
      </style>
    </Layout>
  );
}

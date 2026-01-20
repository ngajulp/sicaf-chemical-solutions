import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Shield, Award, Users, Truck, 
  Loader2, FlaskConical, Beaker, Microscope, 
  TestTube2, Atom, Factory, FileBadge2, Binary,
  Activity, Globe2, Gauge, Zap
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
    <div className="absolute inset-0 z-10 animate-scanline opacity-[0.15]" 
      style={{
        background: `linear-gradient(to bottom, transparent, ${variant === 'light' ? '#60A5FA' : '#0F172A'} 50%, transparent)`,
        height: '100px',
        width: '100%',
      }} 
    />

    {/* Le Quadrillage (Grille de précision) */}
    <div className="absolute inset-0" 
      style={{
        backgroundImage: `linear-gradient(${variant === 'light' ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.1)'} 1px, transparent 1px), 
                          linear-gradient(90deg, ${variant === 'light' ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.1)'} 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }}
    />
    
    {/* Micro-Filigranes Logo Sicaf (Répétition Damier) */}
    <div className="absolute inset-0" 
      style={{
        backgroundImage: `url("https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/sicaf.png")`,
        backgroundSize: '70px', 
        backgroundRepeat: 'repeat',
        opacity: opacity,
        filter: variant === 'light' ? 'brightness(0) invert(1)' : 'grayscale(100%)',
      }}
    />
    
    {/* Fragmentation d'images de laboratoire (Texture de fond) */}
    <div className="absolute inset-0 opacity-[0.04]" 
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=400&q=80")`,
        backgroundSize: '300px 300px',
        backgroundRepeat: 'repeat',
        filter: 'grayscale(100%) contrast(150%)',
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

      {/* ======================= HERO SECTION : LABO & SCANLINE ======================= */}
      <section className="relative min-h-[90vh] flex items-center text-white overflow-hidden bg-[#020617]">
        <CorporateGrid variant="light" opacity={0.15} />
        <div className="absolute inset-0 z-1 bg-gradient-to-r from-[#020617] via-[#020617]/40 to-transparent" />

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 border-l-4 border-primary bg-primary/10 mb-8">
              <Binary className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.5em] text-blue-100">
                SICAF Digital Laboratory System v2.0
              </span>
            </div>
            
            <h1 className="text-6xl md:text-9xl font-black mb-8 uppercase tracking-tighter leading-[0.9] drop-shadow-2xl">
              {t('hero.title')}
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl font-light leading-relaxed border-l border-slate-700 pl-8">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/catalog">
                <Button size="lg" className="bg-white text-black hover:bg-primary hover:text-white px-12 h-20 text-xl rounded-none font-black uppercase tracking-widest transition-all">
                  {t('hero.cta')}
                </Button>
              </Link>
              <Link to="/quote">
                <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:border-white px-12 h-20 text-xl rounded-none font-black uppercase tracking-widest">
                  {t('nav.quote')}
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= STATS : PERFORMANCE CORPORATE ======================= */}
      <section className="relative py-12 bg-[#020617] border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="p-3 bg-primary/10 rounded-none border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-3xl font-black text-white">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= PRODUCT CATEGORIES : MATÉRIAUX CHIMIQUES ======================= */}
      <section className="relative py-32 bg-[#F8FAFC] overflow-hidden">
        <CorporateGrid variant="dark" opacity={0.04} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-6">
                {t('home.products_title')}
              </h2>
              <p className="text-lg text-slate-600 font-medium border-l-4 border-primary pl-6">
                {t('home.products_subtitle')}
              </p>
            </div>
            <Link to="/catalog">
              <Button variant="link" className="text-primary font-black uppercase tracking-widest group">
                View Full Inventory <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin h-12 w-12 text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              {categories.map((category) => (
                <Link key={category.id} to={`/products/${category.id}`} className="group relative bg-white border border-slate-200 p-12 overflow-hidden transition-all hover:z-20 hover:shadow-2xl hover:scale-[1.02]">
                  <div className="relative z-10">
                    <div className="text-slate-300 group-hover:text-primary transition-colors mb-8">
                      {category.icon || <FlaskConical size={48} strokeWidth={1} />}
                    </div>
                    <h3 className="text-2xl font-black uppercase mb-4 text-slate-900 tracking-tight leading-none">
                      {category.name[language]}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8">
                      {category.description[language]}
                    </p>
                    <div className="flex items-center text-xs font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Documentation Technique <ChevronRight size={14} />
                    </div>
                  </div>
                  {/* Filigrane d'icône en fond de carte */}
                  <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                     <Beaker size={150} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ======================= TRUST LOGOS : RÉASSURANCE ======================= */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4">
          <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-12">Certified Industrial Compliance</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale">
             {/* Remplacez par vos logos partenaires/certifications réels */}
             <div className="font-black text-2xl italic tracking-tighter">ISO-9001</div>
             <div className="font-black text-2xl italic tracking-tighter">REACH</div>
             <div className="font-black text-2xl italic tracking-tighter">GMP-CERT</div>
             <div className="font-black text-2xl italic tracking-tighter">SGS-AUDITED</div>
          </div>
        </div>
      </section>

      {/* ======================= CTA SECTION : GLOBAL POWER ======================= */}
      <section className="relative py-48 bg-[#020617] text-white overflow-hidden">
        <CorporateGrid variant="light" opacity={0.2} />
        <div className="absolute inset-0 z-1 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-primary/30" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-flex justify-center items-center w-24 h-24 bg-white/5 border border-white/10 mb-12 animate-pulse">
            <Zap className="h-12 w-12 text-primary" />
          </div>
          
          <h2 className="text-5xl md:text-8xl font-black mb-12 uppercase tracking-tighter leading-none italic">
            {language === 'fr' ? "L'Excellence Sans Compromis" : 'Excellence Without Compromise'}
          </h2>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <Link to="/quote">
              <Button size="lg" className="bg-primary hover:bg-white hover:text-black text-white px-20 h-24 text-3xl font-black rounded-none uppercase tracking-[0.2em] shadow-[0_0_60px_rgba(var(--primary-rgb),0.5)] transition-all">
                {t('nav.quote')}
              </Button>
            </Link>
            <WhatsAppButton variant="hero" />
          </div>
          
          <div className="mt-20 text-[10px] font-bold text-slate-500 uppercase tracking-[0.5em]">
            Sicaf Chemical Industries • R&D Department • 2026 Internal Document
          </div>
        </div>
      </section>

      <style>
        {`
          @keyframes scanline {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(1000%); }
          }
          .animate-scanline {
            animation: scanline 8s linear infinite;
          }
          :root {
            --primary-rgb: 37, 99, 235; /* Bleu Primary */
          }
        `}
      </style>
    </Layout>
  );
}

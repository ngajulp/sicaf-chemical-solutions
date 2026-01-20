import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Microscope, Atom, Factory, Beaker, 
  ChevronRight, Binary, Activity, Globe2, Gauge, FileBadge2, Zap, FlaskConical 
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WhatsAppButton from '@/components/WhatsAppButton';

// Composant pour le motif technique répétitif (Logo Sicaf en filigrane)
const TechPattern: React.FC<{ variant: 'light' | 'dark' }> = ({ variant }) => (
  <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
    <div 
      className="absolute inset-0 opacity-[0.08]" 
      style={{
        backgroundImage: `url("https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/sicaf.png")`,
        backgroundSize: '100px', // Filigrane sicaf ajusté
        backgroundRepeat: 'repeat',
        filter: variant === 'light' ? 'brightness(0) invert(1)' : 'grayscale(100%)',
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

      {/* ======================= HERO SECTION (FRAGMENTÉE & SCANLINE) ======================= */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-white overflow-hidden bg-[#020617]">
        
        {/* Effet Scanline Laser */}
        <div className="absolute inset-0 z-[5] animate-scanline pointer-events-none opacity-20" 
             style={{ background: 'linear-gradient(to bottom, transparent, #3B82F6 50%, transparent)', height: '100px', width: '100%' }} />

        {/* IMAGE DE FOND : Fragmentation en maximum 10 carreaux (Damier) */}
        <div 
          className="absolute inset-0 z-0 opacity-40"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1581093588401-22d07cddf79b?auto=format&fit=crop&w=800&q=80')`,
            backgroundSize: '33.33% 50%', // Crée exactement 6 grands carreaux (3x2)
            backgroundRepeat: 'repeat',
            border: '1px solid rgba(255,255,255,0.05)'
          }}
        />
        
        {/* Overlay dégradé Corporate */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#020617] via-[#020617]/70 to-[#020617]" />
        
        <TechPattern variant="light" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none border border-blue-500/30 bg-blue-500/10 mb-8">
            <Binary className="h-4 w-4 text-blue-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Sicaf R&D Laboratory Unit</span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black mb-6 uppercase tracking-tighter leading-none">
            {t('hero.title')}
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100/70 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/catalog">
              <Button size="lg" className="bg-white text-[#020617] hover:bg-primary hover:text-white px-12 h-16 text-lg rounded-none uppercase font-black tracking-widest transition-all">
                {t('hero.cta')}
              </Button>
            </Link>
            <Link to="/quote">
              <Button size="lg" variant="outline" className="border-2 border-white/20 text-white hover:border-white px-12 h-16 text-lg rounded-none uppercase font-black tracking-widest backdrop-blur-sm">
                {t('nav.quote')}
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ======================= STATS SECTION ======================= */}
      <section className="relative py-16 bg-[#020617] border-y border-white/5 z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="p-3 bg-primary/10 border border-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-all">
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

      {/* ======================= PRODUCT GRID ======================= */}
      <section className="relative py-32 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mb-20">
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter mb-6">
              {t('home.products_title')}
            </h2>
            <p className="text-xl text-slate-600 border-l-4 border-primary pl-6 font-medium">
              {t('home.products_subtitle')}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin h-12 w-12 text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 shadow-2xl">
              {categories.map((category) => (
                <Link key={category.id} to={`/products/${category.id}`} className="group relative bg-white border border-slate-200 p-12 overflow-hidden transition-all hover:bg-[#020617] hover:z-20">
                  <div className="relative z-10">
                    <div className="text-primary group-hover:text-white transition-colors mb-8">
                      {category.icon || <FlaskConical size={48} strokeWidth={1} />}
                    </div>
                    <h3 className="text-2xl font-black uppercase mb-4 text-slate-900 group-hover:text-white tracking-tight">
                      {category.name[language]}
                    </h3>
                    <p className="text-slate-500 group-hover:text-slate-400 text-sm leading-relaxed mb-8">
                      {category.description[language]}
                    </p>
                    <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all">
                      Fiche Technique <ChevronRight size={14} className="ml-1" />
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 opacity-[0.03] text-slate-900 group-hover:text-white transition-opacity">
                     <Beaker size={150} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ======================= CTA SECTION (FRAGMENTÉE & SCANLINE) ======================= */}
      <section className="relative py-48 bg-[#020617] text-white overflow-hidden">
        
        {/* Scanline pour le CTA */}
        <div className="absolute inset-0 z-[5] animate-scanline pointer-events-none opacity-20" 
             style={{ background: 'linear-gradient(to bottom, transparent, #3B82F6 50%, transparent)', height: '100px', width: '100%' }} />

        {/* IMAGE DE FOND : Fragmentation 10 carreaux max (Grands carreaux industriels) */}
        <div 
          className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1565896311032-1334a90286b5?auto=format&fit=crop&w=600&q=80')`,
            backgroundSize: '25% 50%', // Crée exactement 8 grands carreaux (4x2)
            backgroundRepeat: 'repeat',
          }}
        />
        
        <TechPattern variant="light" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#020617] via-[#020617]/80 to-primary/20" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex justify-center gap-12 mb-12 opacity-40">
            <Atom className="h-14 w-14" />
            <Factory className="h-14 w-14" />
            <Beaker className="h-14 w-14" />
          </div>
          
          <h2 className="text-5xl md:text-8xl font-black mb-12 uppercase tracking-tighter italic">
            {language === 'fr' ? "L'Excellence Industrielle" : 'Industrial Excellence'}
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Link to="/quote">
              <Button size="lg" className="bg-primary hover:bg-white hover:text-black text-white px-16 h-20 text-2xl font-black rounded-none uppercase tracking-[0.2em] shadow-2xl transition-all transform hover:scale-105">
                {t('nav.quote')}
              </Button>
            </Link>
            <WhatsAppButton variant="hero" />
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
            animation: scanline 12s linear infinite;
          }
          :root {
            --primary-rgb: 37, 99, 235;
          }
        `}
      </style>
    </Layout>
  );
}

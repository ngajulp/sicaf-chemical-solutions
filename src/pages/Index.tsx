import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Award, Users, Truck, ChevronRight, Loader2, Microscope, 
  TestTube2, Factory, Activity, Gauge, Globe, FlaskRound, Beaker, 
  Database, FlaskConical, Droplets
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function Index() {
  const { language, t } = useLanguage();
  const { categories, loading } = useGitHubProducts();

  const LOGO_URL = "https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/sicaf.png";
  
  // IMAGERIE EXPLICITE - HAUTE DÉFINITION
  const IMG_HERO_ENGINEER = "https://images.unsplash.com/photo-1581093588401-22d07cddf79b?auto=format&fit=crop&w=2000&q=80"; // Ingénieur & Recherche
  const IMG_PRODUCTS_GLASS = "https://images.unsplash.com/photo-1603126738563-6a3ef5615f47?auto=format&fit=crop&w=2000&q=80"; // Verrerie & Chimie vivante
  const IMG_SCIENCE_ABSTRACT = "https://images.unsplash.com/photo-1532187863486-abf9d3a3522a?auto=format&fit=crop&w=2000&q=80"; // Science & Formules
  const IMG_CTA_LOGISTICS = "https://images.unsplash.com/photo-1624391976761-d51e1bd1fb46?auto=format&fit=crop&w=2000&q=80"; // Fûts & Produits finis

  return (
    <Layout>
      <WhatsAppButton variant="floating" />

      {/* ======================= HERO : INGÉNIEUR & RECHERCHE (Visibilité 0.55) ======================= */}
      <section className="relative min-h-[90vh] flex items-center text-white overflow-hidden bg-[#0F172A]">
        <div className="absolute inset-0 z-0">
          <img 
            src={IMG_HERO_ENGINEER} 
            className="w-full h-full object-cover opacity-55 grayscale-[20%]" 
            alt="Chemical Engineering Research"
          />
          {/* Overlay dégradé pour protéger le texte à gauche */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/70 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl border-l-8 border-accent pl-10">
            <h1 className="text-6xl md:text-[10rem] font-black leading-[0.8] uppercase tracking-tighter mb-8 drop-shadow-2xl">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-3xl font-bold text-slate-100 mb-12 max-w-2xl bg-black/30 backdrop-blur-md p-4 inline-block">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/catalog">
                <Button size="lg" className="h-20 px-12 bg-white text-black hover:bg-accent hover:text-white rounded-none font-black uppercase tracking-widest text-xl transition-all">
                  {t('hero.cta')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= STATS BANNER ======================= */}
      <section className="bg-white border-y-8 border-slate-100 py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Lab Analysis', val: 'Precision', icon: Microscope },
              { label: 'Chemical R&D', val: 'Global', icon: FlaskRound },
              { label: 'Safety Protocols', val: 'ISO 9001', icon: Shield },
              { label: 'Logistics', val: 'Full Scale', icon: Truck },
            ].map((s, i) => (
              <div key={i} className="flex flex-col border-l-4 border-accent pl-6">
                <s.icon className="h-6 w-6 text-accent mb-2" />
                <span className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{s.val}</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= PRODUITS : CHIMIE VIVANTE & BÉCHERS (Visibilité 0.50) ======================= */}
      <section className="relative py-32 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 z-0">
          <img 
            src={IMG_PRODUCTS_GLASS} 
            className="w-full h-full object-cover opacity-50" 
            alt="Chemical Reactions"
          />
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-8xl font-black mb-6 text-slate-900 uppercase tracking-tighter drop-shadow-sm">
              {t('home.products_title')}
            </h2>
            <div className="h-4 bg-accent w-48 mx-auto shadow-lg"></div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent h-16 w-16" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Link key={category.id} to={`/products/${category.id}`} className="group bg-white/95 p-12 border-b-8 border-slate-200 hover:border-accent hover:bg-slate-900 transition-all duration-500 shadow-2xl">
                  <div className="text-accent group-hover:text-white mb-8">
                    <Beaker size={56} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-black text-2xl text-slate-900 group-hover:text-white uppercase mb-4">{category.name[language]}</h3>
                  <p className="text-slate-600 group-hover:text-slate-400 font-bold text-sm tracking-wide">{category.description[language]}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ======================= POURQUOI NOUS : SCIENCE ABSTRAITE (Visibilité 0.40) ======================= */}
      <section className="relative py-32 overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <img src={IMG_SCIENCE_ABSTRACT} className="w-full h-full object-cover opacity-40 grayscale" alt="Science Formulas" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl font-black mb-16 text-slate-900 uppercase tracking-tight italic border-b-4 border-slate-900 inline-block">Science & Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-10 bg-white/90 backdrop-blur-md shadow-2xl border border-slate-100">
                <Database className="h-8 w-8 text-accent mb-6" />
                <h3 className="font-black text-xl mb-2 uppercase">Protocol {i}</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Advanced Formulation</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= CTA : LOGISTIQUE & PRODUITS FINIS (Visibilité 0.55) ======================= */}
      <section className="relative py-60 bg-[#0A0F1A] text-white overflow-hidden border-t-8 border-accent">
        <div className="absolute inset-0 z-0">
          <img 
            src={IMG_CTA_LOGISTICS} 
            className="w-full h-full object-cover opacity-55" 
            alt="Industrial Chemical Logistics"
          />
          {/* Overlay dégradé vertical pour l'impact */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1A] via-transparent to-[#0A0F1A]/80" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-6xl md:text-[11rem] font-black mb-16 tracking-tighter uppercase italic leading-[0.8] drop-shadow-[0_15px_15px_rgba(0,0,0,1)]">
            {language === 'fr' ? "Impact Industriel" : 'Industrial Impact'}
          </h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <Link to="/quote">
              <Button size="lg" className="h-24 px-20 bg-accent text-white hover:bg-white hover:text-slate-900 rounded-none text-3xl font-black uppercase tracking-widest shadow-2xl transition-all">
                Lancer la Production
              </Button>
            </Link>
            <WhatsAppButton variant="hero" />
          </div>
          <div className="mt-20 opacity-60 flex justify-center gap-12">
            <img src={LOGO_URL} alt="SICAF" className="h-12 invert" />
          </div>
        </div>
      </section>
    </Layout>
  );
}

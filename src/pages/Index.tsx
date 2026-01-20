import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Award, Users, Truck, Loader2, Microscope, TestTube2, Factory, Activity, Gauge, Globe, Beaker, Database } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import WhatsAppButton from '@/components/WhatsAppButton';

/** * COMPOSANT DE DÉCOR INDUSTRIEL UNIFIÉ 
 * Gère à la fois l'image de fond explicite et le motif de logo répétitif
 */
const SectionBackground = ({ image, opacity = 0.6, patternOpacity = 0.35, dark = true }) => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    {/* 1. L'Image Explicite (Ingénieur, Verrerie, etc.) */}
    <div className={`absolute inset-0 bg-cover bg-center grayscale contrast-125 ${dark ? 'brightness-50' : 'brightness-110'}`}
         style={{ backgroundImage: `url(${image})`, opacity }} />
    
    {/* 2. Le Filigrane Logo SICAF répétitif (80px) */}
    <div className="absolute inset-0" 
         style={{ 
           backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/sicaf.png')`,
           backgroundSize: '80px', backgroundRepeat: 'repeat', opacity: patternOpacity 
         }} />
    
    {/* 3. Overlay de contraste pour la lisibilité */}
    <div className={`absolute inset-0 ${dark ? 'bg-gradient-to-b from-black/60 to-black/20' : 'bg-white/60'}`} />
  </div>
);

export default function Index() {
  const { language, t } = useLanguage();
  const { categories, loading } = useGitHubProducts();

  const IMGS = {
    HERO: "https://images.unsplash.com/photo-1581093588401-22d07cddf79b?auto=format&fit=crop&w=2000&q=80", // Ingénieur
    PRODS: "https://images.unsplash.com/photo-1603126738563-6a3ef5615f47?auto=format&fit=crop&w=2000&q=80", // Verrerie/Béchers
    SCIENCE: "https://images.unsplash.com/photo-1532187863486-abf9d3a3522a?auto=format&fit=crop&w=2000&q=80", // Formules/Labo
    CTA: "https://images.unsplash.com/photo-1624391976761-d51e1bd1fb46?auto=format&fit=crop&w=2000&q=80" // Fûts/Toxique
  };

  return (
    <Layout>
      <WhatsAppButton variant="floating" />

      {/* HERO : INGÉNIEUR & CENTRE DE RECHERCHE */}
      <section className="relative py-44 md:py-64 text-white overflow-hidden bg-[#0A0F1A]">
        <SectionBackground image={IMGS.HERO} opacity={0.6} patternOpacity={0.4} />
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl border-l-8 border-accent pl-10">
            <h1 className="text-6xl md:text-[9rem] font-black leading-[0.8] uppercase tracking-tighter mb-10 drop-shadow-2xl italic">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-3xl font-black mb-12 bg-black/40 backdrop-blur-md p-4 border border-white/10 italic">
              {t('hero.subtitle')}
            </p>
            <Link to="/catalog">
              <Button className="h-20 px-12 bg-white text-black hover:bg-accent hover:text-white rounded-none font-black uppercase tracking-widest text-xl transition-all">Explorer</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* NOS PRODUITS : VERRERIE & SOLUTIONS CHIMIQUES */}
      <section className="relative py-32 bg-slate-50 overflow-hidden">
        <SectionBackground image={IMGS.PRODS} opacity={0.5} patternOpacity={0.15} dark={false} />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-6xl md:text-8xl font-black text-center text-slate-900 uppercase tracking-tighter mb-20 drop-shadow-md">
            {t('home.products_title')}
          </h2>
          {loading ? <div className="flex justify-center"><Loader2 className="animate-spin text-accent h-16 w-16" /></div> : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-8 border-white shadow-2xl">
              {categories.map((cat) => (
                <Link key={cat.id} to={`/products/${cat.id}`} className="group bg-white/90 p-16 hover:bg-slate-900 transition-all duration-500">
                  <Beaker size={64} className="text-accent group-hover:text-white mb-8" />
                  <h3 className="font-black text-3xl text-slate-900 group-hover:text-white uppercase mb-4">{cat.name[language]}</h3>
                  <p className="text-slate-600 group-hover:text-slate-400 font-bold italic">{cat.description[language]}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHY US : FORMULES & RECHERCHE APPLIQUÉE */}
      <section className="relative py-32 bg-white overflow-hidden">
        <SectionBackground image={IMGS.SCIENCE} opacity={0.4} patternOpacity={0.2} dark={false} />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl font-black mb-16 text-slate-900 uppercase tracking-tight italic bg-white p-4 inline-block shadow-lg">Expertise Scientifique</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-12 bg-white/90 backdrop-blur-md border-t-8 border-slate-900 shadow-2xl">
                <Database className="h-10 w-10 text-accent mb-6" />
                <h3 className="font-black text-xl mb-4 uppercase">Batch Protocol {i}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA : FÛTS INDUSTRIELS & PRODUITS FINIS TOXIQUES */}
      <section className="relative py-60 bg-[#0A0F1A] text-white overflow-hidden border-t-8 border-accent">
        <SectionBackground image={IMGS.CTA} opacity={0.65} patternOpacity={0.45} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-6xl md:text-[10rem] font-black uppercase tracking-tighter italic leading-[0.8] mb-16 drop-shadow-[0_20px_20px_rgba(0,0,0,1)]">
             Impact <br/> Industriel
          </h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <Link to="/quote">
              <Button className="h-24 px-20 bg-accent text-white hover:bg-white hover:text-black rounded-none text-3xl font-black uppercase tracking-widest shadow-2xl transition-all">Lancer la Production</Button>
            </Link>
            <WhatsAppButton variant="hero" />
          </div>
        </div>
      </section>
    </Layout>
  );
}

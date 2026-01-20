import React from 'react';
import { Target, Heart, Lightbulb, Leaf, Shield, Microscope, Globe, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';

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

const About = () => {
  const { t } = useLanguage();

  const LOGO_URL = "https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/sicaf.png";
  const IMG_LAB = "https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/industriechimie.png";
  const IMG_MOLECULE = "https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/produitschimique.png";

  const values = [
    { icon: Target, titleKey: 'about.value1', descKey: 'about.value1_desc' },
    { icon: Heart, titleKey: 'about.value2', descKey: 'about.value2_desc' },
    { icon: Lightbulb, titleKey: 'about.value3', descKey: 'about.value3_desc' },
    { icon: Leaf, titleKey: 'about.value4', descKey: 'about.value4_desc' },
  ];

  return (
    <Layout>
      {/* 1. HERO SECTION - Bordure orange réduite à 3px */}
      <section className="relative py-32 md:py-48 text-white overflow-hidden bg-slate-900 border-t-[3px] border-accent">
        <WatermarkOverlay image={IMG_LAB} variant="dark" opacity={0.4} zIndex={0} />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        <WatermarkOverlay image={LOGO_URL} variant="light" opacity={0.3} size={60} repeat='repeat' zIndex={2} />

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl border-l-[3px] border-accent pl-8 md:pl-16">
            <h1 className="text-5xl md:text-8xl font-black mb-6 leading-[0.85] uppercase tracking-tighter drop-shadow-2xl italic">
              {t('about.title')}
            </h1>
            <p className="text-lg md:text-2xl text-slate-200 max-w-2xl font-bold bg-slate-900/40 backdrop-blur-sm inline-block p-2 uppercase italic">
              {t('about.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* 2. HISTORY & MISSION - Bordures grille réduites à 1.5px */}
      <section className="relative py-24 bg-white border-t-[3px] border-accent">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-[1.5px] bg-slate-200 border-[1.5px] border-slate-200 shadow-xl">
            {/* History */}
            <div className="bg-white p-12 md:p-16">
              <h2 className="text-4xl font-black text-slate-900 mb-8 uppercase tracking-tighter italic border-l-[3px] border-accent pl-6">
                {t('about.history_title')}
              </h2>
              <p className="text-slate-600 leading-relaxed font-bold text-lg">
                {t('about.history')}
              </p>
            </div>

            {/* Mission */}
            <div className="bg-slate-900 p-12 md:p-16 text-white">
              <h2 className="text-4xl font-black text-accent mb-8 uppercase tracking-tighter italic border-l-[3px] border-accent pl-6">
                {t('about.mission_title')}
              </h2>
              <p className="text-slate-300 leading-relaxed font-bold text-lg">
                {t('about.mission')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VALUES */}
      <section className="relative py-32 overflow-hidden bg-slate-50 border-t-[3px] border-accent">
        <WatermarkOverlay image={IMG_MOLECULE} variant="dark" opacity={0.2} zIndex={1} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter italic">
              {t('about.values_title')}
            </h2>
            <div className="h-[2px] bg-accent w-32 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              /* Bordure basse réduite à 2.5px */
              <div key={index} className="p-10 bg-white border-b-[2.5px] border-accent shadow-xl transition-all hover:-translate-y-2 group">
                <div className="text-accent mb-8 group-hover:scale-110 transition-transform">
                  <value.icon className="h-14 w-14" strokeWidth={1.5} />
                </div>
                <h3 className="font-black text-xl text-slate-900 uppercase mb-4 tracking-tight">
                  {t(value.titleKey)}
                </h3>
                <p className="text-slate-600 font-bold leading-relaxed">
                  {t(value.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COMPANY STATS */}
      <section className="bg-slate-900 text-white border-t-[3px] border-accent border-b-[3px] border-accent py-20 relative overflow-hidden">
        <WatermarkOverlay image={LOGO_URL} variant="light" opacity={0.1} size={150} repeat="repeat" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { val: '20+', label: t('about.history_title').includes('Histoire') ? 'Années d\'expérience' : 'Years of Experience', icon: Shield },
              { val: '39', label: t('about.history_title').includes('Histoire') ? 'Produits chimiques' : 'Chemical Products', icon: Microscope },
              { val: '9', label: t('about.history_title').includes('Histoire') ? 'Catégories' : 'Categories', icon: Target },
              { val: '500+', label: t('about.history_title').includes('Histoire') ? 'Clients satisfaits' : 'Satisfied Clients', icon: Users },
            ].map((s, i) => (
              /* Bordure indicateur réduite à 2.5px */
              <div key={i} className="flex flex-col border-l-[2.5px] border-accent pl-8">
                <s.icon className="h-8 w-8 text-accent mb-4" />
                <span className="text-5xl font-black text-white tracking-tighter italic">{s.val}</span>
                <span className="text-xs uppercase tracking-widest text-slate-400 font-black mt-2">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;

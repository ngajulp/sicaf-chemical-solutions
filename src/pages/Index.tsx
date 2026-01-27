import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Users, Truck, Factory, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WhatsAppButton from '@/components/WhatsAppButton';

const Index = () => {
  const { t } = useLanguage();
  const [industryData, setIndustryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const features = [
    { icon: Shield, titleKey: 'home.quality', descKey: 'home.quality_desc' },
    { icon: Award, titleKey: 'home.expertise', descKey: 'home.expertise_desc' },
    { icon: Users, titleKey: 'home.service', descKey: 'home.service_desc' },
    { icon: Truck, titleKey: 'home.delivery', descKey: 'home.delivery_desc' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/productsindustries.json');
        const data = await response.json();
        setIndustryData(data);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  return (
    <Layout>
      <WhatsAppButton variant="floating" />

      {/* --- SECTION 1: HERO (Le look exact de sicaf.netlify.app) --- */}
      <section className="relative bg-black text-white min-h-screen flex items-center overflow-hidden">
        {/* Filigranes conservés selon votre demande */}
        <div 
          className="absolute inset-0 z-0 opacity-20 grayscale brightness-150 contrast-125"
          style={{ backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/labochimie.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-[1]" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-full">
            {/* Petit texte au dessus du titre */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[2px] w-12 bg-primary"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary">Industrie Chimique</span>
            </div>

            {/* Titre Massive : Aspect Identique au site de référence */}
            <h1 className="text-[14vw] md:text-[9vw] font-black uppercase italic leading-[0.75] tracking-tighter mb-12 select-none">
              {t('hero.title').split(' ')[0]} <br/>
              <span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.4)' }}>
                {t('hero.title').split(' ').slice(1).join(' ')}
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-slate-400 font-medium italic border-l-4 border-primary pl-8 max-w-2xl leading-tight mb-16">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/catalog">
                <Button className="bg-white text-black hover:bg-primary hover:text-white px-12 h-20 rounded-none font-black text-[11px] tracking-[0.4em] uppercase transition-all duration-300">
                  {t('hero.cta')}
                </Button>
              </Link>
              <Link to="/quote">
                <Button className="bg-primary text-white border-none px-12 h-20 rounded-none font-black text-[11px] tracking-[0.4em] uppercase hover:bg-white hover:text-black transition-all duration-300 shadow-[20px_20px_0px_rgba(255,255,255,0.05)]">
                  {t('nav.quote')} <ArrowRight className="ml-4 h-5 w-5" />
                </Button>
              </Link>      
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: SLIDER VIVANT (Mouvement continu) --- */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="px-6 mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h2 className="text-7xl md:text-[10vw] font-black text-black uppercase italic tracking-tighter leading-none">
              {t('home.products_title')}
            </h2>
            <div className="text-[10px] font-black tracking-[0.5em] text-primary mb-4 animate-pulse">
              DÉFILEMENT CONTINU •
            </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>
        ) : (
          <div className="relative w-full border-y-2 border-black">
            <div className="flex animate-scroll-horizontal gap-0 w-max hover:pause">
              {[...industryData, ...industryData, ...industryData].map((item, idx) => (
                <div key={`${item.ID}-${idx}`} className="w-[350px] md:w-[600px] border-r-2 border-black shrink-0">
                  <Link to={`/products/${item.ID}`} className="group block relative overflow-hidden h-[500px]">
                    <img 
                      src={item.img} 
                      alt={item.categorie} 
                      className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
                    
                    <div className="absolute bottom-0 left-0 p-10 w-full bg-gradient-to-t from-black to-transparent">
                      <p className="text-primary font-black text-xs tracking-widest mb-2 italic">DIV-0{item.ID}</p>
                      <h3 className="text-4xl font-black uppercase italic text-white tracking-tighter">
                        {item.categorie}
                      </h3>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* --- SECTION 3: FEATURES (Grille Brutaliste) --- */}
      <section className="bg-black py-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-t border-white/20">
            {features.map((feature, index) => (
              <div key={index} className="p-16 border-b border-r border-white/10 group hover:bg-primary transition-all duration-500">
                <feature.icon className="h-12 w-12 text-primary group-hover:text-white mb-10 transition-colors" />
                <h3 className="font-black uppercase italic text-lg mb-4 tracking-widest text-white">{t(feature.titleKey)}</h3>
                <p className="text-[10px] text-white/40 leading-relaxed uppercase font-bold tracking-widest group-hover:text-white/80">{t(feature.descKey)}</p>
              </div>
            ))}
        </div>
      </section>

      {/* --- SECTION 4: CTA (Grille de fond conservée) --- */}
      <section className="py-40 bg-white text-center relative overflow-hidden border-t-4 border-black">
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-6xl md:text-[10vw] font-black uppercase italic mb-16 tracking-tighter leading-[0.8] text-black">
            Besoin d'un <br/> <span className="text-primary border-b-[10px] border-black">Support</span> ?
          </h2>
          <Link to="/quote">
            <Button className="bg-black text-white font-black px-20 h-28 rounded-none hover:bg-primary transition-all text-xs tracking-[0.5em]">
              OBTENIR UNE COTATION TECHNIQUE
            </Button>
          </Link>
        </div>
        
        {/* GRILLE TECHNIQUE CONSERVÉE */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
           <div className="h-full w-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>
      </section>

      {/* CSS POUR L'ANIMATION SLIDE VIVANTE */}
      <style>{`
        @keyframes scroll-horizontal {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-33.33%)); }
        }
        .animate-scroll-horizontal { 
          animation: scroll-horizontal 30s linear infinite; 
        }
        .hover\\:pause:hover { 
          animation-play-state: paused; 
        }
      `}</style>
    </Layout>
  );
};

export default Index;

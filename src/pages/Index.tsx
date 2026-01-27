import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Users, Truck, Factory, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WhatsAppButton from '@/components/WhatsAppButton';

const Index = () => {
  const { language, t } = useLanguage();
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
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Layout>
      <WhatsAppButton variant="floating" />

      {/* --- 1. HERO SECTION (Filigrane conservé + Style SICAF) --- */}
      <section className="relative text-white min-h-[600px] md:min-h-[750px] flex items-center py-24 overflow-hidden bg-slate-900">
        {/* FILIGRANE LABORATOIRE CONSERVÉ */}
        <div 
          className="absolute inset-0 z-0 opacity-20 grayscale brightness-125 scale-105 pointer-events-none"
          style={{
            backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/labochimie.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent z-1" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-3 bg-primary/20 text-secondary px-5 py-2 border-l-4 border-secondary mb-10">
              <span className="text-[11px] font-black uppercase tracking-[0.4em]">Expertise Chimique Industrielle</span>
            </div>

            <h1 className="text-7xl md:text-[120px] font-black mb-8 uppercase italic tracking-tighter leading-[0.8] drop-shadow-2xl">
              {t('hero.title').split(' ')[0]} <br/>
              <span className="text-white/30">{t('hero.title').split(' ').slice(1).join(' ')}</span>
            </h1>

            <p className="text-xl md:text-3xl text-slate-300 font-medium italic border-l-4 border-primary pl-10 max-w-3xl leading-relaxed mb-14">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/catalog">
                <Button className="bg-white text-slate-900 hover:bg-secondary hover:text-white font-black px-14 h-20 rounded-none shadow-2xl transition-all uppercase tracking-widest text-xs">
                  {t('hero.cta')}
                </Button>
              </Link>
              <Link to="/quote">
                <Button className="bg-primary text-white font-black px-14 h-20 rounded-none shadow-2xl hover:bg-white hover:text-primary transition-all uppercase tracking-widest text-xs">
                  {t('nav.quote')} <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>      
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. SECTION PRODUITS (Animation de slide continue) --- */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-4 mb-20">
            <div className="flex items-center gap-4 mb-4">
               <div className="h-1 w-20 bg-primary" />
               <p className="text-xs font-black uppercase tracking-[0.5em] text-primary">Secteurs Stratégiques</p>
            </div>
            <h2 className="text-5xl md:text-8xl font-black text-slate-900 uppercase italic tracking-tighter">
              {t('home.products_title')}
            </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>
        ) : (
          <div className="relative w-full group">
            {/* Le mouvement de slide rend la page "vivante" */}
            <div className="flex animate-scroll-horizontal gap-12 w-max py-10 px-4">
              {[...industryData, ...industryData].map((item, idx) => (
                <div key={`${item.ID}-${idx}`} className="w-[400px] md:w-[550px] shrink-0">
                  <Link to={`/products/${item.ID}`} className="group/card block">
                    <Card className="border-none shadow-[0_40px_80px_rgba(0,0,0,0.08)] rounded-none overflow-hidden bg-slate-50 transition-all duration-700">
                      <div className="relative h-[400px] overflow-hidden">
                        <img 
                          src={item.img} 
                          alt={item.categorie} 
                          className="w-full h-full object-cover grayscale brightness-90 group-hover/card:grayscale-0 group-hover/card:scale-110 transition-all duration-[1.5s]" 
                        />
                        <div className="absolute top-0 right-0 bg-slate-950 text-white px-6 py-4 text-xs font-black uppercase tracking-widest">
                            ID-{item.ID}
                        </div>
                      </div>

                      <CardContent className="p-12">
                        <h3 className="text-4xl font-black uppercase italic text-slate-900 group-hover/card:text-primary transition-colors tracking-tighter mb-6">
                          {item.categorie}
                        </h3>
                        <p className="text-base text-slate-500 line-clamp-2 italic mb-10 font-medium border-l-2 border-primary/30 pl-6">
                          {item.expertise}
                        </p>
                        <div className="flex items-center justify-between pt-8 border-t border-slate-200">
                          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover/card:text-primary transition-colors">Explorer la division</span>
                          <ArrowRight className="h-6 w-6 text-secondary transform group-hover/card:translate-x-4 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* --- 3. FEATURES (Style Grille Industrielle) --- */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-slate-200 border border-slate-200 shadow-2xl">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-14 text-center group hover:bg-slate-950 transition-colors duration-500">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 text-primary mb-8 rounded-none group-hover:bg-primary group-hover:text-white transition-all">
                      <feature.icon className="h-10 w-10" />
                  </div>
                  <h3 className="font-black uppercase italic text-base mb-4 tracking-widest text-slate-900 group-hover:text-white">{t(feature.titleKey)}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed uppercase font-bold tracking-tight group-hover:text-slate-500">{t(feature.descKey)}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* --- 4. CTA FINAL (Filigrane Grille Conservé) --- */}
      <section className="py-40 bg-slate-950 text-white text-center relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-6xl md:text-[110px] font-black uppercase italic mb-14 tracking-tighter leading-[0.85]">
            Besoin d'un <br/> <span className="text-secondary underline decoration-[15px] underline-offset-[15px]">Support</span> Technique ?
          </h2>
          <p className="text-slate-400 mb-16 max-w-3xl mx-auto font-medium text-xl italic leading-relaxed">
            Nos ingénieurs vous accompagnent dans le choix de vos solutions chimiques et l'optimisation de vos processus.
          </p>
          <Link to="/quote">
            <Button className="bg-white text-slate-900 font-black px-20 h-24 rounded-none hover:bg-secondary hover:text-white transition-all text-sm tracking-[0.4em] shadow-2xl">
              OBTENIR UNE COTATION TECHNIQUE
            </Button>
          </Link>
        </div>
        
        {/* GRILLE TECHNIQUE EN FOND CONSERVÉE */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
           <div className="h-full w-full bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:70px_70px]" />
        </div>
      </section>

      <style>{`
        @keyframes scroll-horizontal {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 3rem)); }
        }
        .animate-scroll-horizontal { 
          animation: scroll-horizontal 70s linear infinite; 
        }
        .animate-scroll-horizontal:hover { 
          animation-play-state: paused; 
        }
      `}</style>
    </Layout>
  );
};

export default Index;

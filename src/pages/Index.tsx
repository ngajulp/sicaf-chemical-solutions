import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Users, Truck, ChevronRight, Loader2, Factory } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WhatsAppButton from '@/components/WhatsAppButton';

interface IndustryItem {
  ID: number;
  categorie: string;
  products: string[];
  expertise: string;
  description: string;
  img: string;
}

const Index = () => {
  const { language, t } = useLanguage();
  const [industryData, setIndustryData] = useState<IndustryItem[]>([]);
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
        console.error("Erreur chargement industryData:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Layout>
      <WhatsAppButton variant="floating" />

      {/* --- 1. HERO SECTION UNIFORMISÉE --- */}
      <section className="relative text-white min-h-[500px] md:min-h-[650px] flex items-center py-24 overflow-hidden bg-slate-900">
        {/* Fond : Filigrane Laboratoire (Identique au Catalogue) */}
        <div 
          className="absolute inset-0 z-0 opacity-25 grayscale brightness-125 scale-105 pointer-events-none"
          style={{
            backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/labochimie.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Overlay : Dégradé profond pour la signature visuelle */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent z-1" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            {/* Badge de marque */}
            <div className="inline-flex items-center gap-3 bg-primary/20 text-secondary px-4 py-2 border-l-4 border-secondary mb-8 animate-in slide-in-from-left-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Expertise Chimique Industrielle</span>
            </div>

            {/* Titre : Typographie massive uniformisée */}
            <h1 className="text-6xl md:text-8xl font-black mb-8 uppercase italic tracking-tighter leading-[0.9] drop-shadow-2xl">
              {t('hero.title').split(' ')[0]} <br/>
              <span className="text-primary-foreground/40">{t('hero.title').split(' ').slice(1).join(' ')}</span>
            </h1>

            {/* Accroche : Style bordure gauche */}
            <p className="text-xl md:text-2xl text-slate-300 font-medium italic border-l-4 border-primary pl-8 max-w-2xl leading-relaxed mb-12">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link to="/catalog">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-secondary hover:text-white font-black px-12 h-16 rounded-none shadow-2xl transition-all uppercase tracking-widest text-xs">
                  {t('hero.cta')}
                </Button>
              </Link>
              <Link to="/quote">
                <Button size="lg" className="bg-primary text-white font-black px-12 h-16 rounded-none shadow-2xl hover:bg-white hover:text-primary transition-all uppercase tracking-widest text-xs">
                  {t('nav.quote')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>      
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. CARROUSEL DES DIVISIONS --- */}
      <section className="py-24 bg-white overflow-hidden border-b border-slate-100">
        <div className="container mx-auto px-4 mb-16">
            <div className="flex items-center gap-4 mb-4">
               <div className="h-px w-12 bg-primary" />
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Secteurs Stratégiques</p>
            </div>
            <h2 className="font-heading text-4xl md:text-6xl font-black text-slate-900 uppercase italic tracking-tighter">
              {t('home.products_title')}
            </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
        ) : (
          <div className="relative w-full">
            <div className="flex animate-scroll-horizontal gap-10 w-max py-6 px-4">
              {[...industryData, ...industryData].map((item, idx) => (
                <div key={`${item.ID}-${idx}`} className="w-[380px] md:w-[500px] shrink-0">
                  <Link to={`/products/${item.ID}`} className="group block">
                    <Card className="border-none shadow-[0_30px_60px_rgba(0,0,0,0.06)] rounded-none overflow-hidden bg-slate-50 group-hover:bg-white transition-colors duration-500">
                      <div className="relative h-80 overflow-hidden">
                        <img 
                          src={item.img || "https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/industriechimie.png"} 
                          alt={item.categorie} 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" 
                        />
                        <div className="absolute top-0 right-0 bg-slate-900 text-white px-5 py-3 text-[10px] font-black uppercase tracking-widest">
                            <Factory className="h-4 w-4 mb-1" />
                            ID-{item.ID}
                        </div>
                      </div>

                      <CardContent className="p-10">
                        <h3 className="text-3xl font-black uppercase italic text-slate-900 group-hover:text-primary transition-colors tracking-tighter mb-4">
                          {item.categorie}
                        </h3>
                        <p className="text-sm text-slate-500 line-clamp-2 italic mb-8 font-medium border-l-2 border-primary/30 pl-4">
                          {item.expertise}
                        </p>
                        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-primary transition-colors">Explorer la division</span>
                          <ArrowRight className="h-5 w-5 text-secondary transform group-hover:translate-x-2 transition-transform" />
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

      {/* --- 3. FEATURES (Uniformisées avec le style industriel) --- */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-slate-200 border border-slate-200 shadow-2xl">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-12 text-center group hover:bg-slate-900 transition-colors duration-500">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 text-primary mb-8 rounded-none group-hover:bg-primary group-hover:text-white transition-all">
                      <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-black uppercase italic text-sm mb-4 tracking-widest group-hover:text-white">{t(feature.titleKey)}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed uppercase font-bold tracking-tight group-hover:text-slate-500">{t(feature.descKey)}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* --- 4. CTA FINAL (Lisibilité maximale) --- */}
      <section className="py-32 bg-slate-950 text-white text-center relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl md:text-8xl font-black uppercase italic mb-12 tracking-tighter leading-none">
            Besoin d'un <span className="text-secondary underline decoration-[12px] underline-offset-[12px]">Support</span> Technique ?
          </h2>
          <p className="text-slate-400 mb-12 max-w-2xl mx-auto font-medium text-lg italic">
            Nos ingénieurs vous accompagnent dans le choix de vos solutions chimiques et l'optimisation de vos processus.
          </p>
          <Link to="/quote">
            <Button size="lg" className="bg-white text-slate-900 font-black px-16 h-20 rounded-none hover:bg-secondary hover:text-white transition-all text-sm tracking-[0.3em] shadow-2xl">
              OBTENIR UNE COTATION TECHNIQUE
            </Button>
          </Link>
        </div>
        {/* Grille technique en fond */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
           <div className="h-full w-full bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>
      </section>

      {/* STYLE POUR LE CARROUSEL */}
      <style>{`
        @keyframes scroll-horizontal {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 2.5rem)); }
        }
        .animate-scroll-horizontal { 
          animation: scroll-horizontal 60s linear infinite; 
        }
        .animate-scroll-horizontal:hover { 
          animation-play-state: paused; 
        }
      `}</style>
    </Layout>
  );
};

export default Index;

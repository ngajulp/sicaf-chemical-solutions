import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Users, Truck, ChevronRight, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WhatsAppButton from '@/components/WhatsAppButton';

// Interface correspondant à votre JSON (Tableau d'objets)
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

  // Chargement des données depuis le JSON GitHub
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

      {/* --- 1. HERO SECTION --- */}
      <section className="gradient-hero text-primary-foreground py-24 md:py-36 relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-20 pointer-events-none grayscale"
          style={{
            backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/labochimie.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="font-heading text-5xl md:text-7xl font-black mb-8 uppercase tracking-tighter italic leading-none">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-12 italic max-w-3xl mx-auto font-medium">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link to="/catalog">
                <Button size="lg" className="bg-white text-primary hover:bg-secondary hover:text-white font-black px-12 h-16 rounded-none shadow-2xl transition-all uppercase tracking-widest text-xs">
                  {t('hero.cta')}
                </Button>
              </Link>
              <Link to="/quote">
                <Button size="lg" className="bg-slate-900 text-white font-black px-12 h-16 rounded-none shadow-2xl hover:bg-primary transition-all uppercase tracking-widest text-xs">
                  {t('nav.quote')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>      
            </div>
        </div>
        
        {/* Séparateur SVG stylisé */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden z-10">
          <svg className="relative w-full h-12 md:h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" className="fill-background" />
          </svg>
        </div>
      </section>

      {/* --- 2. CARROUSEL DES DIVISIONS (BASÉ SUR LE JSON) --- */}
      <section className="py-24 bg-background overflow-hidden">
        <div className="container mx-auto px-4 mb-16 text-center">
            <h2 className="font-heading text-4xl md:text-5xl font-black text-foreground mb-4 uppercase italic tracking-tighter">
              {t('home.products_title')}
            </h2>
            <div className="h-2 w-20 bg-secondary mx-auto mb-2 shadow-sm" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Expertise Industrielle SICAF</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
        ) : (
          <div className="relative w-full">
            <div className="flex animate-scroll-horizontal gap-8 w-max py-6">
              {/* On duplique les données pour un effet de défilement infini fluide */}
              {[...industryData, ...industryData].map((item, idx) => (
                <div key={`${item.ID}-${idx}`} className="w-[340px] md:w-[450px] shrink-0">
                  <Link to={`/products/${item.ID}`} className="group block">
                    <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-none overflow-hidden bg-white">
                      <div className="relative h-80 overflow-hidden bg-slate-100">
                        <img 
                          src={item.img && item.img !== "" ? item.img : "https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/industriechimie.png"} 
                          alt={item.categorie} 
                          className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/industriechimie.png'; }}
                        />
                        <div className="absolute top-0 right-0 bg-slate-900 text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest">
                           Division {item.ID}
                        </div>
                        <div className="absolute bottom-0 left-0 bg-secondary text-secondary-foreground px-6 py-2 text-[11px] font-black uppercase tracking-tighter shadow-lg">
                          {item.products.length} RÉFÉRENCES
                        </div>
                      </div>

                      <CardContent className="p-10">
                        <h3 className="text-3xl font-black uppercase italic text-slate-900 group-hover:text-primary transition-colors leading-none mb-4 tracking-tighter">
                          {item.categorie}
                        </h3>
                        <p className="text-sm text-slate-500 line-clamp-2 italic mb-8 font-medium border-l-2 border-slate-100 pl-4">
                          {item.expertise}
                        </p>
                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary group-hover:tracking-[0.4em] transition-all">Voir la fiche technique</span>
                          <div className="h-8 w-8 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                             <ChevronRight className="h-4 w-4" />
                          </div>
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

      {/* --- 3. FEATURES (QUALITÉ & SERVICE) --- */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-10 shadow-sm border border-slate-100 text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-50 text-primary mb-8 rounded-full">
                      <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-black uppercase italic text-sm mb-4 tracking-widest">{t(feature.titleKey)}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed uppercase font-bold tracking-tight">{t(feature.descKey)}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* --- 4. CTA FINAL --- */}
      <section className="py-32 bg-slate-900 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-secondary opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic mb-12 tracking-tighter leading-none">
            Besoin d'un <span className="text-secondary underline decoration-4 underline-offset-8">Support</span> Technique ?
          </h2>
          <Link to="/quote">
            <Button size="lg" className="bg-white text-slate-900 font-black px-16 h-18 rounded-none hover:bg-secondary hover:text-white transition-all text-xs tracking-[0.3em] shadow-2xl">
              DEMANDER UNE COTATION
            </Button>
          </Link>
        </div>
        {/* Motif de fond discret */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
           <div className="h-full w-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>
      </section>

      {/* STYLE POUR L'ANIMATION DU CARROUSEL */}
      <style>{`
        @keyframes scroll-horizontal {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 2rem)); }
        }
        .animate-scroll-horizontal { 
          animation: scroll-horizontal 45s linear infinite; 
        }
        .animate-scroll-horizontal:hover { 
          animation-play-state: paused; 
        }
      `}</style>
    </Layout>
  );
};

export default Index;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Users, Truck, ChevronRight, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WhatsAppButton from '@/components/WhatsAppButton';

// Interface pour le JSON des industries
interface IndustryData {
  [key: string]: {
    products: string[];
    img?: string; // Champ image crucial
    expertise: { fr: string; en: string; };
  };
}

const Index = () => {
  const { language, t } = useLanguage();
  const { categories, loading: catLoading } = useGitHubProducts();
  
  const [industryData, setIndustryData] = useState<IndustryData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  const features = [
    { icon: Shield, titleKey: 'home.quality', descKey: 'home.quality_desc' },
    { icon: Award, titleKey: 'home.expertise', descKey: 'home.expertise_desc' },
    { icon: Users, titleKey: 'home.service', descKey: 'home.service_desc' },
    { icon: Truck, titleKey: 'home.delivery', descKey: 'home.delivery_desc' },
  ];

  // 1. Récupération des données du JSON sur GitHub
  useEffect(() => {
    const fetchIndustryData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/productsindustries.json');
        const data = await response.json();
        setIndustryData(data);
      } catch (error) {
        console.error("Erreur chargement industryData:", error);
      } finally {
        setDataLoading(false);
      }
    };
    fetchIndustryData();
  }, []);

  // Filtrer pour n'afficher que les catégories présentes dans le JSON
  const displayCategories = categories.filter(cat => industryData && industryData[cat.id]);

  return (
    <Layout>
      <WhatsAppButton variant="floating" />

      {/* --- 1. HERO SECTION --- */}
      <section className="gradient-hero text-primary-foreground py-20 md:py-32 relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-20 pointer-events-none grayscale"
          style={{
            backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/labochimie.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="font-heading text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter italic">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-10 italic max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/catalog">
                <Button size="lg" className="bg-white text-primary hover:bg-secondary hover:text-white font-black px-10 h-16 rounded-none shadow-2xl">
                  {t('hero.cta')}
                </Button>
              </Link>
              <Link to="/quote">
                <Button size="lg" className="bg-accent text-accent-foreground font-black px-10 h-16 rounded-none shadow-2xl">
                  {t('nav.quote')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>      
            </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden z-10">
          <svg className="relative w-full h-12 md:h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" className="fill-background" />
          </svg>
        </div>
      </section>

      {/* --- 2. CARROUSEL SYNCHRONISÉ SUR LE JSON --- */}
      <section className="py-24 bg-background overflow-hidden">
        <div className="container mx-auto px-4 mb-16 text-center">
            <h2 className="font-heading text-4xl md:text-5xl font-black text-foreground mb-4 uppercase italic tracking-tighter">
              {t('home.products_title')}
            </h2>
            <div className="h-1.5 w-24 bg-secondary mx-auto" />
        </div>

        {catLoading || dataLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
        ) : (
          <div className="relative w-full">
            <div className="flex animate-scroll-horizontal gap-8 w-max py-4">
              {[...displayCategories, ...displayCategories].map((category, idx) => {
                
                // --- LOGIQUE D'IMAGE : PRIORITÉ AU JSON ---
                const industryInfo = industryData?.[category.id];
                const cardImage = industryInfo?.img && industryInfo.img.trim() !== "" 
                    ? industryInfo.img 
                    : category.img; // Fallback vers l'image du catalogue général si vide

                return (
                  <div key={`${category.id}-${idx}`} className="w-[320px] md:w-[400px] shrink-0">
                    <Link to={`/products/${category.id}`} className="group block">
                      <Card className="border-none shadow-2xl rounded-none overflow-hidden bg-white">
                        <div className="relative h-72 overflow-hidden bg-slate-100">
                          <img 
                            src={cardImage} 
                            alt={category.name[language]} 
                            className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/industriechimie.png'; }}
                          />
                          <div className="absolute top-4 left-4 bg-accent text-accent-foreground p-3 text-2xl shadow-xl">
                            {category.icon}
                          </div>
                          <div className="absolute bottom-0 left-0 bg-primary text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest">
                            {industryInfo?.products.length || 0} RÉFÉRENCES
                          </div>
                        </div>

                        <CardContent className="p-8">
                          <h3 className="text-2xl font-black uppercase italic text-slate-900 group-hover:text-primary transition-colors leading-none mb-4">
                            {category.name[language]}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 italic mb-6">
                            {industryInfo?.expertise[language]}
                          </p>
                          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Consulter la fiche</span>
                            <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* --- 3. SECTIONS QUALITÉ & CTA --- */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 shadow-lg text-center border-b-4 border-transparent hover:border-primary transition-all">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/5 text-primary mb-6">
                    <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-black uppercase italic text-sm mb-2">{t(feature.titleKey)}</h3>
                <p className="text-xs text-muted-foreground">{t(feature.descKey)}</p>
              </div>
            ))}
        </div>
      </section>

      <section className="py-24 bg-slate-900 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black uppercase italic mb-10 tracking-tighter">
            Prêt à optimiser votre <span className="text-secondary">Supply Chain</span> ?
          </h2>
          <Link to="/quote">
            <Button size="lg" className="bg-secondary text-secondary-foreground font-black px-12 h-16 rounded-none hover:bg-white transition-all">
              DEMANDER UN DEVIS PROFORMA
            </Button>
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes scroll-horizontal {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 1rem)); }
        }
        .animate-scroll-horizontal { animation: scroll-horizontal 35s linear infinite; }
        .animate-scroll-horizontal:hover { animation-play-state: paused; }
      `}</style>
    </Layout>
  );
};

export default Index;

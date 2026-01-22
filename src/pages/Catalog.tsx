import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Loader2, Beaker, Factory, ShieldCheck, Microscope } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Interface alignée sur votre JSON GitHub
interface IndustryItem {
  ID: number;
  categorie: string;
  products: string[];
  expertise: string;
  description: string;
  img: string;
}

const Catalog = () => {
  const { language, t } = useLanguage();
  const [industries, setIndustries] = useState<IndustryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/productsindustries.json');
        const data = await response.json();
        setIndustries(data);
      } catch (error) {
        console.error("Erreur catalogue:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  return (
    <Layout>
      {/* 1. HERO SECTION - VISION GLOBALE */}
      <section className="relative text-white min-h-[450px] flex items-center py-24 overflow-hidden bg-slate-900">
        <div 
          className="absolute inset-0 z-0 opacity-30 grayscale brightness-125"
          style={{
            backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/labochimie.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-1" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-none mb-6 border-l-4 border-secondary">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Normes Internationales Certifiées</span>
            </div>
            <h1 className="font-heading text-6xl md:text-8xl font-black mb-6 uppercase italic tracking-tighter leading-none">
              {language === 'fr' ? 'Portfolio' : 'Portfolio'} <br/>
              <span className="text-primary-foreground/50">Industriel</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-medium italic max-w-2xl leading-relaxed">
              Explorez nos divisions spécialisées et accédez aux fiches techniques de nos solutions chimiques.
            </p>
          </div>
        </div>
      </section>

      {/* 2. GRILLE DES DIVISIONS INDUSTRIELLES */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">
                Nos Domaines d'Intervention
              </h2>
              <div className="h-1.5 w-20 bg-primary mt-4" />
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-right">
              {industries.length} Divisions Spécialisées <br/> 
              Sourcing International & Distribution
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
              <p className="mt-4 font-black uppercase tracking-[0.3em] text-slate-400">Synchronisation Catalogue...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {industries.map((item) => (
                <Link key={item.ID} to={`/products/${item.ID}`} className="group">
                  <Card className="border-none shadow-[0_30px_60px_rgba(0,0,0,0.05)] rounded-none overflow-hidden hover:shadow-[0_40px_90px_rgba(0,0,0,0.12)] transition-all duration-700 bg-slate-50">
                    <div className="flex flex-col md:flex-row">
                      {/* Image à gauche */}
                      <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden bg-slate-200">
                        <img 
                          src={item.img || 'https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/industriechimie.png'} 
                          alt={item.categorie} 
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                        />
                        <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors" />
                        <div className="absolute top-4 left-4 bg-slate-900 text-white p-3">
                           <Factory className="h-5 w-5" />
                        </div>
                      </div>

                      {/* Contenu à droite */}
                      <CardContent className="md:w-3/5 p-10 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <span className="h-px w-8 bg-secondary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Division {item.ID}</span>
                          </div>
                          <h3 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900 mb-4 group-hover:text-primary transition-colors">
                            {item.categorie}
                          </h3>
                          <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 italic">
                            {item.description}
                          </p>
                        </div>

                        <div className="space-y-4">
                           <div className="flex flex-wrap gap-2">
                             {item.products.slice(0, 3).map((prod, i) => (
                               <span key={i} className="text-[9px] bg-white border border-slate-200 px-2 py-1 font-bold uppercase text-slate-400">
                                 {prod}
                               </span>
                             ))}
                             {item.products.length > 3 && (
                               <span className="text-[9px] font-bold text-primary italic">+{item.products.length - 3} autres</span>
                             )}
                           </div>
                           
                           <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2">
                               Explorer la gamme <ChevronRight className="h-4 w-4 text-secondary" />
                             </span>
                           </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. SECTION RÉASSURANCE / BUREAU TECHNIQUE */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
         <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="md:w-1/2">
               <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none mb-8">
                 Besoin d'un sourcing <br/> <span className="text-secondary">sur-mesure</span> ?
               </h2>
               <p className="text-slate-400 text-lg mb-10 max-w-lg leading-relaxed font-medium">
                 Notre bureau technique collabore avec les plus grands laboratoires mondiaux pour sourcer des molécules spécifiques non listées dans ce catalogue.
               </p>
               <Link to="/contact">
                 <Button className="bg-white text-slate-900 hover:bg-secondary hover:text-white font-black px-10 h-16 rounded-none transition-all uppercase tracking-widest text-xs">
                   Consulter nos ingénieurs
                 </Button>
               </Link>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
               <div className="bg-white/5 p-8 border border-white/10 text-center">
                  <Beaker className="h-10 w-10 text-secondary mx-auto mb-4" />
                  <p className="text-2xl font-black">99.9%</p>
                  <p className="text-[9px] uppercase font-bold tracking-widest text-slate-500">Pureté Garantie</p>
               </div>
               <div className="bg-white/5 p-8 border border-white/10 text-center mt-8">
                  <Microscope className="h-10 w-10 text-secondary mx-auto mb-4" />
                  <p className="text-2xl font-black">ISO</p>
                  <p className="text-[9px] uppercase font-bold tracking-widest text-slate-500">Certifications</p>
               </div>
            </div>
         </div>
      </section>
    </Layout>
  );
};

export default Catalog;

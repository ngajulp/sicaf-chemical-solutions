import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ChevronRight, Beaker, Zap, ShieldCheck, Factory, Truck, Loader2, ImageOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

// Interface pour le fichier productsindustries.json
interface IndustryData {
  [key: string]: {
    products: string[];
    img?: string; // Image spécifique à la catégorie
    expertise: {
      fr: string;
      en: string;
    };
  };
}

const ProductCategory = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { language } = useLanguage();
  const { loading: categoriesLoading, getCategoryById } = useGitHubProducts();
  
  const [industryData, setIndustryData] = useState<IndustryData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  // URL de l'image par défaut si le champ img est vide ou invalide
  const DEFAULT_HERO_IMAGE = "https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/industriechimie.png";

  useEffect(() => {
    const fetchIndustryData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/productsindustries.json');
        const data = await response.json();
        setIndustryData(data);
      } catch (error) {
        console.error("Erreur lors du chargement des capacités industrielles:", error);
      } finally {
        setDataLoading(false);
      }
    };
    fetchIndustryData();
  }, []);

  const category = getCategoryById(categoryId || '');
  const divisionInfo = industryData && categoryId ? industryData[categoryId] : null;

  // Image à afficher (Priorité au JSON, sinon défaut)
  const heroImage = divisionInfo?.img && divisionInfo.img.trim() !== "" 
    ? divisionInfo.img 
    : DEFAULT_HERO_IMAGE;

  if (categoriesLoading || dataLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Synchronisation des données industrielles...</p>
        </div>
      </Layout>
    );
  }

  if (!category || !divisionInfo) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <ImageOff className="h-16 w-16 text-slate-300 mx-auto mb-6" />
          <h1 className="text-2xl font-black uppercase mb-6 tracking-tighter">Division technique non synchronisée</h1>
          <p className="text-slate-500 mb-8">L'identifiant "{categoryId}" n'a pas été trouvé dans le répertoire des capacités.</p>
          <Link to="/"><Button className="font-bold uppercase tracking-widest">Retour au tableau de bord</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* 1. HERO SECTION DYNAMIQUE (Image provenant du JSON) */}
      <section className="relative text-white py-24 min-h-[500px] flex items-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            className="w-full h-full object-cover opacity-40 grayscale-[50%] transition-opacity duration-1000"
            alt={`SICAF - ${category.name[language]}`}
            onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_HERO_IMAGE; }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/70 to-transparent z-10" />

        <div className="container mx-auto px-4 relative z-20">
          <Link to="/" className="inline-flex items-center gap-2 text-secondary font-black text-[10px] uppercase tracking-[0.4em] mb-12 group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-2 transition-transform" />
            Portefeuille de Solutions
          </Link>
          
          <div className="flex items-center gap-6 mb-6">
            <span className="text-7xl md:text-9xl drop-shadow-2xl filter brightness-110">{category.icon}</span>
            <div className="h-24 w-1.5 bg-secondary shadow-[0_0_15px_rgba(241,196,15,0.5)]" />
          </div>
          
          <h1 className="font-heading text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.85] mb-6">
            {category.name[language]}
          </h1>
          <div className="max-w-2xl border-l-4 border-secondary/50 pl-6 backdrop-blur-sm bg-black/10 py-4">
            <p className="text-xl md:text-2xl text-blue-50 font-medium italic">
                {category.description[language]}
            </p>
          </div>
        </div>
      </section>

      {/* 2. CAPACITÉS ET PRODUITS (Synchronisés avec productsindustries.json) */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Colonne Gauche : Expertise Sectorielle */}
            <div className="lg:col-span-4 space-y-12">
              <div className="space-y-6">
                <div className="inline-block bg-primary/5 px-4 py-1 border-l-4 border-primary">
                    <h3 className="font-black uppercase text-xs tracking-[0.3em] text-primary">Mission Technique</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-xl font-medium italic">
                  "{divisionInfo.expertise[language]}"
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-5 p-6 bg-slate-50 border-r-4 border-slate-200 hover:border-primary transition-all group">
                  <div className="bg-white p-3 shadow-sm group-hover:text-primary transition-colors">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="font-black text-[10px] uppercase tracking-widest text-slate-400">Qualité</p>
                    <p className="font-bold text-sm text-slate-800">Standards ISO & Certifications</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 p-6 bg-slate-50 border-r-4 border-slate-200 hover:border-secondary transition-all group">
                  <div className="bg-white p-3 shadow-sm group-hover:text-secondary transition-colors">
                    <Truck className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="font-black text-[10px] uppercase tracking-widest text-slate-400">Logistique</p>
                    <p className="font-bold text-sm text-slate-800">Chaîne d'approvisionnement sécurisée</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne Droite : Catalogue Exhaustif */}
            <div className="lg:col-span-8">
              <div className="bg-white border-2 border-slate-50 p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden">
                <div className="absolute -top-10 -right-10 opacity-[0.03]">
                  <Factory className="h-64 w-64" />
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-slate-100 pb-8 gap-4 relative z-10">
                  <div>
                    <h3 className="font-black uppercase text-3xl tracking-tighter italic text-slate-900">Références Disponibles</h3>
                    <p className="text-[11px] font-bold text-primary uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                        <span className="h-2 w-2 bg-primary animate-pulse rounded-full" />
                        Capacités de production & Stock permanent
                    </p>
                  </div>
                  <div className="bg-slate-900 text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest">
                    {divisionInfo.products.length} Produits Répertoriés
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1 relative z-10">
                  {divisionInfo.products.map((product, idx) => (
                    <div key={idx} className="flex items-center justify-between py-5 border-b border-slate-50 group hover:bg-slate-50/50 px-4 transition-all cursor-default">
                      <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                            {idx + 1}
                        </div>
                        <span className="font-black text-slate-700 uppercase text-xs tracking-tight group-hover:text-primary transition-colors">
                          {product}
                        </span>
                      </div>
                      <Link to="/quote" className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <div className="bg-primary text-white p-2">
                            <ChevronRight className="h-4 w-4" />
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="mt-12 p-8 bg-slate-900 text-white flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
                   <div className="text-center lg:text-left">
                     <p className="font-black uppercase tracking-[0.3em] text-secondary text-[11px] mb-2">Service d'approvisionnement</p>
                     <p className="text-sm font-light text-slate-400 max-w-md">
                       Vous avez besoin d'un grade spécifique ou d'une fiche technique (TDS/MSDS) ? Nos ingénieurs vous répondent sous 24h.
                     </p>
                   </div>
                   <Link to="/quote">
                      <Button className="bg-white text-slate-900 font-black uppercase tracking-widest text-xs px-10 h-14 hover:bg-secondary transition-all rounded-none shadow-xl">
                        Demander un devis
                      </Button>
                   </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FOOTER CTA */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10 text-white">
          <h2 className="text-4xl md:text-7xl font-black uppercase italic mb-8 tracking-tighter leading-none">
            VOTRE PARTENAIRE <br/> <span className="text-secondary">CHIMIQUE</span> EN AFRIQUE
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-6 mt-12">
            <Link to="/quote">
                <Button size="lg" className="h-16 px-12 bg-white text-primary hover:bg-secondary hover:text-white font-black uppercase tracking-widest transition-all">
                    Lancer une consultation <Zap className="ml-3 h-5 w-5 fill-current" />
                </Button>
            </Link>
            <Link to="/contact">
                <Button size="lg" variant="outline" className="h-16 px-12 border-2 border-white text-white hover:bg-white hover:text-primary font-black uppercase tracking-widest transition-all">
                    Parler à un expert
                </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductCategory;

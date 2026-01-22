import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ChevronRight, ShieldCheck, Factory, Truck, Loader2, ImageOff, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

// Interface correspondant exactement à votre fichier JSON
interface IndustryItem {
  ID: number;
  categorie: string;
  products: string[];
  expertise: string;
  description: string;
  img: string;
}

const ProductCategory = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { language } = useLanguage();
  
  const [industryData, setIndustryData] = useState<IndustryItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // URL de l'image par défaut si le champ img est vide
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
  }, [categoryId]);

  // Recherche de l'élément correspondant à l'ID passé dans l'URL
  const divisionInfo = industryData.find(item => item.ID === Number(categoryId));

  // Gestion du chargement
  if (dataLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Accès au répertoire technique...</p>
        </div>
      </Layout>
    );
  }

  // Gestion de l'erreur (ID non trouvé)
  if (!divisionInfo) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <ImageOff className="h-16 w-16 text-slate-300 mx-auto mb-6" />
          <h1 className="text-2xl font-black uppercase mb-6 tracking-tighter">Division non référencée</h1>
          <p className="text-slate-500 mb-8">L'identifiant technique "{categoryId}" est introuvable ou en cours de mise à jour.</p>
          <Link to="/"><Button className="font-bold uppercase tracking-widest rounded-none px-8">Retour au catalogue</Button></Link>
        </div>
      </Layout>
    );
  }

  // Image à afficher (Priorité au JSON, sinon défaut)
  const heroImage = divisionInfo.img && divisionInfo.img.trim() !== "" 
    ? divisionInfo.img 
    : DEFAULT_HERO_IMAGE;

  return (
    <Layout>
      {/* 1. HERO SECTION DYNAMIQUE */}
      <section className="relative text-white py-24 min-h-[500px] flex items-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            className="w-full h-full object-cover opacity-40 grayscale-[30%] transition-transform duration-[5000ms] hover:scale-110"
            alt={`SICAF - ${divisionInfo.categorie}`}
            onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_HERO_IMAGE; }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10" />

        <div className="container mx-auto px-4 relative z-20">
          <Link to="/" className="inline-flex items-center gap-2 text-secondary font-black text-[10px] uppercase tracking-[0.4em] mb-12 group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-2 transition-transform" />
            Portefeuille de Solutions
          </Link>
          
          <div className="flex items-center gap-6 mb-6">
             <div className="h-20 w-1.5 bg-secondary shadow-[0_0_20px_rgba(241,196,15,0.6)]" />
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">Division Industrielle n°{divisionInfo.ID}</span>
          </div>
          
          <h1 className="font-heading text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85] mb-8">
            {divisionInfo.categorie}
          </h1>
          
          <div className="max-w-2xl border-l-4 border-white/20 pl-6 backdrop-blur-md bg-white/5 py-6">
            <p className="text-xl md:text-2xl text-blue-50 font-medium italic leading-relaxed">
                {divisionInfo.expertise}
            </p>
          </div>
        </div>
      </section>

      {/* 2. CONTENU TECHNIQUE & CATALOGUE */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Colonne Gauche : Description Sectorielle */}
            <div className="lg:col-span-4 space-y-12">
              <div className="space-y-6">
                <div className="inline-block bg-primary/5 px-4 py-1 border-l-4 border-primary">
                    <h3 className="font-black uppercase text-xs tracking-[0.3em] text-primary">Présentation</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg font-medium">
                  {divisionInfo.description || "SICAF s'engage à fournir des intrants de haute performance, rigoureusement sélectionnés pour répondre aux standards de l'industrie chimique et aux besoins spécifiques des marchés africains."}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-5 p-6 bg-slate-50 border-r-4 border-slate-200 hover:border-primary transition-all group">
                  <div className="bg-white p-3 shadow-sm group-hover:text-primary transition-colors">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="font-black text-[10px] uppercase tracking-widest text-slate-400">Certifications</p>
                    <p className="font-bold text-sm text-slate-800">Conformité Grade Industriel</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 p-6 bg-slate-50 border-r-4 border-slate-200 hover:border-secondary transition-all group">
                  <div className="bg-white p-3 shadow-sm group-hover:text-secondary transition-colors">
                    <Truck className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="font-black text-[10px] uppercase tracking-widest text-slate-400">Logistique</p>
                    <p className="font-bold text-sm text-slate-800">Transport Sécurisé ADR</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne Droite : Liste des Produits du JSON */}
            <div className="lg:col-span-8">
              <div className="bg-white border-2 border-slate-50 p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.05)] relative overflow-hidden">
                <div className="absolute -top-10 -right-10 opacity-[0.03]">
                  <Factory className="h-64 w-64" />
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-slate-100 pb-8 gap-4 relative z-10">
                  <div>
                    <h3 className="font-black uppercase text-3xl tracking-tighter italic text-slate-900">Produits Référencés</h3>
                    <p className="text-[11px] font-bold text-primary uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                        <span className="h-2 w-2 bg-primary animate-pulse rounded-full" />
                        Disponibilité immédiate / Flux tendu
                    </p>
                  </div>
                  <div className="bg-slate-900 text-white px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em]">
                    {divisionInfo.products.length} RÉFÉRENCES
                  </div>
                </div>

                {/* Grille des produits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 relative z-10">
                  {divisionInfo.products.map((product, idx) => (
                    <div key={idx} className="flex items-center justify-between py-5 border-b border-slate-50 group hover:bg-slate-50 px-4 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                            {idx + 1}
                        </div>
                        <span className="font-black text-slate-800 uppercase text-xs tracking-tight group-hover:text-primary transition-colors">
                          {product}
                        </span>
                      </div>
                      <Link to="/quote">
                         <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </Link>
                    </div>
                  ))}
                </div>

                {/* CTA Interne */}
                <div className="mt-12 p-8 bg-slate-900 text-white flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
                   <div className="text-center lg:text-left">
                     <p className="font-black uppercase tracking-[0.3em] text-secondary text-[11px] mb-2">Service Commercial</p>
                     <p className="text-sm font-light text-slate-400 max-w-md">
                       Besoin d'un conditionnement spécifique (IBC, fûts, sacs) ? <br/>Nos équipes logistiques optimisent vos coûts.
                     </p>
                   </div>
                   <Link to="/quote">
                      <Button className="bg-white text-slate-900 font-black uppercase tracking-widest text-xs px-10 h-14 hover:bg-secondary hover:text-white transition-all rounded-none shadow-xl border-none">
                        Obtenir un devis
                      </Button>
                   </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SECTION PARTENAIRE */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:30px_30px]" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10 text-white">
          <h2 className="text-4xl md:text-7xl font-black uppercase italic mb-8 tracking-tighter">
            PROXIMITÉ & <span className="text-secondary">RÉACTIVITÉ</span>
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-6 mt-12">
            <Link to="/quote">
                <Button size="lg" className="h-16 px-12 bg-white text-primary hover:bg-secondary hover:text-white font-black uppercase tracking-widest transition-all rounded-none">
                    Lancer une consultation <Zap className="ml-3 h-5 w-5 fill-current" />
                </Button>
            </Link>
            <Link to="/contact">
                <Button size="lg" variant="outline" className="h-16 px-12 border-2 border-white text-white hover:bg-white hover:text-primary font-black uppercase tracking-widest transition-all rounded-none">
                    Expert Technique
                </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductCategory;

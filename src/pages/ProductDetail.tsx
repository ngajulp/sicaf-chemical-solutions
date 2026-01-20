import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Package, Loader2, ArrowRight, ShieldCheck, Beaker } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Composant Watermark pour l'aspect industriel
const WatermarkOverlay: React.FC<{
  image: string;
  opacity?: number;
  size?: string | number;
  variant?: 'light' | 'dark'; 
}> = ({ image, opacity = 0.1, size = 'cover', variant = 'dark' }) => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `url(${image})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: size,
      opacity,
      filter: variant === 'light' ? 'brightness(0) invert(1)' : 'grayscale(100%)',
    } as React.CSSProperties}
  />
);

const ProductDetail = () => {
  const { categoryId, reference } = useParams<{ categoryId: string; reference: string }>();
  const { t, language } = useLanguage();
  const { loading, getProductsByCategory, getCategoryById } = useGitHubProducts();

  const category = getCategoryById(categoryId || '');
  const products = getProductsByCategory(categoryId || '');
  const product = products.find(p => p.reference === reference);

  const IMG_LAB = "https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/industriechimie.png";

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <Loader2 className="h-16 w-16 animate-spin text-accent mx-auto" />
        </div>
      </Layout>
    );
  }

  if (!product || !category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl font-black uppercase italic text-slate-900 mb-8">
            {language === 'fr' ? 'Produit non répertorié' : 'Product not found'}
          </h1>
          <Link to="/catalog">
            <Button className="rounded-none bg-slate-900 h-14 px-8 font-black uppercase tracking-widest">
              {t('common.back_to_catalog')}
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* 1. HERO / HEADER PRODUIT */}
      <section className="relative pt-32 pb-20 text-white bg-slate-900 border-t-8 border-accent">
        <WatermarkOverlay image={product.img || IMG_LAB} opacity={0.3} variant="dark" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent" />
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl border-l-8 border-accent pl-8 md:pl-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-accent text-slate-900 font-black px-3 py-1 uppercase text-sm tracking-tighter">
                {category.name[language]}
              </span>
              <span className="text-slate-400 font-mono tracking-widest uppercase text-sm">
                ID: {product.reference}
              </span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black mb-4 uppercase tracking-tighter italic leading-none">
              {product.name[language]}
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-bold uppercase italic max-w-2xl">
              {product.applications[language].split('.')[0]}.
            </p>
          </div>
        </div>
      </section>

      {/* 2. NAVIGATION BREADCRUMB (Brutaliste) */}
      <nav className="bg-white border-b-4 border-slate-900 py-4 overflow-x-auto">
        <div className="container mx-auto px-4 flex items-center gap-4 text-xs font-black uppercase tracking-widest whitespace-nowrap">
          <Link to="/" className="text-slate-400 hover:text-accent transition-colors">ACCUEIL</Link>
          <ArrowRight size={14} className="text-slate-300" />
          <Link to="/catalog" className="text-slate-400 hover:text-accent transition-colors">CATALOGUE</Link>
          <ArrowRight size={14} className="text-slate-300" />
          <Link to={`/products/${categoryId}`} className="text-slate-400 hover:text-accent transition-colors">{category.name[language]}</Link>
          <ArrowRight size={14} className="text-slate-300" />
          <span className="text-slate-900">{product.reference}</span>
        </div>
      </nav>

      {/* 3. CONTENU TECHNIQUE */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Colonne Image (4/12) */}
            <div className="lg:col-span-5">
              <div className="sticky top-32">
                <div className="bg-white border-4 border-slate-900 p-2 shadow-[12px_12px_0px_0px_rgba(251,146,60,1)]">
                  {product.img ? (
                    <img 
                      src={product.img} 
                      alt={product.name[language]}
                      className="w-full h-[500px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  ) : (
                    <div className="w-full h-[500px] bg-slate-100 flex items-center justify-center">
                      <Package className="h-32 w-32 text-slate-200" />
                    </div>
                  )}
                  <div className="bg-slate-900 text-white p-4 mt-2 flex justify-between items-center">
                    <span className="font-black uppercase tracking-widest text-xs">Aperçu technique</span>
                    <ShieldCheck className="text-accent" />
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne Infos (7/12) */}
            <div className="lg:col-span-7 space-y-10">
              {/* SPECIFICATIONS BOX */}
              <div className="border-l-8 border-accent pl-8 space-y-4">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                  <Beaker size={18} className="text-accent" />
                  {language === 'fr' ? 'Propriétés Physiques' : 'Physical Properties'}
                </h3>
                <div className="bg-white border-2 border-slate-900 p-8">
                  <span className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">
                    {product.specifications}
                  </span>
                </div>
              </div>

              {/* APPLICATIONS BOX */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">
                  {language === 'fr' ? 'Champs d\'Application' : 'Field of Applications'}
                </h3>
                <div className="prose prose-slate max-w-none">
                  <p className="text-xl text-slate-700 font-bold leading-relaxed border-2 border-dashed border-slate-200 p-8 bg-white italic">
                    {product.applications[language]}
                  </p>
                </div>
              </div>

              {/* CTA AREA */}
              <div className="grid sm:grid-cols-2 gap-4 pt-8">
                <Link to="/quote">
                  <Button className="w-full h-20 rounded-none bg-accent hover:bg-slate-900 text-slate-900 hover:text-white font-black uppercase tracking-widest text-lg transition-all border-b-4 border-slate-900">
                    DEMANDER UN DEVIS
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </Link>
                {product.pdf && (
                  <a href={product.pdf} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full h-20 rounded-none border-4 border-slate-900 bg-white hover:bg-slate-100 font-black uppercase tracking-widest text-lg transition-all">
                      <FileText className="mr-3 h-6 w-6" />
                      FICHE TECHNIQUE (PDF)
                    </Button>
                  </a>
                )}
              </div>

              {/* INFO SÉCURITÉ */}
              <div className="bg-slate-900 text-white p-6 flex items-start gap-6 border-t-4 border-accent">
                <div className="bg-accent/20 p-3">
                  <ShieldCheck className="text-accent h-8 w-8" />
                </div>
                <div>
                  <h4 className="font-black uppercase text-sm tracking-widest mb-1">Qualité SICAF Certifiée</h4>
                  <p className="text-xs text-slate-400 font-bold leading-snug">
                    Chaque lot de {product.name[language]} subit des tests rigoureux en laboratoire avant expédition pour garantir une conformité totale aux normes industrielles internationales.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER NAVIGATION */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-24 py-12 border-t-4 border-slate-900 gap-6">
            <Link to={`/products/${categoryId}`}>
              <Button variant="ghost" className="rounded-none font-black uppercase tracking-widest gap-3 hover:text-accent">
                <ArrowLeft className="h-5 w-5" />
                RETOUR À {category.name[language]}
              </Button>
            </Link>
            <Link to="/catalog">
              <span className="text-slate-300 font-black italic text-4xl hidden md:block">SICAF SOLUTIONS</span>
            </Link>
            <Link to="/catalog">
              <Button variant="outline" className="rounded-none border-2 border-slate-900 font-black uppercase tracking-widest">
                VOIR TOUT LE CATALOGUE
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;

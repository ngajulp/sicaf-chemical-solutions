import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Package, Loader2, ArrowRight, ShieldCheck, Beaker } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

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
          <h1 className="text-4xl font-black uppercase italic text-slate-900 mb-8 tracking-tighter">
            {language === 'fr' ? 'Produit non répertorié' : 'Product not found'}
          </h1>
          <Link to="/catalog">
            <Button className="rounded-none bg-slate-900 h-14 px-8 font-black uppercase tracking-widest border-b-[3px] border-accent">
              {t('common.back_to_catalog')}
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* 1. HERO HEADER - Bordure accentuée 3px */}
      <section className="relative pt-32 pb-20 text-white bg-slate-900 border-t-[3px] border-accent">
        <WatermarkOverlay image={product.img || IMG_LAB} opacity={0.3} variant="dark" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent" />
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl border-l-[3px] border-accent pl-8 md:pl-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-accent text-slate-900 font-black px-3 py-0.5 uppercase text-[10px] tracking-wider border border-slate-900">
                {category.name[language]}
              </span>
              <span className="text-slate-400 font-mono tracking-widest uppercase text-[10px]">
                REF: {product.reference}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-4 uppercase tracking-tighter italic leading-[0.9]">
              {product.name[language]}
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-bold uppercase italic max-w-2xl bg-slate-800/40 p-2 inline-block">
              {product.applications[language].split('.')[0]}.
            </p>
          </div>
        </div>
      </section>

      {/* 2. BREADCRUMB - Bordure fine 1.5px */}
      <nav className="bg-white border-b-[1.5px] border-slate-100 py-4 overflow-x-auto">
        <div className="container mx-auto px-4 flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
          <Link to="/" className="text-slate-400 hover:text-accent transition-colors">ACCUEIL</Link>
          <ArrowRight size={10} className="text-slate-300" />
          <Link to="/catalog" className="text-slate-400 hover:text-accent transition-colors">CATALOGUE</Link>
          <ArrowRight size={10} className="text-slate-300" />
          <Link to={`/products/${categoryId}`} className="text-slate-400 hover:text-accent transition-colors">{category.name[language]}</Link>
          <ArrowRight size={10} className="text-slate-300" />
          <span className="text-slate-900">{product.reference}</span>
        </div>
      </nav>

      {/* 3. TECHNICAL CONTENT */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Image Column - Shadow orange 4px */}
            <div className="lg:col-span-5">
              <div className="sticky top-32">
                <div className="bg-white border-[1.5px] border-slate-900 p-1.5 shadow-[5px_5px_0px_0px_rgba(251,146,60,1)]">
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
                  <div className="bg-slate-900 text-white p-4 mt-1.5 flex justify-between items-center">
                    <span className="font-black uppercase tracking-widest text-[10px]">Document Technique</span>
                    <ShieldCheck className="text-accent h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Info Column */}
            <div className="lg:col-span-7 space-y-10">
              {/* Properties Box */}
              <div className="border-l-[3px] border-accent pl-8 space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                  <Beaker size={14} className="text-accent" />
                  {language === 'fr' ? 'Spécifications Physiques' : 'Physical Specifications'}
                </h3>
                <div className="bg-white border-[1.5px] border-slate-900 p-8 shadow-sm">
                  <span className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter block">
                    {product.specifications}
                  </span>
                </div>
              </div>

              {/* Applications Box */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  {language === 'fr' ? 'Champs d\'Application' : 'Field of Applications'}
                </h3>
                <div className="prose prose-slate max-w-none">
                  <p className="text-lg text-slate-700 font-bold leading-relaxed border-[1.5px] border-dashed border-slate-300 p-8 bg-white italic">
                    {product.applications[language]}
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="grid sm:grid-cols-2 gap-4 pt-8">
                <Link to="/quote">
                  <Button className="w-full h-16 rounded-none bg-accent hover:bg-slate-900 text-slate-900 hover:text-white font-black uppercase tracking-widest text-sm transition-all border-none">
                    DEMANDER UN DEVIS
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
                </Link>
                {product.pdf && (
                  <a href={product.pdf} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full h-16 rounded-none border-[2px] border-slate-900 bg-white hover:bg-slate-100 font-black uppercase tracking-widest text-sm transition-all">
                      <FileText className="mr-3 h-5 w-5" />
                      FICHE PDF
                    </Button>
                  </a>
                )}
              </div>

              {/* Safety/Quality Badge - Bordure accent 3px */}
              <div className="bg-slate-900 text-white p-6 flex items-start gap-6 border-t-[3px] border-accent">
                <div className="bg-accent/10 p-3 border border-accent/20">
                  <ShieldCheck className="text-accent h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-black uppercase text-[10px] tracking-widest mb-1 text-accent">Contrôle Qualité SICAF</h4>
                  <p className="text-xs text-slate-400 font-bold leading-snug">
                    Chaque expédition de {product.name[language]} est accompagnée d'un certificat d'analyse (COA) garantissant le respect strict de nos tolérances de fabrication.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-24 py-8 border-t-[1.5px] border-slate-200 gap-6">
            <Link to={`/products/${categoryId}`}>
              <Button variant="ghost" className="rounded-none font-black uppercase tracking-widest text-[9px] gap-3 hover:text-accent">
                <ArrowLeft className="h-4 w-4" />
                RETOUR À LA CATÉGORIE
              </Button>
            </Link>
            <div className="text-slate-200 font-black italic text-2xl hidden md:block tracking-tighter opacity-50 uppercase">
              Sicaf Chemical Solutions
            </div>
            <Link to="/catalog">
              <Button variant="outline" className="rounded-none border-[1.5px] border-slate-900 font-black uppercase tracking-widest text-[9px] hover:bg-slate-900 hover:text-white transition-all px-6">
                CONSULTER TOUT LE CATALOGUE
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;

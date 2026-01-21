import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Package, ChevronRight, Beaker, Zap, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ProductCategory = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { t, language } = useLanguage();
  const { loading, getProductsByCategory, getCategoryById } = useGitHubProducts();

  const category = getCategoryById(categoryId || '');
  const products = getProductsByCategory(categoryId || '');

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <div className="relative inline-block">
            <Beaker className="h-16 w-16 text-primary animate-pulse" />
            <div className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-black uppercase italic mb-6">Catégorie introuvable</h1>
          <Link to="/catalog">
            <Button className="font-bold uppercase tracking-widest">{t('common.back_to_catalog')}</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* 1. LARGE HERO SECTION */}
      <section className="relative text-white min-h-[400px] flex items-center py-24 overflow-hidden bg-slate-900">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80" 
            className="w-full h-full object-cover opacity-40 grayscale"
            alt="Industrial background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <Link to="/catalog" className="inline-flex items-center gap-2 text-secondary font-black uppercase text-xs tracking-[0.3em] mb-8 group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-2 transition-transform" />
              {t('common.back_to_catalog')}
            </Link>
            <div className="flex items-center gap-6 mb-4">
              <span className="text-5xl md:text-7xl drop-shadow-lg">{category.icon}</span>
              <div className="h-20 w-1 bg-secondary" />
            </div>
            <h1 className="font-heading text-5xl md:text-8xl font-black mb-6 uppercase italic tracking-tighter leading-none">
              {category.name[language]}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 font-medium italic max-w-xl border-l-4 border-white/20 pl-6">
              Solutions chimiques hautes performances pour vos besoins industriels.
            </p>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT LISTING WITH WATERMARK */}
      <section className="py-20 md:py-32 bg-white relative">
        
        {/* FILIGRANE LABO - Positionné pour être visible sur le côté */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/labochimie.png')`,
            backgroundSize: '1000px',
            backgroundPosition: 'left -10% center', 
            backgroundRepeat: 'no-repeat',
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-2">
              <h3 className="font-black uppercase text-sm tracking-[0.4em] text-primary">Inventaire</h3>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                {products.length} Produits disponibles dans cette catégorie
              </p>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <Zap className="h-3 w-3 text-secondary" /> Expédition Rapide
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <ShieldCheck className="h-3 w-3 text-primary" /> Certifié Pur
               </div>
            </div>
          </div>

          {/* GRID DES PRODUITS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product) => (
              <Link 
                key={product.reference} 
                to={`/products/${categoryId}/${product.reference}`}
                className="group"
              >
                <Card className="h-full border-none shadow-[0_10px_30px_rgba(0,0,0,0.05)] rounded-none overflow-hidden transition-all duration-500 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] group-hover:-translate-y-2">
                  <div className="relative h-64 overflow-hidden">
                    {product.img ? (
                      <img 
                        src={product.img} 
                        alt={product.name[language]}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <Package className="h-16 w-16 text-slate-300" />
                      </div>
                    )}
                    {/* Badge de référence flottant */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-primary text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest shadow-lg">
                        {product.reference}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-8 space-y-4">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 group-hover:text-primary transition-colors">
                      {product.name[language]}
                    </h2>
                    
                    <div className="h-1 w-12 bg-secondary group-hover:w-full transition-all duration-500" />
                    
                    <div className="space-y-3">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Spécification :</p>
                      <p className="font-mono font-bold text-lg text-slate-700">{product.specifications}</p>
                    </div>

                    <div className="pt-4 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                        Détails Techniques <ChevronRight className="h-3 w-3" />
                      </span>
                      <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                        <ChevronRight className="h-4 w-4 group-hover:text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CTA SECTION */}
      <section className="bg-slate-50 py-20 border-t border-slate-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-black uppercase italic mb-8 tracking-tighter">
            Besoin d'un volume spécifique ?
          </h2>
          <Link to="/quote">
            <Button size="lg" className="h-16 px-10 font-black uppercase tracking-widest italic shadow-xl">
              Demander un devis personnalisé
              <Zap className="ml-3 h-5 w-5 fill-current" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default ProductCategory;

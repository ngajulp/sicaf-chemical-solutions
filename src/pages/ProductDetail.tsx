import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Package, Loader2, ArrowRight, ShieldCheck, Microscope } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ProductDetail = () => {
  const { categoryId, reference } = useParams<{ categoryId: string; reference: string }>();
  const { t, language } = useLanguage();
  const { loading, getProductsByCategory, getCategoryById } = useGitHubProducts();

  const category = getCategoryById(categoryId || '');
  const products = getProductsByCategory(categoryId || '');
  const product = products.find(p => p.reference === reference);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        </div>
      </Layout>
    );
  }

  if (!product || !category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="font-heading text-3xl font-black text-foreground mb-6 uppercase italic">
            {language === 'fr' ? 'Produit non trouvé' : 'Product not found'}
          </h1>
          <Link to="/catalog">
            <Button className="font-bold uppercase tracking-widest">{t('common.back_to_catalog')}</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* 1. HERO - Focus sur le nom du produit */}
      <section className="relative text-primary-foreground py-20 md:py-28 overflow-hidden">
        {product.img ? (
          <>
            <img 
              src={product.img} 
              alt={product.name[language]}
              className="absolute inset-0 w-full h-full object-cover grayscale-[0.5]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-black/60" />
          </>
        ) : (
          <div className="absolute inset-0 gradient-hero" />
        )}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <Badge className="mb-6 bg-white text-primary font-black uppercase tracking-[0.2em] px-4 py-1.5 hover:bg-white/90">
              {category.icon} {category.name[language]}
            </Badge>
            <h1 className="font-heading text-4xl md:text-7xl font-black mb-6 drop-shadow-2xl uppercase italic tracking-tighter">
              {product.name[language]}
            </h1>
            <div className="flex items-center gap-4 text-xl md:text-2xl text-white/90 font-mono font-bold italic border-l-4 border-white/40 pl-6">
              <span className="opacity-70">RÉFÉRENCE:</span>
              <span className="tracking-widest">{product.reference}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BREADCRUMB */}
      <section className="bg-slate-100 py-4 border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest overflow-x-auto whitespace-nowrap">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">{t('nav.home')}</Link>
            <span className="text-slate-400">/</span>
            <Link to="/catalog" className="text-muted-foreground hover:text-primary transition-colors">{t('nav.catalog')}</Link>
            <span className="text-slate-400">/</span>
            <Link to={`/products/${categoryId}`} className="text-muted-foreground hover:text-primary transition-colors">{category.name[language]}</Link>
            <span className="text-slate-400">/</span>
            <span className="text-primary">{product.reference}</span>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT DETAILS - Avec Filigrane Labo */}
      <section className="py-16 md:py-24 bg-background relative overflow-hidden">
        {/* FILIGRANE LABO ALIGNÉ TOP */}
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none grayscale"
          style={{
            backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/labochimie.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'top', 
            backgroundRepeat: 'no-repeat'
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Visual Display */}
            <div className="space-y-6">
              <Card className="overflow-hidden shadow-2xl border-4 border-white rounded-none">
                <CardContent className="p-0 relative group">
                  {product.img ? (
                    <img 
                      src={product.img} 
                      alt={product.name[language]}
                      className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-[500px] bg-slate-100 flex items-center justify-center">
                      <Package className="h-32 w-32 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute bottom-6 left-6 bg-primary/90 text-white p-4 backdrop-blur-sm shadow-xl">
                    <ShieldCheck className="h-8 w-8 mb-2" />
                    <p className="font-black uppercase text-[10px] tracking-widest leading-none">Qualité Certifiée</p>
                    <p className="font-bold italic text-xs">SICAF Solutions</p>
                  </div>
                </CardContent>
              </Card>

              {/* Qualité / Engagement Card */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/5 p-6 border-l-4 border-primary">
                   <Microscope className="h-6 w-6 text-primary mb-3" />
                   <h4 className="font-black uppercase text-xs mb-2 tracking-widest">Analyse Labo</h4>
                   <p className="text-xs text-slate-600 font-medium">Contrôlé selon les standards internationaux de pureté.</p>
                </div>
                <div className="bg-primary/5 p-6 border-l-4 border-primary">
                   <ShieldCheck className="h-6 w-6 text-primary mb-3" />
                   <h4 className="font-black uppercase text-xs mb-2 tracking-widest">Conformité</h4>
                   <p className="text-xs text-slate-600 font-medium">Fiches de données de sécurité (FDS) disponibles sur demande.</p>
                </div>
              </div>
            </div>

            {/* Information Column */}
            <div className="space-y-8">
              <div>
                <h2 className="font-heading text-4xl font-black text-foreground mb-2 uppercase italic tracking-tighter">
                  {product.name[language]}
                </h2>
                <div className="h-1.5 w-24 bg-primary mb-4" />
                <p className="text-2xl text-slate-400 font-mono font-bold uppercase tracking-widest">
                  ID: {product.reference}
                </p>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-4">
                <h3 className="font-black uppercase text-sm tracking-[0.2em] text-primary flex items-center gap-3">
                  <span className="h-px w-8 bg-primary/30" />
                  {language === 'fr' ? 'Spécifications Techniques' : 'Technical Specifications'}
                </h3>
                <Card className="border-none bg-slate-50 shadow-inner">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <div className="h-4 w-4 rounded-full bg-primary animate-pulse" />
                      </div>
                      <span className="text-2xl font-black text-slate-800 italic uppercase">
                        {product.specifications}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Industrial Applications */}
              <div className="space-y-4">
                <h3 className="font-black uppercase text-sm tracking-[0.2em] text-primary flex items-center gap-3">
                  <span className="h-px w-8 bg-primary/30" />
                  {language === 'fr' ? 'Applications Industrielles' : 'Industrial Applications'}
                </h3>
                <div className="bg-white p-8 border border-slate-100 shadow-sm rounded-sm">
                  <p className="text-lg text-slate-700 font-bold leading-relaxed italic border-l-4 border-primary/20 pl-6">
                    {product.applications[language]}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link to="/quote" className="flex-1">
                  <Button size="lg" className="w-full font-black uppercase tracking-[0.2em] italic h-16 shadow-xl hover:translate-y-[-2px] transition-all">
                    {language === 'fr' ? 'Demander un devis' : 'Request a quote'}
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </Link>
                
                {product.pdf && (
                  <a 
                    href={product.pdf} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button size="lg" variant="outline" className="w-full border-primary text-primary hover:bg-primary/5 font-black uppercase tracking-[0.2em] italic h-16 border-2">
                      <FileText className="mr-3 h-6 w-6" />
                      {language === 'fr' ? 'Fiche Technique' : 'Technical Sheet'}
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-20 pt-10 border-t border-slate-100 gap-6">
            <Link to={`/products/${categoryId}`}>
              <Button variant="ghost" className="group gap-3 font-bold uppercase text-xs tracking-widest text-slate-500 hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                {language === 'fr' ? 'Retour à la catégorie' : 'Back to category'}
              </Button>
            </Link>
            
            <Link to="/catalog">
              <Button variant="ghost" className="font-black uppercase tracking-[0.2em] text-[10px] text-slate-400">
                {t('common.back_to_catalog')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;

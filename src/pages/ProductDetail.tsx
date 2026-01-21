import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Package, Loader2, ArrowRight, ShieldCheck, Microscope, Beaker } from 'lucide-react';
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
      {/* 1. HERO - Moins compact, plus d'impact */}
      <section className="relative text-primary-foreground min-h-[450px] flex items-center py-24 md:py-32 overflow-hidden">
        {product.img ? (
          <>
            <img 
              src={product.img} 
              alt={product.name[language]}
              className="absolute inset-0 w-full h-full object-cover grayscale-[0.3]"
            />
            {/* Overlay dégradé pour garantir la lisibilité du texte blanc */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-black/40" />
          </>
        ) : (
          <div className="absolute inset-0 gradient-hero" />
        )}
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl space-y-6">
            <Badge className="bg-secondary text-primary font-black uppercase tracking-[0.2em] px-5 py-2 hover:bg-secondary/90 shadow-lg border-none">
              {category.icon} <span className="ml-2">{category.name[language]}</span>
            </Badge>
            <h1 className="font-heading text-5xl md:text-8xl font-black mb-6 drop-shadow-2xl uppercase italic tracking-tighter leading-[0.9]">
              {product.name[language]}
            </h1>
            <div className="flex items-center gap-4 text-2xl md:text-3xl text-white/90 font-mono font-bold italic tracking-tighter">
              <span className="opacity-60 text-lg md:text-xl not-italic font-sans uppercase tracking-widest">Référence :</span>
              <span className="bg-white/10 px-4 py-1 rounded backdrop-blur-sm border border-white/20">
                {product.reference}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BREADCRUMB */}
      <section className="bg-slate-50 py-4 border-b border-slate-200">
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

      {/* 3. PRODUCT DETAILS - Filigrane Visible et Sections Aérées */}
      <section className="py-20 md:py-32 bg-white relative">
        
        {/* FILIGRANE LABO - Ajusté pour être bien visible en fond de page */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/labochimie.png')`,
            backgroundSize: '800px', // Taille fixe pour qu'il ne s'étire pas trop
            backgroundPosition: 'right 10% bottom 10%', 
            backgroundRepeat: 'no-repeat',
            filter: 'contrast(1.2)'
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Visual Column */}
            <div className="space-y-10">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-secondary/20 -z-10 rounded-full blur-2xl" />
                <Card className="overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-none rounded-none">
                  <CardContent className="p-0">
                    {product.img ? (
                      <img 
                        src={product.img} 
                        alt={product.name[language]}
                        className="w-full h-[550px] object-cover"
                      />
                    ) : (
                      <div className="w-full h-[550px] bg-slate-50 flex flex-col items-center justify-center gap-4">
                        <Beaker className="h-24 w-24 text-primary/20" />
                        <span className="font-bold text-slate-300 uppercase tracking-widest">Image bientôt disponible</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Qualité / Engagement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-8 border-l-4 border-primary shadow-sm">
                   <Microscope className="h-8 w-8 text-primary mb-4" />
                   <h4 className="font-black uppercase text-xs mb-3 tracking-[0.2em]">Pureté Analytique</h4>
                   <p className="text-sm text-slate-600 font-medium leading-relaxed">Conforme aux standards de sécurité industrielle les plus exigeants.</p>
                </div>
                <div className="bg-slate-50 p-8 border-l-4 border-secondary shadow-sm">
                   <ShieldCheck className="h-8 w-8 text-secondary mb-4" />
                   <h4 className="font-black uppercase text-xs mb-3 tracking-[0.2em]">Normes FDS</h4>
                   <p className="text-sm text-slate-600 font-medium leading-relaxed">Accompagné de sa fiche de données de sécurité complète.</p>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-primary font-black uppercase text-sm tracking-widest">
                    <div className="h-px w-10 bg-primary" />
                    <span>Détails Techniques</span>
                </div>
                <h2 className="font-heading text-4xl md:text-5xl font-black text-foreground uppercase italic tracking-tighter leading-tight">
                  {product.name[language]}
                </h2>
                <div className="inline-block bg-primary p-1">
                   <div className="bg-white px-4 py-1">
                      <p className="text-primary font-mono font-black text-xl tracking-tighter italic uppercase">
                        Réf: {product.reference}
                      </p>
                   </div>
                </div>
              </div>

              {/* Spécifications */}
              <div className="space-y-6">
                <h3 className="font-black uppercase text-xs tracking-[0.3em] text-slate-400">Spécifications</h3>
                <div className="bg-slate-900 text-white p-10 shadow-2xl skew-x-[-2deg]">
                  <div className="skew-x-[2deg] flex items-center gap-6">
                    <div className="h-16 w-16 rounded-full border-4 border-secondary flex items-center justify-center">
                        <div className="h-3 w-3 bg-secondary rounded-full animate-ping" />
                    </div>
                    <span className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase">
                      {product.specifications}
                    </span>
                  </div>
                </div>
              </div>

              {/* Applications */}
              <div className="space-y-6">
                <h3 className="font-black uppercase text-xs tracking-[0.3em] text-slate-400">Secteurs & Applications</h3>
                <div className="relative group">
                    <div className="absolute inset-0 bg-primary/5 -rotate-1 transition-transform group-hover:rotate-0" />
                    <p className="relative z-10 p-8 text-xl text-slate-700 font-bold leading-relaxed italic border-l-8 border-primary">
                      {product.applications[language]}
                    </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-10">
                <Link to="/quote" className="flex-[1.5]">
                  <Button size="lg" className="w-full h-20 font-black uppercase tracking-[0.2em] italic text-lg shadow-[0_15px_30px_rgba(0,102,204,0.3)] hover:translate-y-[-4px] transition-all">
                    Demander un devis
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </Link>
                
                {product.pdf && (
                  <a href={product.pdf} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button size="lg" variant="outline" className="w-full h-20 border-2 border-primary text-primary hover:bg-primary/5 font-black uppercase tracking-[0.2em] italic text-sm">
                      <FileText className="mr-3 h-6 w-6" />
                      Fiche PDF
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Navigation bas de page */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-32 pt-12 border-t border-slate-100 gap-8">
            <Link to={`/products/${categoryId}`}>
              <Button variant="ghost" className="group gap-4 font-black uppercase text-xs tracking-[0.2em] text-slate-500 hover:text-primary">
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-2 transition-transform" />
                Retour {category.name[language]}
              </Button>
            </Link>
            
            <Link to="/catalog">
              <Button variant="link" className="font-bold uppercase tracking-widest text-slate-400 decoration-slate-300">
                Parcourir le catalogue complet
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;

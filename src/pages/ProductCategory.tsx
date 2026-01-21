import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2, Package, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const ProductCategory = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const { t, language } = useLanguage();
  const { categories, loading, getProductsByCategory, getCategoryById } = useGitHubProducts();

  const category = getCategoryById(categoryId || '');
  const products = getProductsByCategory(categoryId || '');

  // Navigation entre catégories
  const currentIndex = categories.findIndex(c => c.id === categoryId);
  const prevCategory = currentIndex > 0 ? categories[currentIndex - 1] : null;
  const nextCategory = currentIndex < categories.length - 1 ? categories[currentIndex + 1] : null;

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        </div>
      </Layout>
    );
  }

  if (!category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="font-heading text-3xl font-black text-foreground mb-6 uppercase italic">
            {language === 'fr' ? 'Catégorie non trouvée' : 'Category not found'}
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
      {/* 1. HERO - Image de catégorie avec overlay SICAF */}
      <section className="relative text-primary-foreground py-20 md:py-32 overflow-hidden">
        {category.img ? (
          <>
            <img 
              src={category.img} 
              alt={category.name[language]}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-black/60" />
          </>
        ) : (
          <div className="absolute inset-0 gradient-hero" />
        )}
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-start max-w-3xl">
            <div className="text-6xl mb-6 drop-shadow-2xl">{category.icon}</div>
            <h1 className="font-heading text-4xl md:text-6xl font-black mb-6 drop-shadow-2xl uppercase italic tracking-tighter">
              {category.name[language]}
            </h1>
            <p className="text-xl md:text-2xl text-white/95 font-medium leading-relaxed italic border-l-4 border-white/30 pl-6">
              {category.description[language]}
            </p>
            <div className="mt-8 inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-sm text-sm font-bold uppercase tracking-widest">
              {products.length} {language === 'fr' ? 'produits référencés' : 'listed products'}
            </div>
          </div>
        </div>
      </section>

      {/* 2. BREADCRUMB - Navigation simple */}
      <section className="bg-slate-100 py-4 border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              {t('nav.home')}
            </Link>
            <span className="text-slate-400">/</span>
            <Link to="/catalog" className="text-muted-foreground hover:text-primary transition-colors">
              {t('nav.catalog')}
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-primary">{category.name[language]}</span>
          </div>
        </div>
      </section>

      {/* 3. TABLEAU DES PRODUITS - Avec filigrane aligné TOP */}
      <section className="py-16 md:py-24 bg-background relative overflow-hidden">
        {/* FILIGRANE POSITIONNÉ EN HAUT */}
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none grayscale"
          style={{
            backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/stockageproduits.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'top', 
            backgroundRepeat: 'no-repeat'
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <Card className="shadow-2xl overflow-hidden border-none bg-white/80 backdrop-blur-md">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary hover:bg-primary border-none">
                    <TableHead className="text-primary-foreground font-black uppercase italic py-6 w-24 text-center">
                      {language === 'fr' ? 'Visuel' : 'Visual'}
                    </TableHead>
                    <TableHead className="text-primary-foreground font-black uppercase italic">
                      {t('table.reference')}
                    </TableHead>
                    <TableHead className="text-primary-foreground font-black uppercase italic">
                      {t('table.product')}
                    </TableHead>
                    <TableHead className="text-primary-foreground font-black uppercase italic hidden md:table-cell">
                      {t('table.applications')}
                    </TableHead>
                    <TableHead className="text-primary-foreground font-black uppercase italic">
                      {t('table.specifications')}
                    </TableHead>
                    <TableHead className="text-primary-foreground font-black uppercase italic w-20 text-center">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product, index) => (
                    <TableRow 
                      key={product.reference}
                      className={`${index % 2 === 0 ? 'bg-transparent' : 'bg-primary/5'} hover:bg-primary/10 transition-colors border-primary/10`}
                    >
                      <TableCell className="py-4">
                        {product.img ? (
                          <div className="rounded-sm overflow-hidden w-16 h-16 border border-primary/20 shadow-sm mx-auto">
                            <img 
                              src={product.img} 
                              alt={product.name[language]}
                              className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-muted rounded-sm flex items-center justify-center mx-auto border border-dashed border-slate-300">
                            <Package className="h-6 w-6 text-slate-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm font-black text-primary">
                        {product.reference}
                      </TableCell>
                      <TableCell className="font-bold text-slate-800">
                        {product.name[language]}
                      </TableCell>
                      <TableCell className="text-slate-600 font-medium hidden md:table-cell italic text-sm">
                        {product.applications[language]}
                      </TableCell>
                      <TableCell>
                        <span className="inline-block bg-primary text-white font-bold px-3 py-1 rounded-sm text-xs shadow-sm uppercase tracking-tighter">
                          {product.specifications}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/products/${categoryId}/${encodeURIComponent(product.reference)}`)}
                          className="text-primary hover:bg-primary hover:text-white transition-all"
                        >
                          <Eye className="h-5 w-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Navigation entre catégories */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 items-center">
            <div className="flex justify-start">
              {prevCategory && (
                <Link to={`/products/${prevCategory.id}`}>
                  <Button variant="outline" className="group border-primary/30 hover:border-primary text-primary gap-3 font-bold uppercase text-xs h-12">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden md:inline">{prevCategory.name[language]}</span>
                    <span className="md:hidden">Précédent</span>
                  </Button>
                </Link>
              )}
            </div>

            <div className="flex justify-center">
              <Link to="/catalog">
                <Button variant="ghost" className="font-black uppercase tracking-[0.2em] text-xs text-muted-foreground hover:text-primary">
                  {t('common.back_to_catalog')}
                </Button>
              </Link>
            </div>

            <div className="flex justify-end">
              {nextCategory && (
                <Link to={`/products/${nextCategory.id}`}>
                  <Button variant="outline" className="group border-primary/30 hover:border-primary text-primary gap-3 font-bold uppercase text-xs h-12">
                    <span className="hidden md:inline">{nextCategory.name[language]}</span>
                    <span className="md:hidden">Suivant</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* CTA Devis */}
          <div className="mt-20 p-10 rounded-2xl bg-primary text-primary-foreground text-center relative overflow-hidden shadow-2xl">
             <div className="absolute inset-0 opacity-10 pointer-events-none grayscale scale-150 rotate-12 translate-x-1/4"
                  style={{backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/labochimie.png')`, backgroundSize: 'cover'}} />
             
            <p className="text-xl font-medium mb-6 italic relative z-10">
              {language === 'fr' 
                ? 'Besoin d\'un devis personnalisé pour ces références ?'
                : 'Need a custom quote for these references?'}
            </p>
            <Link to="/quote" className="relative z-10">
              <Button size="lg" variant="secondary" className="font-black uppercase tracking-widest px-10 h-14 hover:scale-105 transition-transform shadow-xl">
                {t('nav.quote')}
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductCategory;

import { Link } from 'react-router-dom';
import { Package, ChevronRight, Beaker, Search, Filter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const Catalog = () => {
  const { language, t } = useLanguage();
  const { categories, products, loading } = useGitHubProducts();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product => 
    product.name[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      {/* 1. HERO CATALOGUE - Aéré et Impactant */}
      <section className="relative text-white min-h-[350px] flex items-center py-20 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1532187875605-2fe358a3d46a?auto=format&fit=crop&q=80" 
            className="w-full h-full object-cover opacity-30 grayscale"
            alt="Laboratory background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="font-heading text-5xl md:text-7xl font-black mb-6 uppercase italic tracking-tighter leading-none">
              {t('catalog.title')}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 font-medium italic border-l-4 border-secondary pl-6 max-w-2xl">
              Accédez à l'intégralité de nos solutions chimiques haute performance.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FILTRES ET RECHERCHE */}
      <section className="bg-slate-50 border-b border-slate-200 py-8 sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input 
              type="text" 
              placeholder="Rechercher par nom ou référence (ex: AC-102)..." 
              className="pl-12 h-14 bg-white border-2 border-slate-200 rounded-none focus-visible:ring-primary font-bold uppercase tracking-widest text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* 3. GRILLE DE PRODUITS - Style "ProductCategory" */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden">
        
        {/* FILIGRANE LABOCHIMIE */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/labochimie.png')`,
            backgroundSize: '900px',
            backgroundPosition: 'left -100px bottom 100px', 
            backgroundRepeat: 'no-repeat',
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Beaker className="h-12 w-12 text-primary animate-bounce" />
              <p className="font-black uppercase tracking-[0.3em] text-slate-400">Chargement de l'inventaire...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredProducts.map((product) => {
                  const category = categories.find(c => c.id === product.categoryId);
                  return (
                    <Link 
                      key={product.reference} 
                      to={`/products/${product.categoryId}/${product.reference}`}
                      className="group"
                    >
                      <Card className="h-full border-none shadow-[0_10px_30px_rgba(0,0,0,0.05)] rounded-none overflow-hidden transition-all duration-500 group-hover:shadow-[0_20px_60px_rgba(0,102,204,0.15)] group-hover:-translate-y-2 bg-white">
                        <div className="relative h-64 overflow-hidden">
                          {product.img ? (
                            <img 
                              src={product.img} 
                              alt={product.name[language]}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                              <Package className="h-16 w-16 text-slate-200" />
                            </div>
                          )}
                          
                          {/* Badge de catégorie et référence */}
                          <div className="absolute top-4 left-4 flex flex-col gap-2">
                            <div className="bg-primary text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest shadow-lg">
                              {product.reference}
                            </div>
                            {category && (
                              <div className="bg-secondary text-primary text-[9px] font-black px-2 py-1 uppercase tracking-widest">
                                {category.name[language]}
                              </div>
                            )}
                          </div>
                        </div>

                        <CardContent className="p-8 space-y-4">
                          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 group-hover:text-primary transition-colors leading-tight min-h-[64px]">
                            {product.name[language]}
                          </h2>
                          
                          <div className="h-1 w-12 bg-secondary group-hover:w-full transition-all duration-500" />
                          
                          <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Spécification technique</p>
                            <p className="font-mono font-bold text-lg text-slate-700 truncate">{product.specifications}</p>
                          </div>

                          <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                              Fiche Technique <ChevronRight className="h-3 w-3" />
                            </span>
                            <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                              <ChevronRight className="h-5 w-5 group-hover:text-white" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-xl font-bold text-slate-400 uppercase tracking-widest">Aucun produit ne correspond à votre recherche</p>
                  <Button 
                    variant="link" 
                    onClick={() => setSearchTerm('')}
                    className="mt-4 text-primary font-black uppercase"
                  >
                    Effacer la recherche
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Catalog;

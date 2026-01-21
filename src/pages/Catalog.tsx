import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, Filter, ChevronRight, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const Catalog = () => {
  const { t, language } = useLanguage();
  const { products, categories, loading, searchProducts, getProductsByCategory } = useGitHubProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== 'all') {
      result = getProductsByCategory(selectedCategory);
    }

    if (searchQuery) {
      result = searchProducts(searchQuery, language);
      if (selectedCategory !== 'all') {
        result = result.filter(p => p.category === selectedCategory);
      }
    }

    return result;
  }, [searchQuery, selectedCategory, language, products, searchProducts, getProductsByCategory]);

  const handleDownloadBrochure = () => {
    alert(language === 'fr' 
      ? 'Le téléchargement de la brochure va commencer...'
      : 'Brochure download will start...');
  };

  return (
    <Layout>
      {/* Hero avec Filigrane Labo */}
      <section className="gradient-hero text-primary-foreground py-16 md:py-24 relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-20 pointer-events-none grayscale"
          style={{
            backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/labochimie.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 uppercase tracking-tighter">
            {t('catalog.title')}
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto font-medium italic">
            {t('catalog.subtitle')}
          </p>
        </div>
      </section>

      {/* Barre de recherche collante */}
      <section className="py-8 md:py-12 bg-muted sticky top-0 z-30 border-b border-primary/10 shadow-sm backdrop-blur-md bg-muted/95">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('catalog.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-primary/20"
              />
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2 flex-1 md:flex-initial">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-64 bg-background border-primary/20">
                    <SelectValue placeholder={t('catalog.filter')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('catalog.all')}</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.icon} {category.name[language]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleDownloadBrochure} variant="outline" className="gap-2 border-primary text-primary hover:bg-primary hover:text-white">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">{t('catalog.download')}</span>
              </Button>
            </div>
          </div>

          <p className="text-sm font-bold text-primary mt-4 uppercase tracking-widest">
            {filteredProducts.length} {t('catalog.products_count')}
          </p>
        </div>
      </section>

      {/* Section Liste des produits avec Filigrane Stockage */}
      <section className="py-12 md:py-20 bg-background relative overflow-hidden">
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
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {selectedCategory === 'all' && !searchQuery && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {categories.map((category) => {
                    const count = products.filter(p => p.category === category.id).length;
                    return (
                      <Link key={category.id} to={`/products/${category.id}`}>
                        <Card className="category-card group h-56 relative overflow-hidden border-none shadow-xl">
                          {category.img ? (
                            <img 
                              src={category.img} 
                              alt={category.name[language]}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="absolute inset-0 gradient-hero" />
                          )}
                          <div className="category-card-overlay bg-black/40 group-hover:bg-black/20 transition-colors" />
                          <CardContent className="relative z-10 h-full flex flex-col justify-end p-8">
                            <div className="flex items-center gap-3 mb-2 transform group-hover:-translate-y-2 transition-transform">
                              <span className="text-4xl drop-shadow-2xl">{category.icon}</span>
                              <h3 className="font-heading font-black text-2xl text-white drop-shadow-2xl uppercase italic">
                                {category.name[language]}
                              </h3>
                            </div>
                            <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-sm font-bold text-white uppercase tracking-tighter">
                                {count} {language === 'fr' ? 'produits disponibles' : 'available products'}
                              </p>
                              <ChevronRight className="h-6 w-6 text-white translate-x-4 group-hover:translate-x-0 transition-transform" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Tableau avec fond semi-transparent pour voir le filigrane */}
              <Card className="shadow-2xl overflow-hidden border-none bg-white/80 backdrop-blur-md">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-primary hover:bg-primary/90 border-none">
                        <TableHead className="text-primary-foreground font-black uppercase italic py-6">
                          {t('table.reference')}
                        </TableHead>
                        <TableHead className="text-primary-foreground font-black uppercase italic">
                          {t('table.product')}
                        </TableHead>
                        <TableHead className="text-primary-foreground font-black uppercase italic hidden md:table-cell">
                          {t('table.applications')}
                        </TableHead>
                        <TableHead className="text-primary-foreground font-black uppercase italic hidden sm:table-cell text-right pr-8">
                          {t('table.specifications')}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product, index) => (
                        <TableRow 
                          key={product.reference}
                          className={`${index % 2 === 0 ? 'bg-transparent' : 'bg-primary/5'} hover:bg-primary/10 transition-colors border-primary/10`}
                        >
                          <TableCell className="font-mono text-sm font-black text-primary py-5">
                            {product.reference}
                          </TableCell>
                          <TableCell className="font-bold text-slate-800">
                            {product.name[language]}
                          </TableCell>
                          <TableCell className="text-slate-600 font-medium hidden md:table-cell italic">
                            {product.applications[language]}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-right pr-8">
                            <span className="inline-block bg-primary text-white font-bold px-3 py-1 rounded-sm text-xs shadow-sm">
                              {product.specifications}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredProducts.length === 0 && (
                  <div className="p-20 text-center">
                    <p className="text-primary font-black text-xl uppercase italic">
                      {language === 'fr' 
                        ? 'Aucun résultat trouvé.'
                        : 'No results found.'}
                    </p>
                  </div>
                )}
              </Card>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Catalog;

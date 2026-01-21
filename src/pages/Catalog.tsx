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

    // Filter by category
    if (selectedCategory !== 'all') {
      result = getProductsByCategory(selectedCategory);
    }

    // Filter by search query
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
      {/* Hero */}
      <section className="gradient-hero text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            {t('catalog.title')}
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            {t('catalog.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-8 md:py-12 bg-muted sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('catalog.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2 flex-1 md:flex-initial">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-64 bg-background">
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

              {/* Download Button */}
              <Button onClick={handleDownloadBrochure} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">{t('catalog.download')}</span>
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            {filteredProducts.length} {t('catalog.products_count')}
          </p>
        </div>
      </section>

      <section className="py-8 md:py-12 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Category Cards */}
              {selectedCategory === 'all' && !searchQuery && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {categories.map((category) => {
                    const count = products.filter(p => p.category === category.id).length;
                    return (
                      <Link key={category.id} to={`/products/${category.id}`}>
                        <Card className="category-card group h-48 relative overflow-hidden">
                          {category.img ? (
                            <img 
                              src={category.img} 
                              alt={category.name[language]}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="absolute inset-0 gradient-hero" />
                          )}
                          <div className="category-card-overlay" />
                          <CardContent className="relative z-10 h-full flex flex-col justify-end p-6">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-3xl drop-shadow-lg">{category.icon}</span>
                              <h3 className="font-heading font-bold text-xl text-white drop-shadow-lg">
                                {category.name[language]}
                              </h3>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-white/80">
                                {count} {language === 'fr' ? 'produits' : 'products'}
                              </p>
                              <ChevronRight className="h-5 w-5 text-white group-hover:translate-x-1 transition-transform" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Products Table */}
              <Card className="shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-primary hover:bg-primary">
                        <TableHead className="text-primary-foreground font-semibold">
                          {t('table.reference')}
                        </TableHead>
                        <TableHead className="text-primary-foreground font-semibold">
                          {t('table.product')}
                        </TableHead>
                        <TableHead className="text-primary-foreground font-semibold hidden md:table-cell">
                          {t('table.applications')}
                        </TableHead>
                        <TableHead className="text-primary-foreground font-semibold hidden sm:table-cell">
                          {t('table.specifications')}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product, index) => (
                        <TableRow 
                          key={product.reference}
                          className={index % 2 === 0 ? 'bg-background' : 'bg-muted/50'}
                        >
                          <TableCell className="font-mono text-sm font-medium text-primary">
                            {product.reference}
                          </TableCell>
                          <TableCell className="font-medium">
                            {product.name[language]}
                          </TableCell>
                          <TableCell className="text-muted-foreground hidden md:table-cell">
                            {product.applications[language]}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <span className="inline-block bg-secondary/20 text-secondary-foreground px-2 py-1 rounded text-sm">
                              {product.specifications}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredProducts.length === 0 && (
                  <div className="p-12 text-center">
                    <p className="text-muted-foreground">
                      {language === 'fr' 
                        ? 'Aucun produit trouvé pour cette recherche.'
                        : 'No products found for this search.'}
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

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

  // Get adjacent categories for navigation
  const currentIndex = categories.findIndex(c => c.id === categoryId);
  const prevCategory = currentIndex > 0 ? categories[currentIndex - 1] : null;
  const nextCategory = currentIndex < categories.length - 1 ? categories[currentIndex + 1] : null;

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        </div>
      </Layout>
    );
  }

  if (!category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">
            {language === 'fr' ? 'Catégorie non trouvée' : 'Category not found'}
          </h1>
          <Link to="/catalog">
            <Button>{t('common.back_to_catalog')}</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero with category image */}
      <section className="relative text-primary-foreground py-16 md:py-24 overflow-hidden">
        {category.img ? (
          <>
            <img 
              src={category.img} 
              alt={category.name[language]}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
          </>
        ) : (
          <div className="absolute inset-0 gradient-hero" />
        )}
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="text-6xl mb-4 drop-shadow-lg">{category.icon}</div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            {category.name[language]}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow">
            {category.description[language]}
          </p>
          <p className="mt-4 text-white/70">
            {products.length} {language === 'fr' ? 'produits disponibles' : 'products available'}
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="bg-muted py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary">
              {t('nav.home')}
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/catalog" className="text-muted-foreground hover:text-primary">
              {t('nav.catalog')}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{category.name[language]}</span>
          </div>
        </div>
      </section>

      {/* Products Table */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <Card className="shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary hover:bg-primary">
                    <TableHead className="text-primary-foreground font-semibold w-20">
                      {language === 'fr' ? 'Image' : 'Image'}
                    </TableHead>
                    <TableHead className="text-primary-foreground font-semibold">
                      {t('table.reference')}
                    </TableHead>
                    <TableHead className="text-primary-foreground font-semibold">
                      {t('table.product')}
                    </TableHead>
                    <TableHead className="text-primary-foreground font-semibold hidden md:table-cell">
                      {t('table.applications')}
                    </TableHead>
                    <TableHead className="text-primary-foreground font-semibold">
                      {t('table.specifications')}
                    </TableHead>
                    <TableHead className="text-primary-foreground font-semibold w-20">
                      {language === 'fr' ? 'Détails' : 'Details'}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product, index) => (
                    <TableRow 
                      key={product.reference}
                      className={index % 2 === 0 ? 'bg-background' : 'bg-muted/50'}
                    >
                      <TableCell>
                        {product.img ? (
                          <div className="image-hover-zoom rounded-lg overflow-hidden w-14 h-14">
                            <img 
                              src={product.img} 
                              alt={product.name[language]}
                              className="w-14 h-14 object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-14 bg-muted rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm font-medium text-primary">
                        {product.reference}
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.name[language]}
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden md:table-cell">
                        {product.applications[language]}
                      </TableCell>
                      <TableCell>
                        <span className="inline-block bg-secondary/20 text-secondary-foreground px-2 py-1 rounded text-sm">
                          {product.specifications}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/products/${categoryId}/${encodeURIComponent(product.reference)}`)}
                          className="gap-1 text-primary hover:text-primary/80"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Navigation between categories */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
            {prevCategory ? (
              <Link to={`/products/${prevCategory.id}`}>
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {prevCategory.icon} {prevCategory.name[language]}
                </Button>
              </Link>
            ) : (
              <div />
            )}

            <Link to="/catalog">
              <Button variant="ghost">{t('common.back_to_catalog')}</Button>
            </Link>

            {nextCategory ? (
              <Link to={`/products/${nextCategory.id}`}>
                <Button variant="outline" className="gap-2">
                  {nextCategory.name[language]} {nextCategory.icon}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <div />
            )}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              {language === 'fr' 
                ? 'Intéressé par ces produits ?'
                : 'Interested in these products?'}
            </p>
            <Link to="/quote">
              <Button size="lg" className="font-semibold">
                {t('nav.quote')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductCategory;

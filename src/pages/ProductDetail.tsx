import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Package, Loader2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EditProductModal from '@/components/products/EditProductModal'; // ✅ import modal

const ProductDetail = () => {
  const { categoryId, reference } = useParams<{ categoryId: string; reference: string }>();
  const { t, language } = useLanguage();
  const { loading, getProductsByCategory, getCategoryById } = useGitHubProducts();

  const [isEditOpen, setIsEditOpen] = useState(false); // ✅ état modal

  const category = getCategoryById(categoryId || '');
  const products = getProductsByCategory(categoryId || '');
  const product = products.find(p => p.reference === reference);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        </div>
      </Layout>
    );
  }

  if (!product || !category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">
            {language === 'fr' ? 'Produit non trouvé' : 'Product not found'}
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
      {/* Hero with product image */}
      <section className="relative text-primary-foreground py-16 md:py-24 overflow-hidden">
        {product.img ? (
          <>
            <img 
              src={product.img} 
              alt={product.name[language]}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
          </>
        ) : (
          <div className="absolute inset-0 gradient-hero" />
        )}
        <div className="container mx-auto px-4 text-center relative z-10">
          <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">
            {category.icon} {category.name[language]}
          </Badge>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            {product.name[language]}
          </h1>
          <p className="text-xl text-white/90 font-mono drop-shadow">
            {product.reference}
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="bg-muted py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <Link to="/" className="text-muted-foreground hover:text-primary">
              {t('nav.home')}
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/catalog" className="text-muted-foreground hover:text-primary">
              {t('nav.catalog')}
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link to={`/products/${categoryId}`} className="text-muted-foreground hover:text-primary">
              {category.name[language]}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{product.reference}</span>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-0">
                {product.img ? (
                  <img 
                    src={product.img} 
                    alt={product.name[language]}
                    className="w-full h-[400px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[400px] bg-muted flex items-center justify-center">
                    <Package className="h-24 w-24 text-muted-foreground" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
                  {product.name[language]}
                </h2>
                <p className="text-lg text-muted-foreground font-mono">
                  Réf: {product.reference}
                </p>
              </div>

              {/* Specifications */}
              <Card className="border-primary/20">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3 text-foreground">
                    {language === 'fr' ? 'Spécifications' : 'Specifications'}
                  </h3>
                  <Badge variant="secondary" className="text-base px-4 py-2">
                    {product.specifications}
                  </Badge>
                </CardContent>
              </Card>

              {/* Applications */}
              <Card className="border-primary/20">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3 text-foreground">
                    {language === 'fr' ? 'Applications' : 'Applications'}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.applications[language]}
                  </p>
                </CardContent>
              </Card>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/quote" className="flex-1">
                  <Button size="lg" className="w-full font-semibold gap-2">
                    {language === 'fr' ? 'Demander un devis' : 'Request a quote'}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                {product.pdf && (
                  <a 
                    href={product.pdf} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button size="lg" variant="outline" className="w-full font-semibold gap-2">
                      <FileText className="h-5 w-5" />
                      {language === 'fr' ? 'Fiche technique' : 'Technical sheet'}
                    </Button>
                  </a>
                )}

                {/* ✅ Bouton Modifier */}
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsEditOpen(true)}
                  className="flex-1"
                >
                  {language === 'fr' ? 'Modifier' : 'Edit'}
                </Button>
              </div>
            </div>
          </div>

          {/* Back Navigation */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t">
            <Link to={`/products/${categoryId}`}>
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {language === 'fr' ? 'Retour à la catégorie' : 'Back to category'}
              </Button>
            </Link>
            <Link to="/catalog">
              <Button variant="ghost">{t('common.back_to_catalog')}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ✅ Modal Edit Product */}
      <EditProductModal
        product={product}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </Layout>
  );
};

export default ProductDetail;

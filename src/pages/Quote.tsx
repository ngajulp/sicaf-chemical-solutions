import { useState } from 'react';
import { Send, CheckCircle, ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { products, categories } from '@/data/products';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const Quote = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleProduct = (reference: string) => {
    setSelectedProducts(prev => 
      prev.includes(reference)
        ? prev.filter(ref => ref !== reference)
        : [...prev, reference]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (selectedProducts.length === 0) {
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: language === 'fr' 
          ? 'Veuillez sélectionner au moins un produit.'
          : 'Please select at least one product.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast({
      title: language === 'fr' ? 'Demande envoyée !' : 'Request sent!',
      description: language === 'fr' 
        ? 'Nous vous enverrons un devis dans les plus brefs délais.'
        : 'We will send you a quote as soon as possible.',
    });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-hero text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            {t('quote.title')}
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            {t('quote.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          {isSubmitted ? (
            <Card className="max-w-2xl mx-auto shadow-lg">
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
                <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                  {language === 'fr' ? 'Demande envoyée avec succès !' : 'Request sent successfully!'}
                </h2>
                <p className="text-lg text-muted-foreground mb-2">
                  {language === 'fr' 
                    ? 'Nous avons bien reçu votre demande de devis.'
                    : 'We have received your quote request.'}
                </p>
                <p className="text-muted-foreground mb-8">
                  {language === 'fr'
                    ? `${selectedProducts.length} produit(s) sélectionné(s)`
                    : `${selectedProducts.length} product(s) selected`}
                </p>
                <Button 
                  onClick={() => {
                    setIsSubmitted(false);
                    setSelectedProducts([]);
                  }}
                  size="lg"
                >
                  {language === 'fr' ? 'Nouvelle demande' : 'New request'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Product Selection */}
                <div className="lg:col-span-2">
                  <Card className="shadow-lg">
                    <CardContent className="p-6">
                      <h2 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        {t('quote.select_products')}
                      </h2>

                      <div className="space-y-4">
                        {categories.map((category) => {
                          const categoryProducts = products.filter(p => p.category === category.id);
                          const isExpanded = expandedCategories.includes(category.id);
                          const selectedCount = categoryProducts.filter(p => 
                            selectedProducts.includes(p.reference)
                          ).length;

                          return (
                            <div key={category.id} className="border rounded-lg overflow-hidden">
                              <button
                                type="button"
                                onClick={() => toggleCategory(category.id)}
                                className="w-full px-4 py-3 bg-muted flex items-center justify-between hover:bg-muted/80 transition-colors"
                              >
                                <span className="flex items-center gap-2 font-medium">
                                  <span>{category.icon}</span>
                                  <span>{category.name[language]}</span>
                                  {selectedCount > 0 && (
                                    <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                                      {selectedCount}
                                    </span>
                                  )}
                                </span>
                                <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                  ▼
                                </span>
                              </button>

                              {isExpanded && (
                                <div className="p-4 space-y-2">
                                  {categoryProducts.map((product) => (
                                    <label
                                      key={product.reference}
                                      className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer"
                                    >
                                      <Checkbox
                                        checked={selectedProducts.includes(product.reference)}
                                        onCheckedChange={() => toggleProduct(product.reference)}
                                      />
                                      <div className="flex-1">
                                        <span className="font-medium">{product.name[language]}</span>
                                        <span className="text-sm text-muted-foreground ml-2">
                                          ({product.reference})
                                        </span>
                                      </div>
                                    </label>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-1">
                  <Card className="shadow-lg sticky top-24">
                    <CardContent className="p-6">
                      <h2 className="font-heading text-xl font-bold text-foreground mb-4">
                        {language === 'fr' ? 'Vos informations' : 'Your information'}
                      </h2>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t('contact.name')} *</Label>
                          <Input id="name" name="name" required />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">{t('contact.email')} *</Label>
                          <Input id="email" name="email" type="email" required />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">{t('contact.phone')}</Label>
                          <Input id="phone" name="phone" type="tel" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="company">{t('contact.company')}</Label>
                          <Input id="company" name="company" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="quantity">{t('quote.quantity')}</Label>
                          <Input id="quantity" name="quantity" placeholder="Ex: 500 kg, 100 L..." />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="info">{t('quote.additional_info')}</Label>
                          <Textarea id="info" name="info" rows={3} />
                        </div>

                        <div className="pt-4 border-t">
                          <p className="text-sm text-muted-foreground mb-4">
                            {language === 'fr' ? 'Produits sélectionnés :' : 'Selected products:'} 
                            <span className="font-bold text-primary ml-1">{selectedProducts.length}</span>
                          </p>

                          <Button 
                            type="submit" 
                            className="w-full font-semibold" 
                            size="lg"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <span className="flex items-center gap-2">
                                <span className="animate-spin">⏳</span>
                                {language === 'fr' ? 'Envoi...' : 'Sending...'}
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">
                                <Send className="h-5 w-5" />
                                {t('quote.submit')}
                              </span>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Quote;

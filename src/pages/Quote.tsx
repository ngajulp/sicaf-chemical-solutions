import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, CheckCircle, ShoppingCart, MessageCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { products, categories } from '@/data/products';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { sendQuoteEmail } from '@/lib/emailjs';
import WhatsAppButton, { getWhatsAppUrl } from '@/components/WhatsAppButton';

const Quote = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    quantity: '',
    description: '',
    budget: '',
    deadline: ''
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getSelectedProductsText = () => {
    return selectedProducts.map(ref => {
      const product = products.find(p => p.reference === ref);
      return product ? `- ${product.name[language]} (${ref})` : ref;
    }).join('\n');
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
    
    try {
      await sendQuoteEmail({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        products: getSelectedProductsText(),
        quantity: formData.quantity,
        description: formData.description,
        budget: formData.budget,
        deadline: formData.deadline
      });

      setIsSubmitted(true);
      toast({
        title: language === 'fr' ? 'Demande envoyée !' : 'Request sent!',
        description: language === 'fr' 
          ? 'Nous vous enverrons un devis dans les plus brefs délais.'
          : 'We will send you a quote as soon as possible.',
      });
    } catch (error) {
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: language === 'fr' 
          ? 'Une erreur est survenue. Veuillez réessayer.'
          : 'An error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppMessage = () => {
    const productsText = selectedProducts.map(ref => {
      const product = products.find(p => p.reference === ref);
      return product ? `• ${product.name[language]}` : ref;
    }).join('\n');

    return language === 'fr'
      ? `Bonjour SICAF,\n\nJe souhaite demander un devis pour les produits suivants:\n${productsText}\n\nQuantité: ${formData.quantity || 'À définir'}\n\nMerci de me recontacter.`
      : `Hello SICAF,\n\nI would like to request a quote for the following products:\n${productsText}\n\nQuantity: ${formData.quantity || 'To be defined'}\n\nPlease contact me back.`;
  };

  const budgetOptions = [
    { value: 'less-100k', label: language === 'fr' ? 'Moins de 100 000 FCFA' : 'Less than 100,000 FCFA' },
    { value: '100k-500k', label: '100 000 - 500 000 FCFA' },
    { value: '500k-1m', label: '500 000 - 1 000 000 FCFA' },
    { value: '1m-5m', label: '1 000 000 - 5 000 000 FCFA' },
    { value: 'more-5m', label: language === 'fr' ? 'Plus de 5 000 000 FCFA' : 'More than 5,000,000 FCFA' },
  ];

  const deadlineOptions = [
    { value: 'urgent', label: language === 'fr' ? 'Urgent (< 1 semaine)' : 'Urgent (< 1 week)' },
    { value: '1-2weeks', label: language === 'fr' ? '1-2 semaines' : '1-2 weeks' },
    { value: '1month', label: language === 'fr' ? '1 mois' : '1 month' },
    { value: 'flexible', label: language === 'fr' ? 'Flexible' : 'Flexible' },
  ];

  return (
    <Layout>
      {/* Floating WhatsApp Button */}
      <WhatsAppButton variant="floating" />

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
                <p className="text-muted-foreground mb-6">
                  {language === 'fr'
                    ? `${selectedProducts.length} produit(s) sélectionné(s)`
                    : `${selectedProducts.length} product(s) selected`}
                </p>

                {/* WhatsApp CTA after submission */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                  <MessageCircle className="h-10 w-10 text-[#25D366] mx-auto mb-3" />
                  <h3 className="font-semibold text-green-800 mb-2">
                    {language === 'fr' 
                      ? 'Besoin d\'une réponse plus rapide ?'
                      : 'Need a faster response?'}
                  </h3>
                  <p className="text-sm text-green-700 mb-4">
                    {language === 'fr' 
                      ? 'Continuez la conversation sur WhatsApp pour un traitement prioritaire de votre demande.'
                      : 'Continue the conversation on WhatsApp for priority handling of your request.'}
                  </p>
                  <a
                    href={getWhatsAppUrl(getWhatsAppMessage())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                  >
                    <MessageCircle className="h-5 w-5 fill-white" />
                    {language === 'fr' ? 'Continuer sur WhatsApp' : 'Continue on WhatsApp'}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>

                <Button 
                  onClick={() => {
                    setIsSubmitted(false);
                    setSelectedProducts([]);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      company: '',
                      quantity: '',
                      description: '',
                      budget: '',
                      deadline: ''
                    });
                  }}
                  size="lg"
                  variant="outline"
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
                          <Label htmlFor="name">{language === 'fr' ? 'Nom / Entreprise' : 'Name / Company'} *</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={formData.name}
                            onChange={handleChange}
                            required 
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">{t('contact.email')} *</Label>
                          <Input 
                            id="email" 
                            name="email" 
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required 
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">{t('contact.phone')} *</Label>
                          <Input 
                            id="phone" 
                            name="phone" 
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="quantity">{t('quote.quantity')}</Label>
                          <Input 
                            id="quantity" 
                            name="quantity" 
                            placeholder="Ex: 500 kg, 100 L..."
                            value={formData.quantity}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">{language === 'fr' ? 'Description du besoin' : 'Description of needs'}</Label>
                          <Textarea 
                            id="description" 
                            name="description" 
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder={language === 'fr' ? 'Décrivez votre projet...' : 'Describe your project...'}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="budget">{language === 'fr' ? 'Budget estimé (optionnel)' : 'Estimated budget (optional)'}</Label>
                          <Select 
                            value={formData.budget} 
                            onValueChange={(value) => handleSelectChange('budget', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={language === 'fr' ? 'Sélectionner' : 'Select'} />
                            </SelectTrigger>
                            <SelectContent>
                              {budgetOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="deadline">{language === 'fr' ? 'Délai souhaité (optionnel)' : 'Desired deadline (optional)'}</Label>
                          <Select 
                            value={formData.deadline} 
                            onValueChange={(value) => handleSelectChange('deadline', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={language === 'fr' ? 'Sélectionner' : 'Select'} />
                            </SelectTrigger>
                            <SelectContent>
                              {deadlineOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, CheckCircle, ShoppingCart, MessageCircle, ArrowRight, ChevronDown, Building2, User, Mail, Phone, PackageOpen } from 'lucide-react';
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
  const [expandedCategories, setExpandedCategories] = useState<string[]>([categories[0]?.id]); // Première catégorie ouverte par défaut
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
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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
        title: language === 'fr' ? 'Sélection vide' : 'Empty selection',
        description: language === 'fr' ? 'Veuillez choisir au moins un produit.' : 'Please select at least one product.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await sendQuoteEmail({
        ...formData,
        products: getSelectedProductsText(),
      });
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Submission failed. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppMessage = () => {
    const productsList = selectedProducts.map(ref => {
      const p = products.find(prod => prod.reference === ref);
      return p ? `• ${p.name[language]}` : ref;
    }).join('\n');
    return language === 'fr' 
      ? `DEVIS SICAF\n----------\nProduits :\n${productsList}\n\nQuantité: ${formData.quantity || 'À préciser'}`
      : `SICAF QUOTE\n----------\nProducts :\n${productsList}\n\nQuantity: ${formData.quantity || 'TBD'}`;
  };

  const budgetOptions = [
    { value: 'less-100k', label: language === 'fr' ? '< 100 000 FCFA' : '< 100,000 FCFA' },
    { value: '100k-500k', label: '100 000 - 500 000 FCFA' },
    { value: '500k-1m', label: '500 000 - 1 000 000 FCFA' },
    { value: 'more-1m', label: language === 'fr' ? '> 1 000 000 FCFA' : '> 1,000,000 FCFA' },
  ];

  return (
    <Layout>
      <WhatsAppButton variant="floating" />

      {/* Hero Section */}
      <section className="bg-primary text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-heading text-4xl md:text-6xl font-black mb-6 uppercase italic tracking-tighter">
            {t('quote.title')}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto font-medium">
            {t('quote.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          {isSubmitted ? (
            <Card className="max-w-2xl mx-auto border-t-8 border-green-500 shadow-2xl">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-black uppercase italic mb-4">{language === 'fr' ? 'Demande Reçue !' : 'Request Received!'}</h2>
                <p className="text-slate-600 mb-8 font-medium">
                    {language === 'fr' 
                        ? 'Nos experts analysent votre besoin. Pour une réponse en moins de 15 minutes, utilisez WhatsApp.'
                        : 'Our experts are reviewing your needs. For a response in under 15 minutes, use WhatsApp.'}
                </p>

                <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-dashed border-slate-300">
                    <a href={getWhatsAppUrl(getWhatsAppMessage())} target="_blank" rel="noopener noreferrer"
                       className="flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 rounded-lg font-black uppercase tracking-widest hover:bg-[#1eb959] transition-all shadow-lg">
                        <MessageCircle className="h-6 w-6 fill-current" />
                        {language === 'fr' ? 'Priorité WhatsApp' : 'WhatsApp Priority'}
                        <ArrowRight className="h-5 w-5" />
                    </a>
                </div>

                <Button variant="outline" className="font-bold uppercase tracking-widest" onClick={() => setIsSubmitted(false)}>
                    {language === 'fr' ? 'Nouvelle demande' : 'New request'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* 1. Selection de produits */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-primary text-white p-2 rounded">
                        <ShoppingCart className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tight">{t('quote.select_products')}</h2>
                  </div>

                  <div className="space-y-3">
                    {categories.map((cat) => (
                      <div key={cat.id} className="bg-white border rounded-xl shadow-sm overflow-hidden transition-all hover:border-primary/30">
                        <button type="button" onClick={() => toggleCategory(cat.id)}
                                className="w-full px-6 py-4 flex items-center justify-between text-left group">
                          <span className="flex items-center gap-4 font-bold uppercase tracking-wider text-sm">
                            <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">{cat.icon}</span>
                            {cat.name[language]}
                            {selectedProducts.filter(ref => products.find(p => p.reference === ref)?.category === cat.id).length > 0 && (
                                <Badge className="bg-secondary ml-2">
                                    {selectedProducts.filter(ref => products.find(p => p.reference === ref)?.category === cat.id).length}
                                </Badge>
                            )}
                          </span>
                          <ChevronDown className={`h-5 w-5 transition-transform ${expandedCategories.includes(cat.id) ? 'rotate-180' : ''}`} />
                        </button>

                        {expandedCategories.includes(cat.id) && (
                          <div className="px-6 pb-4 pt-2 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-2">
                            {products.filter(p => p.category === cat.id).map((prod) => (
                              <label key={prod.reference} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedProducts.includes(prod.reference) ? 'bg-primary/5 border-primary/20 shadow-inner' : 'hover:bg-slate-50 border-transparent'}`}>
                                <Checkbox checked={selectedProducts.includes(prod.reference)} onCheckedChange={() => toggleProduct(prod.reference)} className="mt-1" />
                                <div className="leading-tight">
                                  <div className="font-bold text-sm text-slate-800 italic">{prod.name[language]}</div>
                                  <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">{prod.reference}</div>
                                </div>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Formulaire Contact */}
                <div className="lg:col-span-5">
                  <Card className="shadow-2xl border-none sticky top-28 overflow-hidden">
                    <div className="bg-slate-900 text-white p-6">
                        <h3 className="font-black uppercase italic tracking-widest text-lg flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-secondary" />
                            {language === 'fr' ? 'Vos coordonnées' : 'Contact Details'}
                        </h3>
                    </div>
                    <CardContent className="p-8 space-y-5">
                      <div className="grid grid-cols-1 gap-5">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center gap-2"><User className="h-3 w-3"/> {language === 'fr' ? 'Nom Complet' : 'Full Name'}</Label>
                          <Input name="name" value={formData.name} onChange={handleChange} required className="rounded-none border-0 border-b-2 border-slate-200 focus-visible:ring-0 focus-visible:border-primary px-0 font-bold" placeholder="Jean Dupont" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center gap-2"><Mail className="h-3 w-3"/> Email</Label>
                          <Input name="email" type="email" value={formData.email} onChange={handleChange} required className="rounded-none border-0 border-b-2 border-slate-200 focus-visible:ring-0 focus-visible:border-primary px-0 font-bold" placeholder="contact@entreprise.com" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center gap-2"><Phone className="h-3 w-3"/> {t('contact.phone')}</Label>
                          <Input name="phone" type="tel" value={formData.phone} onChange={handleChange} required className="rounded-none border-0 border-b-2 border-slate-200 focus-visible:ring-0 focus-visible:border-primary px-0 font-bold" placeholder="+237 ..." />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest font-black text-slate-400 flex items-center gap-2"><PackageOpen className="h-3 w-3"/> {t('quote.quantity')}</Label>
                          <Input name="quantity" value={formData.quantity} onChange={handleChange} className="rounded-none border-0 border-b-2 border-slate-200 focus-visible:ring-0 focus-visible:border-primary px-0 font-bold" placeholder="ex: 200 Litres, 5 Tonnes..." />
                        </div>
                      </div>

                      <div className="pt-4">
                        <Button type="submit" disabled={isSubmitting} size="lg" className="w-full h-16 font-black uppercase tracking-[0.2em] italic shadow-xl group">
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin text-xl">◌</span> {language === 'fr' ? 'Traitement...' : 'Processing...'}
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                                {t('quote.submit')} <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </span>
                          )}
                        </Button>
                      </div>

                      <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            {selectedProducts.length > 0 
                                ? `${selectedProducts.length} ${language === 'fr' ? 'produits sélectionnés' : 'products selected'}`
                                : language === 'fr' ? 'Aucun produit sélectionné' : 'No product selected'}
                        </p>
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

// Helper Badge component if not imported
const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold text-white ${className}`}>
        {children}
    </span>
);

export default Quote;

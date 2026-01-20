import { useState } from 'react';
import { Send, CheckCircle, ShoppingCart, MessageCircle, ArrowRight, ClipboardCheck, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { products, categories } from '@/data/products';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
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
        description: language === 'fr' ? 'Choisissez au moins un produit.' : 'Select at least one product.',
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
      toast({ title: language === 'fr' ? 'Demande envoyée' : 'Request sent' });
    } catch (error) {
      toast({ title: 'Erreur technique', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppMessage = () => {
    const productsText = selectedProducts.map(ref => {
      const product = products.find(p => p.reference === ref);
      return product ? `• ${product.name[language]}` : ref;
    }).join('\n');
    return `Bonjour SICAF, demande de devis pour :\n${productsText}\n\nQuantité: ${formData.quantity || 'À préciser'}`;
  };

  return (
    <Layout>
      <WhatsAppButton variant="floating" />

      {/* 1. HERO - Bordure 3px */}
      <section className="relative pt-32 pb-20 bg-slate-900 border-t-[3px] border-accent overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl border-l-[3px] border-accent pl-8">
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter mb-4">
              {t('quote.title')}
            </h1>
            <p className="text-xl text-slate-400 font-bold uppercase italic tracking-wide">
              Configuration de commande industrielle & logistique.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          {isSubmitted ? (
            /* Success State */
            <div className="max-w-3xl mx-auto bg-white border-[2.5px] border-slate-900 p-12 text-center shadow-[6px_6px_0px_0px_rgba(34,197,94,1)]">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">TRANSMISSION RÉUSSIE</h2>
              <p className="text-slate-600 font-bold mb-8 uppercase italic">Nos ingénieurs analysent votre demande. Réponse sous 24h.</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <a href={getWhatsAppUrl(getWhatsAppMessage())} className="bg-[#25D366] text-white p-5 font-black uppercase flex items-center justify-center gap-3 hover:bg-slate-900 transition-all border-b-[3px] border-green-600">
                  <MessageCircle /> PRIORITÉ WHATSAPP
                </a>
                <Button onClick={() => window.location.reload()} variant="outline" className="h-full rounded-none border-[2px] border-slate-900 font-black uppercase">
                  NOUVELLE DEMANDE
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-12 items-start">
              
              {/* 1. PRODUCT SELECTION (7/12) */}
              <div className="lg:col-span-7 space-y-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-slate-900 text-white p-3 border-b-[3px] border-accent">
                    <ShoppingCart size={24} />
                  </div>
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter">1. Composés & Références</h2>
                </div>

                <div className="grid gap-4">
                  {categories.map((category) => {
                    const categoryProducts = products.filter(p => p.category === category.id);
                    const isExpanded = expandedCategories.includes(category.id);
                    const selectedCount = categoryProducts.filter(p => selectedProducts.includes(p.reference)).length;

                    return (
                      <div key={category.id} className={`border-[1.5px] transition-all ${isExpanded ? 'border-accent bg-white shadow-sm' : 'border-slate-200 bg-white hover:border-slate-400'}`}>
                        <button
                          type="button"
                          onClick={() => toggleCategory(category.id)}
                          className="w-full p-6 flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-3xl group-hover:scale-110 transition-transform">{category.icon}</span>
                            <div className="text-left">
                              <span className="block font-black uppercase tracking-widest text-lg group-hover:text-accent transition-colors leading-none">
                                {category.name[language]}
                              </span>
                              <span className="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase">Disponibilité : {categoryProducts.length} Réf</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {selectedCount > 0 && (
                              <div className="bg-accent text-slate-900 font-black px-2 py-1 text-[10px] border border-slate-900">
                                {selectedCount} SÉL.
                              </div>
                            )}
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="p-6 pt-0 grid sm:grid-cols-2 gap-3 border-t-[1.5px] border-dashed border-slate-100 mt-2">
                            {categoryProducts.map((product) => (
                              <label
                                key={product.reference}
                                className={`flex items-center gap-3 p-4 border-[1.5px] cursor-pointer transition-all ${
                                  selectedProducts.includes(product.reference) 
                                  ? 'border-slate-900 bg-slate-900 text-white shadow-[3px_3px_0px_0px_rgba(251,146,60,1)]' 
                                  : 'border-slate-100 bg-slate-50 hover:border-accent'
                                }`}
                              >
                                <Checkbox
                                  className="border-accent data-[state=checked]:bg-accent data-[state=checked]:text-slate-900"
                                  checked={selectedProducts.includes(product.reference)}
                                  onCheckedChange={() => toggleProduct(product.reference)}
                                />
                                <div className="flex flex-col">
                                  <span className="font-black uppercase text-xs tracking-tighter leading-tight">{product.name[language]}</span>
                                  <span className={`text-[10px] font-mono font-bold ${selectedProducts.includes(product.reference) ? 'text-accent' : 'text-slate-400'}`}>
                                    #{product.reference}
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
              </div>

              {/* 2. CLIENT INFO (5/12) */}
              <div className="lg:col-span-5 lg:sticky lg:top-24">
                <div className="bg-white border-[2.5px] border-slate-900 p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
                  <div className="flex items-center gap-3 mb-8 border-b-[2px] border-slate-900 pb-4">
                    <ClipboardCheck className="text-accent" />
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">2. Validation Industrielle</h2>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <Label className="font-black uppercase text-[10px] tracking-widest text-slate-500">Nom Complet / Entreprise</Label>
                      <Input name="name" onChange={handleChange} className="rounded-none border-[1.5px] border-slate-200 focus:border-accent h-12 font-bold" required />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="font-black uppercase text-[10px] tracking-widest text-slate-500">Email Professionnel</Label>
                        <Input name="email" type="email" onChange={handleChange} className="rounded-none border-[1.5px] border-slate-200 focus:border-accent h-12 font-bold" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="font-black uppercase text-[10px] tracking-widest text-slate-500">Téléphone</Label>
                        <Input name="phone" type="tel" onChange={handleChange} className="rounded-none border-[1.5px] border-slate-200 focus:border-accent h-12 font-bold" required />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="font-black uppercase text-[10px] tracking-widest text-slate-500">Volume & Conditionnement</Label>
                      <Input name="quantity" onChange={handleChange} placeholder="Ex: 10 Tonnes / IBC 1000L" className="rounded-none border-[1.5px] border-slate-200 focus:border-accent h-12 font-bold" />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="font-black uppercase text-[10px] tracking-widest text-slate-500">Notes Logistiques / Spécifications</Label>
                      <Textarea name="description" onChange={handleChange} className="rounded-none border-[1.5px] border-slate-200 focus:border-accent font-bold" rows={3} />
                    </div>

                    {/* Review area */}
                    <div className="bg-slate-50 p-4 border-[1.5px] border-dashed border-slate-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-black uppercase text-[9px] tracking-widest">Récapitulatif Sélection</span>
                        <span className="bg-slate-900 text-white px-2 py-0.5 font-mono text-[10px]">{selectedProducts.length} ITEM(S)</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProducts.map(ref => (
                          <div key={ref} className="text-[9px] font-black bg-accent/20 px-2 py-1 uppercase border border-accent/30">
                            {ref}
                          </div>
                        ))}
                        {selectedProducts.length === 0 && <span className="text-[10px] italic text-slate-400">Aucun produit sélectionné</span>}
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full h-16 rounded-none bg-slate-900 hover:bg-accent text-white hover:text-slate-900 font-black uppercase tracking-[0.2em] text-lg transition-all border-b-[4px] border-accent active:translate-y-1 shadow-lg"
                    >
                      {isSubmitting ? "TRANSMISSION EN COURS..." : "GÉNÉRER LA DEMANDE"}
                    </Button>

                    <p className="text-[9px] text-center text-slate-400 font-bold uppercase flex items-center justify-center gap-2">
                      <Info size={12} className="text-accent" /> Données protégées • Devis confidentiel sous 24h
                    </p>
                  </div>
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

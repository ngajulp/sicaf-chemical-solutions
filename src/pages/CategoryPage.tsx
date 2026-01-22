import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Factory, 
  Beaker, 
  ChevronRight, 
  AlertCircle,
  PackageCheck
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';

const CategoryPage = () => {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const { categories, loading } = useGitHubProducts();

  // On récupère la catégorie actuelle via l'ID de l'URL
  const category = categories.find(c => c.id === id);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!category) {
    return (
      <Layout>
        <div className="container mx-auto py-20 text-center">
          <h2 className="text-2xl font-bold">Catégorie non trouvée</h2>
          <Link to="/" className="text-primary hover:underline mt-4 block">Retour à l'accueil</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        
        {/* --- SECTION 1 : ENTÊTE D'AUTORITÉ --- */}
        <section className="relative py-16 md:py-24 bg-slate-900 text-white overflow-hidden">
          {/* Fond subtil avec icône géante pour l'aspect industriel */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-1/4 translate-y-1/4">
             <span className="text-[300px] leading-none">{category.icon}</span>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl">
              <nav className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                <Link to="/">{t('nav.home')}</Link>
                <ChevronRight className="h-3 w-3" />
                <span>{t('nav.products')}</span>
              </nav>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight uppercase">
                {category.name[language]}
              </h1>
              
              <p className="text-xl text-slate-300 leading-relaxed max-w-2xl border-l-4 border-primary pl-6">
                {category.description[language]}
              </p>
            </div>
          </div>
        </section>

        {/* --- SECTION 2 : CATALOGUE TECHNIQUE --- */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Colonne Principale : Liste des Capacités */}
              <div className="lg:col-span-2">
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2 uppercase tracking-wide">
                    {language === 'fr' ? "Spécifications de la gamme" : "Range Specifications"}
                  </h2>
                  <div className="h-1 w-20 bg-primary" />
                </div>

                <div className="bg-white border border-slate-200 shadow-sm">
                  {/* Header du tableau */}
                  <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 p-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <div>{language === 'fr' ? "Produit / Solution" : "Product / Solution"}</div>
                    <div className="text-center">{language === 'fr' ? "Pureté Standard" : "Standard Purity"}</div>
                    <div className="text-right">{language === 'fr' ? "État de Stock" : "Stock Status"}</div>
                  </div>

                  {/* Liste des produits (Simulée pour montrer la puissance de l'offre) */}
                  <div className="divide-y divide-slate-100">
                    {[
                      { n: "Solutions Basiques & Alcalines", p: "Technique / AR" },
                      { n: "Composés Acides Concentrés", p: "98% / 33% / CP" },
                      { n: "Solvants de Synthèse", p: "HPLC / ACS" },
                      { n: "Réactifs de Laboratoire", p: "Pure / Ultrapure" },
                      { n: "Additifs de Process", p: "Grade Industriel" },
                    ].map((item, i) => (
                      <div key={i} className="grid grid-cols-3 p-5 items-center hover:bg-slate-50 transition-colors group">
                        <div className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">
                          {item.n}
                        </div>
                        <div className="text-center text-xs text-slate-500 font-mono">
                          {item.p}
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 uppercase">
                            <PackageCheck className="h-3 w-3" />
                            {language === 'fr' ? "Disponible" : "Available"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Note technique de bas de page */}
                  <div className="p-6 bg-slate-900 text-white/60 text-xs italic flex gap-3">
                    <AlertCircle className="h-5 w-5 text-primary shrink-0" />
                    <p>
                      {language === 'fr' 
                        ? "SICAF dispose d'une infrastructure permettant la livraison immédiate sur l'ensemble du territoire. Pour des grades de pureté spécifiques ou des volumes hors-standard (Citernes), notre service technique traite votre demande en priorité."
                        : "SICAF has the infrastructure for immediate delivery across the country. For specific purity grades or non-standard volumes (Tanks), our technical service handles your request as a priority."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Barre Latérale : Logistique et CTA */}
              <div className="space-y-8">
                {/* Bloc de Commande Directe */}
                <div className="bg-slate-100 p-8 border-t-4 border-primary">
                  <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">
                    {language === 'fr' ? "Cotation Immédiate" : "Instant Quote"}
                  </h3>
                  <p className="text-sm text-slate-600 mb-6">
                    {language === 'fr' 
                      ? "Nos ingénieurs technico-commerciaux sont à votre disposition pour chiffrer vos besoins sous 2 heures."
                      : "Our technical sales engineers are available to quote your requirements within 2 hours."}
                  </p>
                  <Link to="/quote">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 text-sm uppercase tracking-widest shadow-lg">
                      Lancer la commande
                    </Button>
                  </Link>
                </div>

                {/* Bloc Logistique (Preuve de Stock) */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Logistique & Volume</h4>
                  
                  <div className="flex items-start gap-4 p-4 border border-slate-100">
                    <Truck className="h-6 w-6 text-primary shrink-0" />
                    <div>
                      <p className="font-bold text-sm uppercase">{language === 'fr' ? "Vrac & Conditionné" : "Bulk & Packaged"}</p>
                      <p className="text-xs text-slate-500 italic">IBC 1000L, Fûts 200L, Sacs 25kg, Flacons 1L.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border border-slate-100">
                    <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
                    <div>
                      <p className="font-bold text-sm uppercase">{language === 'fr' ? "Conformité Totale" : "Full Compliance"}</p>
                      <p className="text-xs text-slate-500 italic">Certificats d'Analyse (CoA) et FDS fournis systématiquement.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 border border-slate-100">
                    <Factory className="h-6 w-6 text-primary shrink-0" />
                    <div>
                      <p className="font-bold text-sm uppercase">{language === 'fr' ? "Continuité" : "Continuity"}</p>
                      <p className="text-xs text-slate-500 italic">Contrats de fourniture annuelle pour sécuriser vos process.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default CategoryPage;

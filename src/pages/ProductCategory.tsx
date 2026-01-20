import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2, Package, Eye, ClipboardList } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
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

  const currentIndex = categories.findIndex(c => c.id === categoryId);
  const prevCategory = currentIndex > 0 ? categories[currentIndex - 1] : null;
  const nextCategory = currentIndex < categories.length - 1 ? categories[currentIndex + 1] : null;

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto" />
        </div>
      </Layout>
    );
  }

  if (!category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-4xl font-black uppercase italic text-slate-900 mb-8">
            Catégorie Inconnue
          </h1>
          <Link to="/catalog">
            <Button className="rounded-none bg-slate-900 h-14 px-8 font-black uppercase border-b-[3px] border-accent">
              RETOUR AU CATALOGUE
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* 1. HERO SECTION - Bordure réduite de 8px à 2.5px */}
      <section className="relative py-20 md:py-24 text-white bg-slate-900 border-t-[2.5px] border-accent">
        {category.img && (
          <>
            <img 
              src={category.img} 
              alt={category.name[language]}
              className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
          </>
        )}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl border-l-[3px] border-accent pl-6">
            <div className="text-4xl mb-3">{category.icon}</div>
            <h1 className="text-4xl md:text-6xl font-black mb-3 uppercase tracking-tighter italic">
              {category.name[language]}
            </h1>
            <p className="text-lg text-slate-300 font-bold uppercase italic bg-slate-800/50 inline-block p-2">
              {category.description[language]}
            </p>
            <div className="mt-6 flex items-center gap-4">
               <span className="bg-accent text-slate-900 font-black px-4 py-1 uppercase text-xs tracking-widest border border-slate-900">
                 {products.length} RÉFÉRENCES
               </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TABLEAU DE DONNÉES TECHNIQUES */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8 border-b-[2px] border-slate-900 pb-4">
            <ClipboardList className="text-accent h-6 w-6" />
            <h2 className="text-xl font-black uppercase tracking-tighter italic text-slate-900">Registre Technique des Produits</h2>
          </div>

          {/* Bordure de table et ombre réduites de 2/3 */}
          <div className="relative border-[2.5px] border-slate-900 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-900 hover:bg-slate-900 border-b-[2px] border-accent">
                    <TableHead className="text-white font-black uppercase tracking-widest py-5">RÉF</TableHead>
                    <TableHead className="text-white font-black uppercase tracking-widest">DESIGNATION</TableHead>
                    <TableHead className="text-white font-black uppercase tracking-widest hidden md:table-cell">APPLICATIONS</TableHead>
                    <TableHead className="text-white font-black uppercase tracking-widest">SPECIFICATIONS</TableHead>
                    <TableHead className="text-white font-black uppercase tracking-widest text-right">ACTION</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow 
                      key={product.reference}
                      className="border-b border-slate-200 hover:bg-slate-50 transition-colors group cursor-pointer"
                      onClick={() => navigate(`/products/${categoryId}/${encodeURIComponent(product.reference)}`)}
                    >
                      <TableCell className="font-mono font-black text-accent py-5">
                        {product.reference}
                      </TableCell>
                      <TableCell className="font-bold text-slate-900 uppercase text-sm">
                        {product.name[language]}
                      </TableCell>
                      <TableCell className="text-slate-500 font-medium hidden md:table-cell max-w-xs truncate italic text-xs">
                        {product.applications[language]}
                      </TableCell>
                      <TableCell>
                        <span className="bg-slate-100 text-slate-700 px-2 py-1 font-black text-[10px] border border-slate-200 uppercase tracking-tighter">
                          {product.specifications}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          className="rounded-none group-hover:bg-accent group-hover:text-slate-900 transition-all p-2 h-auto"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* 3. NAVIGATION INTER-CATÉGORIES - Bordures réduites à 2.5px */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 border-t-[2px] border-slate-100 pt-10">
            <div className="order-2 md:order-1">
              {prevCategory && (
                <Link to={`/products/${prevCategory.id}`} className="group block p-4 border-[2.5px] border-slate-900 hover:border-accent transition-all">
                  <p className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest text-left">Précédent</p>
                  <div className="flex items-center gap-2 font-black text-lg uppercase italic group-hover:text-accent">
                    <ArrowLeft size={16} />
                    {prevCategory.name[language]}
                  </div>
                </Link>
              )}
            </div>

            <div className="order-1 md:order-2 flex items-center justify-center">
              <Link to="/catalog">
                <Button variant="outline" className="rounded-none border-[2px] border-slate-900 font-black uppercase h-12 px-6 hover:bg-slate-900 hover:text-white transition-all text-xs">
                  CATALOGUE COMPLET
                </Button>
              </Link>
            </div>

            <div className="order-3 text-right">
              {nextCategory && (
                <Link to={`/products/${nextCategory.id}`} className="group block p-4 border-[2.5px] border-slate-900 hover:border-accent transition-all text-right">
                  <p className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-widest">Suivant</p>
                  <div className="flex items-center justify-end gap-2 font-black text-lg uppercase italic group-hover:text-accent">
                    {nextCategory.name[language]}
                    <ArrowRight size={16} />
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* 4. APPEL À L'ACTION FINAL - Bordure de fond réduite à 3px */}
          <div className="mt-20 bg-slate-900 p-10 relative overflow-hidden text-center border-b-[3px] border-accent shadow-[0px_10px_30px_-15px_rgba(0,0,0,0.3)]">
             <div className="relative z-10">
                <h3 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-6">
                  Besoin d'un volume industriel ?
                </h3>
                <Link to="/quote">
                  <Button className="bg-accent hover:bg-white text-slate-900 h-14 px-10 rounded-none font-black uppercase tracking-[0.15em] text-lg transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]">
                    {t('nav.quote')}
                  </Button>
                </Link>
             </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductCategory;

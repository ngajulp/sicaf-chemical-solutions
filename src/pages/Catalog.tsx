import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, Filter, ChevronRight, Loader2, Beaker, Factory } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

// Réutilisation du composant WatermarkOverlay
const WatermarkOverlay: React.FC<{
  image: string;
  opacity?: number;
  size?: string | number;
  variant?: 'light' | 'dark'; 
  zIndex?: number;
  repeat?: 'repeat' | 'no-repeat';
}> = ({ image, opacity = 0.2, size = 'cover', variant = 'dark', zIndex = 0, repeat = 'no-repeat' }) => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `url(${image})`,
      backgroundRepeat: repeat,
      backgroundSize: typeof size === 'number' ? `${size}px` : size,
      opacity,
      zIndex,
      filter: variant === 'light' ? 'brightness(0) invert(1) contrast(1.5)' : 'grayscale(100%) contrast(1.3)',
    } as React.CSSProperties}
  />
);

const Catalog = () => {
  const { t, language } = useLanguage();
  const { products, categories, loading, searchProducts, getProductsByCategory } = useGitHubProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const LOGO_URL = "https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/sicaf.png";
  const IMG_LAB = "https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/industriechimie.png";

  const filteredProducts = useMemo(() => {
    let result = products;
    if (selectedCategory !== 'all') result = getProductsByCategory(selectedCategory);
    if (searchQuery) {
      result = searchProducts(searchQuery, language);
      if (selectedCategory !== 'all') result = result.filter(p => p.category === selectedCategory);
    }
    return result;
  }, [searchQuery, selectedCategory, language, products, searchProducts, getProductsByCategory]);

  const handleDownloadBrochure = () => {
    alert(language === 'fr' ? 'Le téléchargement de la brochure va commencer...' : 'Brochure download will start...');
  };

  return (
    <Layout>
      {/* 1. HERO SECTION */}
      <section className="relative py-24 md:py-32 text-white overflow-hidden bg-slate-900 border-t-8 border-accent">
        <WatermarkOverlay image={IMG_LAB} variant="dark" opacity={0.4} zIndex={0} />
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl border-l-4 border-accent pl-8 md:pl-12">
            <h1 className="text-5xl md:text-7xl font-black mb-4 uppercase tracking-tighter italic">
              {t('catalog.title')}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-bold uppercase italic bg-slate-800/50 inline-block p-2">
              {t('catalog.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* 2. FILTERS BAR (Brutaliste) */}
      <section className="py-8 bg-white border-t-8 border-accent sticky top-0 z-30 shadow-xl">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="search"
                placeholder={t('catalog.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 rounded-none border-2 border-slate-200 focus:border-accent focus:ring-0 text-lg font-bold"
              />
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-72 h-14 rounded-none border-2 border-slate-200 font-bold uppercase tracking-wider">
                  <SelectValue placeholder={t('catalog.filter')} />
                </SelectTrigger>
                <SelectContent className="rounded-none border-2 border-slate-900">
                  <SelectItem value="all">{t('catalog.all')}</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name[language]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={handleDownloadBrochure} className="h-14 rounded-none bg-slate-900 hover:bg-accent text-white px-8 gap-3 font-black uppercase tracking-widest transition-all">
                <Download className="h-5 w-5" />
                <span className="hidden sm:inline">{t('catalog.download')}</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN CONTENT */}
      <section className="py-12 bg-slate-50 border-t-8 border-accent border-b-8 border-accent min-h-screen">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="h-16 w-16 animate-spin text-accent" />
            </div>
          ) : (
            <>
              {/* Categories Grid (Visuels comme Index) */}
              {selectedCategory === 'all' && !searchQuery && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-slate-200 border-4 border-slate-200 mb-16">
                  {categories.map((category) => (
                    <Link key={category.id} to={`/products/${category.id}`} className="group bg-white p-12 hover:bg-slate-900 transition-all duration-500">
                      <div className="text-accent group-hover:text-white mb-6 transform group-hover:scale-110 transition-transform">
                        <Beaker size={48} strokeWidth={2.5} />
                      </div>
                      <h3 className="font-black text-2xl text-slate-900 group-hover:text-white uppercase mb-2">
                        {category.name[language]}
                      </h3>
                      <p className="text-slate-500 group-hover:text-slate-400 font-bold text-sm uppercase">
                        {products.filter(p => p.category === category.id).length} {language === 'fr' ? 'Produits disponibles' : 'Products available'}
                      </p>
                    </Link>
                  ))}
                </div>
              )}

              {/* Products Table (Style Technique) */}
              <div className="bg-white border-4 border-slate-900 shadow-[10px_10px_0px_0px_rgba(251,146,60,1)]">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-900 hover:bg-slate-900 border-b-4 border-accent">
                        <TableHead className="text-white font-black uppercase tracking-widest py-6 px-8">REF</TableHead>
                        <TableHead className="text-white font-black uppercase tracking-widest py-6 px-8">{t('table.product')}</TableHead>
                        <TableHead className="text-white font-black uppercase tracking-widest py-6 px-8 hidden md:table-cell">{t('table.applications')}</TableHead>
                        <TableHead className="text-white font-black uppercase tracking-widest py-6 px-8 text-right">SPEC</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product, index) => (
                        <TableRow 
                          key={product.reference}
                          className={`hover:bg-accent/5 border-b border-slate-100 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                        >
                          <TableCell className="font-black text-slate-900 py-6 px-8 text-lg">{product.reference}</TableCell>
                          <TableCell className="font-bold text-slate-700 py-6 px-8">{product.name[language]}</TableCell>
                          <TableCell className="text-slate-500 font-medium py-6 px-8 hidden md:table-cell max-w-md">{product.applications[language]}</TableCell>
                          <TableCell className="py-6 px-8 text-right">
                            <span className="inline-block bg-slate-900 text-white px-4 py-1 font-black text-xs uppercase tracking-tighter">
                              {product.specifications}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {filteredProducts.length === 0 && (
                  <div className="p-20 text-center bg-slate-50">
                    <p className="text-2xl font-black text-slate-400 uppercase italic">
                      {language === 'fr' ? 'Aucune donnée correspondante' : 'No matching data'}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Catalog;

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Globe, Settings, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import logo from '@/assets/logo.png';

interface IndustryItem {
  ID: number;
  categorie: string;
}

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  
  const [industryData, setIndustryData] = useState<IndustryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/productsindustries.json')
      .then(res => res.json())
      .then(data => {
        setIndustryData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-card shadow-md">
      <div className="gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center text-xs font-bold">
          <div className="hidden md:flex items-center gap-6">
            <span>📞 +237 691 83 70 39</span>
            <span>✉️ sicaf@chimistry.com</span>
          </div>
          <div className="flex items-center gap-2 ml-auto uppercase tracking-widest">
            <button onClick={() => setLanguage('fr')} className={`px-2 py-1 rounded ${language === 'fr' ? 'bg-white text-primary' : ''}`}>FR</button>
            <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded ${language === 'en' ? 'bg-white text-primary' : ''}`}>EN</button>
          </div>
        </div>
      </div>

      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="SICAF Logo" className="h-10 w-auto" />
          <div className="hidden sm:block border-l pl-3">
            <p className="text-[10px] font-black uppercase leading-none">SICAF S.A.</p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          <Link to="/" className={`text-xs font-black uppercase tracking-widest ${isActive('/') ? 'text-primary' : ''}`}>{t('nav.home')}</Link>
          
          <DropdownMenu open={isProductsOpen} onOpenChange={setIsProductsOpen}>
            <DropdownMenuTrigger className="flex items-center gap-1 text-xs font-black uppercase tracking-widest outline-none">
              {t('nav.products')} <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card p-6 shadow-2xl border-t-4 border-primary min-w-[600px]" align="center">
              {loading ? <Loader2 className="animate-spin mx-auto text-primary" /> : (
                <div className="grid grid-cols-2 gap-4">
                  {industryData.map((item) => (
                    <DropdownMenuItem key={item.ID} asChild>
                      <Link to={`/products/${item.ID}`} className="p-3 border-b hover:bg-slate-50 flex justify-between group">
                        <span className="text-[10px] font-bold uppercase text-slate-700 group-hover:text-primary transition-colors">
                            {item.categorie}
                        </span>
                        <ChevronDown className="h-3 w-3 -rotate-90 opacity-0 group-hover:opacity-100" />
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/catalog" className={`text-xs font-black uppercase tracking-widest ${isActive('/catalog') ? 'text-primary' : ''}`}>{t('nav.catalog')}</Link>
          <Link to="/contact" className={`text-xs font-black uppercase tracking-widest ${isActive('/contact') ? 'text-primary' : ''}`}>{t('nav.contact')}</Link>
          
          <Link to="/quote">
            <Button className="bg-slate-900 text-white rounded-none font-black text-[10px] uppercase tracking-widest px-6">
              {t('nav.quote')}
            </Button>
          </Link>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2">
          {isOpen ? <X /> : <Menu />}
        </button>
      </nav>
    </header>
  );
};

export default Header;

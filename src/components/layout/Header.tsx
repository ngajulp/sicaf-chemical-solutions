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

// Interface alignée sur votre productsindustries.json (Tableau)
interface IndustryItem {
  ID: number;
  categorie: string;
  expertise: string;
}

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  
  const [industryData, setIndustryData] = useState<IndustryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Synchronisation avec le répertoire GitHub
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/productsindustries.json');
        const data = await response.json();
        setIndustryData(data);
      } catch (error) {
        console.error("Erreur de synchronisation du menu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenuData();
  }, []);

  const isActive = (path: string) => location.pathname === path;

  // Configuration des liens principaux
  const mainNav = [
    { path: '/', label: 'nav.home' },
    { path: '/catalog', label: 'nav.catalog' },
    { path: '/contact', label: 'nav.contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-card shadow-md">
      {/* 1. TOP BAR SICAF */}
      <div className="gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center text-[11px]">
          <div className="hidden md:flex items-center gap-6 font-black uppercase tracking-widest opacity-90">
            <span>📞 +237 691 83 70 39</span>
            <span>✉️ sicaf@chimistry.com</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Globe className="h-3 w-3 opacity-50" />
            <button
              onClick={() => setLanguage('fr')}
              className={`px-2 py-0.5 rounded-sm font-black transition-all ${language === 'fr' ? 'bg-white text-primary' : 'hover:bg-white/10'}`}
            >
              FR
            </button>
            <span className="opacity-20">|</span>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded-sm font-black transition-all ${language === 'en' ? 'bg-white text-primary' : 'hover:bg-white/10'}`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION PRINCIPALE */}
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="SICAF Logo" className="h-10 md:h-12 w-auto" />
            <div className="hidden sm:block border-l border-slate-200 pl-3">
              <p className="text-[10px] font-black uppercase tracking-tighter text-slate-800 leading-none">SICAF S.A.</p>
              <p className="text-[8px] text-primary font-bold uppercase tracking-[0.2em] mt-1">Industrial Solutions</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className={`text-xs font-black uppercase tracking-widest hover:text-primary transition-colors ${isActive('/') ? 'text-primary' : 'text-slate-600'}`}>
              {t('nav.home')}
            </Link>

            {/* --- MEGA MENU DYNAMIQUE --- */}
            <DropdownMenu open={isProductsOpen} onOpenChange={setIsProductsOpen}>
              <DropdownMenuTrigger className="flex items-center gap-1 text-xs font-black uppercase tracking-widest hover:text-primary outline-none group transition-colors">
                {t('nav.products')}
                <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isProductsOpen ? 'rotate-180 text-primary' : ''}`} />
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-card p-6 shadow-2xl border-t-4 border-primary min-w-[700px] mt-2 animate-in fade-in slide-in-from-top-2" align="center">
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  <div className="col-span-2 mb-4 border-b border-slate-50 pb-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Divisions Techniques</p>
                  </div>
                  
                  {loading ? (
                    <div className="col-span-2 py-6 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary/30" /></div>
                  ) : (
                    industryData.map((item) => (
                      <DropdownMenuItem key={item.ID} asChild>
                        <Link
                          to={`/products/${item.ID}`}
                          className="flex items-center justify-between p-3 border-b border-transparent hover:border-secondary hover:bg-slate-50 transition-all group cursor-pointer"
                        >
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-slate-700 group-hover:text-primary">{item.categorie}</span>
                            <span className="text-[8px] text-slate-400 italic line-clamp-1">{item.expertise}</span>
                          </div>
                          <ChevronDown className="-rotate-90 h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-secondary" />
                        </Link>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                   <p className="text-[9px] italic text-slate-400 font-medium">Répertoire synchronisé en temps réel</p>
                   <Link to="/catalog" className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline">Voir tout le catalogue</Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {mainNav.slice(1).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-black uppercase tracking-widest hover:text-primary transition-colors ${isActive(link.path) ? 'text-primary' : 'text-slate-600'}`}
              >
                {t(link.label)}
              </Link>
            ))}

            <Link to="/quote">
              <Button className="bg-slate-900 text-white hover:bg-primary font-black uppercase tracking-widest text-[10px] px-8 h-11 rounded-none shadow-xl transition-all active:scale-95">
                {t('nav.quote')}
              </Button>
            </Link>

            <Link to="/admin" className="ml-2 opacity-20 hover:opacity-100 transition-opacity">
              <Settings className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Burger Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-slate-900">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* 3. MENU MOBILE */}
        {isOpen && (
          <div className="lg:hidden mt-4 pb-8 border-t border-slate-100 pt-6 flex flex-col gap-5 animate-in slide-in-from-right-5">
            {mainNav.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={`text-xs font-black uppercase tracking-widest ${isActive(link.path) ? 'text-primary' : 'text-slate-700'}`}>
                {t(link.label)}
              </Link>
            ))}
            
            <div className="py-4 border-y border-slate-50">
              <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-4">Nos Solutions par Secteur</p>
              <div className="grid grid-cols-1 gap-3">
                {industryData.map((item) => (
                  <Link key={item.ID} to={`/products/${item.ID}`} onClick={() => setIsOpen(false)} className="text-[11px] font-bold text-slate-500 uppercase flex items-center justify-between hover:text-primary">
                    {item.categorie} <ChevronDown className="-rotate-90 h-3 w-3" />
                  </Link>
                ))}
              </div>
            </div>

            <Link to="/quote" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-slate-900 text-white font-black uppercase tracking-[0.2em] py-8 rounded-none shadow-2xl">
                DEMANDER UN DEVIS
              </Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;

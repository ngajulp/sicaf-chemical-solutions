import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Globe, Settings, Loader2, ArrowRight } from 'lucide-react';
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
  expertise: string;
}

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [industryData, setIndustryData] = useState<IndustryItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-lg border-b border-slate-100">
      {/* 1. TOP BAR */}
      <div className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-2.5 flex justify-between items-center">
          <div className="hidden md:flex items-center gap-8 text-[12px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-2"><span className="text-secondary">●</span> +237 691 83 70 39</span>
            <span className="flex items-center gap-2"><span className="text-secondary">●</span> sicaf@chimistry.com</span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <Globe className="h-4 w-4 text-secondary" />
            <div className="flex bg-white/10 p-0.5 rounded">
              <button onClick={() => setLanguage('fr')} className={`px-3 py-1 rounded text-[11px] font-black transition-all ${language === 'fr' ? 'bg-secondary text-slate-900' : 'text-white hover:bg-white/5'}`}>FR</button>
              <button onClick={() => setLanguage('en')} className={`px-3 py-1 rounded text-[11px] font-black transition-all ${language === 'en' ? 'bg-secondary text-slate-900' : 'text-white hover:bg-white/5'}`}>EN</button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION PRINCIPALE */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4">
            <img src={logo} alt="SICAF Logo" className="h-12 md:h-14 w-auto object-contain" />
            <div className="hidden xl:block border-l-2 border-slate-100 pl-4">
              <p className="text-sm font-black uppercase tracking-tighter text-slate-900 leading-none mb-1">SICAF S.A.</p>
              <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">Expertise Chimique</p>
            </div>
          </Link>

          {/* Menu Desktop avec "À Propos" réintégré */}
          <div className="hidden lg:flex items-center gap-7">
            <Link to="/" className={`text-[13px] font-black uppercase tracking-widest hover:text-primary transition-colors ${isActive('/') ? 'text-primary' : 'text-slate-600'}`}>
              {t('nav.home')}
            </Link>

            <Link to="/about" className={`text-[13px] font-black uppercase tracking-widest hover:text-primary transition-colors ${isActive('/about') ? 'text-primary' : 'text-slate-600'}`}>
              {t('nav.about')}
            </Link>

            {/* MEGA MENU PRODUITS */}
            <DropdownMenu open={isProductsOpen} onOpenChange={setIsProductsOpen}>
              <DropdownMenuTrigger className="flex items-center gap-2 text-[13px] font-black uppercase tracking-widest hover:text-primary outline-none transition-all group">
                {t('nav.products')}
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isProductsOpen ? 'rotate-180 text-secondary' : 'text-slate-400'}`} />
              </DropdownMenuTrigger>

              <DropdownMenuContent 
                className="bg-white p-10 shadow-[0_40px_80px_rgba(0,0,0,0.15)] border-t-[6px] border-primary w-[95vw] max-w-[1100px] mt-4 animate-in fade-in slide-in-from-top-4" 
                align="center"
              >
                <div className="grid grid-cols-12 gap-10">
                  <div className="col-span-4 border-r border-slate-100 pr-10">
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 mb-4">
                      Nos Divisions <br/><span className="text-primary">Industrielles</span>
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                      Solutions chimiques haute performance pour les industries africaines.
                    </p>
                    <Link to="/catalog" onClick={() => setIsProductsOpen(false)}>
                      <Button variant="outline" className="border-primary text-primary font-black uppercase tracking-widest text-[10px] rounded-none hover:bg-primary hover:text-white w-full h-12">
                        Catalogue Complet
                      </Button>
                    </Link>
                  </div>

                  <div className="col-span-8 grid grid-cols-2 gap-x-12 gap-y-2">
                    {loading ? (
                      <div className="col-span-2 py-12 flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary/20" /></div>
                    ) : (
                      industryData.map((item) => (
                        <DropdownMenuItem key={item.ID} asChild>
                          <Link
                            to={`/products/${item.ID}`}
                            className="group flex items-center gap-4 p-4 border-l-4 border-transparent hover:border-secondary hover:bg-slate-50 transition-all cursor-pointer"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-black uppercase tracking-tight text-slate-800 group-hover:text-primary">
                                {item.categorie}
                              </span>
                            </div>
                            <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-secondary" />
                          </Link>
                        </DropdownMenuItem>
                      ))
                    )}
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/catalog" className={`text-[13px] font-black uppercase tracking-widest hover:text-primary transition-colors ${isActive('/catalog') ? 'text-primary' : 'text-slate-600'}`}>
              {t('nav.catalog')}
            </Link>

            <Link to="/contact" className={`text-[13px] font-black uppercase tracking-widest hover:text-primary transition-colors ${isActive('/contact') ? 'text-primary' : 'text-slate-600'}`}>
              {t('nav.contact')}
            </Link>

            <Link to="/quote">
              <Button className="bg-primary text-white hover:bg-slate-900 font-black uppercase tracking-[0.2em] text-[11px] px-8 h-12 rounded-none shadow-xl transition-all">
                {t('nav.quote')}
              </Button>
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-slate-900 bg-slate-50 rounded">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* MENU MOBILE */}
        {isOpen && (
          <div className="lg:hidden fixed inset-0 top-[110px] bg-white z-50 p-6 overflow-y-auto animate-in slide-in-from-right-5">
            <div className="flex flex-col gap-6">
              <Link to="/" onClick={() => setIsOpen(false)} className="text-xl font-black uppercase tracking-tighter border-b pb-4">Accueil</Link>
              <Link to="/about" onClick={() => setIsOpen(false)} className="text-xl font-black uppercase tracking-tighter border-b pb-4">À Propos</Link>
              
              <div className="py-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-6">Secteurs d'activité</p>
                <div className="grid grid-cols-1 gap-6 ml-2">
                  {industryData.map((item) => (
                    <Link key={item.ID} to={`/products/${item.ID}`} onClick={() => setIsOpen(false)} className="text-sm font-black uppercase text-slate-800">
                      {item.categorie}
                    </Link>
                  ))}
                </div>
              </div>

              <Link to="/catalog" onClick={() => setIsOpen(false)} className="text-xl font-black uppercase tracking-tighter border-t pt-6">Catalogue</Link>
              <Link to="/contact" onClick={() => setIsOpen(false)} className="text-xl font-black uppercase tracking-tighter border-b pb-6">Contact</Link>
              
              <Link to="/quote" onClick={() => setIsOpen(false)} className="mt-4">
                <Button className="w-full bg-primary text-white font-black uppercase tracking-[0.2em] py-8 rounded-none">DEVIS PROFORMA</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Globe, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import logo from '@/assets/logo.png';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const { categories, loading } = useGitHubProducts();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'nav.home' },
    { path: '/about', label: 'nav.about' },
    { path: '/catalog', label: 'nav.catalog' },
    { path: '/contact', label: 'nav.contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-card shadow-md">
      {/* Top bar (Exactement votre style original) */}
      <div className="gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center text-sm">
          <div className="hidden md:flex items-center gap-4">
            <span>📞 +237 691 83 70 39</span>
            <span>✉️ sicaf@chimistry.com</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Globe className="h-4 w-4" />
            <button
              onClick={() => setLanguage('fr')}
              className={`px-2 py-1 rounded ${language === 'fr' ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              FR
            </button>
            <span>|</span>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded ${language === 'en' ? 'bg-white/20' : 'hover:bg-white/10'}`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="SICAF Logo" className="h-12 w-auto" />
            <div className="hidden sm:block">
              <p className="text-xs text-muted-foreground leading-tight">
                Société des industries chimiques d'afrique
              </p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors hover:text-primary ${isActive(link.path) ? 'text-primary' : 'text-foreground'}`}
              >
                {t(link.label)}
              </Link>
            ))}

            {/* --- MEGA MENU PRODUITS --- */}
            <DropdownMenu open={isProductsOpen} onOpenChange={setIsProductsOpen}>
              <DropdownMenuTrigger className="flex items-center gap-1 font-medium transition-colors hover:text-primary outline-none">
                {t('nav.products')}
                <ChevronDown className={`h-4 w-4 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} />
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-card p-6 shadow-2xl border-t-2 border-primary min-w-[800px]" align="center">
                {loading ? (
                  <p className="p-4 text-center text-sm italic text-muted-foreground">Chargement...</p>
                ) : (
                  <div className="grid grid-cols-3 gap-x-8 gap-y-2">
                    {categories.map((category) => (
                      <DropdownMenuItem key={category.id} asChild className="p-0 focus:bg-transparent">
                        <Link
                          to={`/products/${category.id}`}
                          className="group flex items-center gap-3 py-3 border-b border-border/50 hover:border-primary transition-all cursor-pointer"
                        >
                          <span className="text-xl group-hover:scale-110 transition-transform">{category.icon}</span>
                          <span className="text-[11px] font-bold uppercase tracking-wide text-foreground/80 group-hover:text-primary">
                            {category.name[language]}
                          </span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {navLinks.slice(2).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors hover:text-primary ${isActive(link.path) ? 'text-primary' : 'text-foreground'}`}
              >
                {t(link.label)}
              </Link>
            ))}

            <Link to="/quote">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                {t('nav.quote')}
              </Button>
            </Link>

            <Link to="/admin" title="Administration">
              <Settings className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu (Inchangé) */}
        {isOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t pt-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={`font-medium py-2 ${isActive(link.path) ? 'text-primary' : 'text-foreground'}`}>
                {t(link.label)}
              </Link>
            ))}
            <div className="py-2 border-b border-slate-100">
               <p className="font-bold text-xs uppercase text-primary mb-3">Nos Divisions</p>
               <div className="grid grid-cols-1 gap-3 ml-2">
                 {categories.map((category) => (
                    <Link key={category.id} to={`/products/${category.id}`} onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                      <span>{category.icon}</span> {category.name[language]}
                    </Link>
                 ))}
               </div>
            </div>
            <Link to="/quote" onClick={() => setIsOpen(false)}>
              <Button className="w-full bg-accent text-accent-foreground font-semibold py-6">DEVIS RAPIDE</Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;

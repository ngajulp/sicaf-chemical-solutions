import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Globe, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories } from '@/data/products';
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

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'nav.home' },
    { path: '/about', label: 'nav.about' },
    { path: '/catalog', label: 'nav.catalog' },
    { path: '/contact', label: 'nav.contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-card shadow-md">
      {/* Top bar */}
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

      {/* Main navigation */}
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="SICAF Logo" className="h-12 w-auto" />
            <div className="hidden sm:block">
              <p className="text-xs text-muted-foreground leading-tight">Société des industries chimiques d'afrique</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors hover:text-primary ${
                  isActive(link.path) ? 'text-primary' : 'text-foreground'
                }`}
              >
                {t(link.label)}
              </Link>
            ))}

            {/* Products Dropdown */}
            <DropdownMenu open={isProductsOpen} onOpenChange={setIsProductsOpen}>
              <DropdownMenuTrigger className="flex items-center gap-1 font-medium transition-colors hover:text-primary">
                {t('nav.products')}
                <ChevronDown className={`h-4 w-4 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-card" align="start">
                {categories.map((category) => (
                  <DropdownMenuItem key={category.id} asChild>
                    <Link
                      to={`/products/${category.id}`}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <span>{category.icon}</span>
                      <span>{category.name[language]}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {navLinks.slice(2).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors hover:text-primary ${
                  isActive(link.path) ? 'text-primary' : 'text-foreground'
                }`}
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

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-foreground"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`font-medium py-2 ${
                    isActive(link.path) ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {t(link.label)}
                </Link>
              ))}
              
              <div className="py-2">
                <p className="font-medium mb-2">{t('nav.products')}</p>
                <div className="ml-4 flex flex-col gap-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/products/${category.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                    >
                      <span>{category.icon}</span>
                      <span>{category.name[language]}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <Link to="/quote" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                  {t('nav.quote')}
                </Button>
              </Link>

              <Link 
                to="/admin" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary py-2"
              >
                <Settings className="h-5 w-5" />
                <span>Administration</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;

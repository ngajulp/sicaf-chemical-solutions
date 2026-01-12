import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories } from '@/data/products';
import logo from '@/assets/logo.png';

const Footer = () => {
  const { language, t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="SICAF Logo" className="h-12 w-auto bg-white rounded p-1" />
              <div>
                <h3 className="font-heading font-bold text-lg">SICAF</h3>
                <p className="text-sm text-background/70">Industries Chimiques d'Afrique</p>
              </div>
            </div>
            <p className="text-background/80 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">{t('footer.quick_links')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-background/80 hover:text-accent transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-background/80 hover:text-accent transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-background/80 hover:text-accent transition-colors">
                  {t('nav.catalog')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-background/80 hover:text-accent transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link to="/quote" className="text-background/80 hover:text-accent transition-colors">
                  {t('nav.quote')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">{t('footer.our_products')}</h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/products/${category.id}`}
                    className="text-background/80 hover:text-accent transition-colors flex items-center gap-2"
                  >
                    <span>{category.icon}</span>
                    <span className="text-sm">{category.name[language]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">{t('footer.contact_us')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="text-sm text-background/80">
                  <p>BP : 13135, Akwa</p>
                  <p>Siège Social : Douala, Cameroun</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                <a href="tel:+237691837039" className="text-sm text-background/80 hover:text-accent">
                  +237 691 83 70 39
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                <a href="mailto:sicaf@chimistry.com" className="text-sm text-background/80 hover:text-accent">
                  sicaf@chimistry.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-accent flex-shrink-0" />
                <a href="https://www.sicaf-chemical.com" target="_blank" rel="noopener noreferrer" className="text-sm text-background/80 hover:text-accent">
                  www.sicaf-chemical.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-background/60">
            <p>© {currentYear} SICAF - Société des Industries Chimiques d'Afrique. {t('footer.rights')}.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo.png';
//import { categories } from '@/data/products';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import WhatsAppButton from '@/components/WhatsAppButton';
const { categories } = useGitHubProducts();
const Footer = () => {
  const { language, t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        {/* 👉 text-sm ici garantit l’uniformité globale */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">

          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={logo}
                alt="SICAF Logo"
                className="h-12 w-auto bg-white rounded p-1"
              />
              <div>
                <p className="text-background/70">
                  Société des industries chimiques d&apos;Afrique
                </p>
              </div>
            </div>

            <p className="text-background/80 leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 tracking-wide">
              {t('footer.quick_links')}
            </h4>

            {/* 👉 même densité que Products */}
            <ul className="space-y-2 text-background/80">
              <li>
                <Link to="/" className="hover:text-accent transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-accent transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-accent transition-colors">
                  {t('nav.catalog')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-accent transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link to="/quote" className="hover:text-accent transition-colors">
                  {t('nav.quote')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 tracking-wide">
              {t('footer.our_products')}
            </h4>

            {/* 👉 aligné exactement comme Quick Links */}
            <ul className="space-y-2 text-background/80">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/products/${category.id}`}
                    className="flex items-center gap-2 hover:text-accent transition-colors"
                  >
                    <span>{category.icon}</span>
                    <span>{category.name[language]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 tracking-wide">
              {t('footer.contact_us')}
            </h4>

            <ul className="space-y-3 text-background/80">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p>BP : 13135, Akwa</p>
                  <p>Siège Social : Douala, Cameroun</p>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                <a
                  href="tel:+237651254307"
                  className="hover:text-accent transition-colors"
                >
                  +237 651 25 43 07 / +237 622 21 53 91
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                <a
                  href="mailto:sicaf@chimistry.com"
                  className="hover:text-accent transition-colors"
                >
                  sicaf@chimistry.com
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-accent flex-shrink-0" />
                <a
                  href="https://www.sicaf-chemical.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  www.sicaf-chemical.com
                </a>
              </li>

              <li className="flex items-center gap-3 pt-1">
                <MessageCircle className="h-5 w-5 text-[#25D366] flex-shrink-0" />
                <WhatsAppButton
                  variant="inline"
                  className="!bg-transparent !p-0 !text-background/80 hover:!text-[#25D366] !font-normal"
                />
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-background/60">
            <p>
              © {currentYear} SICAF – Société des Industries Chimiques d&apos;Afrique.{' '}
              {t('footer.rights')}.
            </p>
            <Link
              to="/admin"
              className="hover:text-background/80 transition-colors"
            >
              Administration
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

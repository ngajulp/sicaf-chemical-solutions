import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  Award,
  Users,
  Truck,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WhatsAppButton from '@/components/WhatsAppButton';

/* =======================
   Corporate Watermark
======================= */
const Watermark: React.FC<{
  opacity?: number;
  size?: number;
  rotation?: number;
}> = ({ opacity = 0.28, size = 600, rotation = -12 }) => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage:
        'url(https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/sicaf.png)',
      backgroundRepeat: 'repeat',
      backgroundSize: `${size}px`,
      backgroundPosition: 'center',
      transform: `rotate(${rotation}deg)`,
      opacity,
      filter: 'grayscale(100%) brightness(1.15)',
    }}
  />
);

/* Overlay pour lisibilité */
const OverlayLight = () => <div className="absolute inset-0 bg-white/88" />;
const OverlayDark = () => <div className="absolute inset-0 bg-[#0F2A44]/85" />;

const Index = () => {
  const { language, t } = useLanguage();
  const { categories, loading } = useGitHubProducts();

  const features = [
    { icon: Shield, titleKey: 'home.quality', descKey: 'home.quality_desc' },
    { icon: Award, titleKey: 'home.expertise', descKey: 'home.expertise_desc' },
    { icon: Users, titleKey: 'home.service', descKey: 'home.service_desc' },
    { icon: Truck, titleKey: 'home.delivery', descKey: 'home.delivery_desc' },
  ];

  return (
    <Layout>
      <WhatsAppButton variant="floating" />

      {/* ================= HERO ================= */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <Watermark rotation={-12} size={620} opacity={0.28} />
        <OverlayDark />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalog">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#0F2A44]"
              >
                {t('hero.cta')}
              </Button>
            </Link>
            <Link to="/quote">
              <Button
                size="lg"
                className="bg-[#1F6FA8] hover:bg-[#1a5f8f] font-semibold"
              >
                {t('nav.quote')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="relative py-24 bg-gray-50 overflow-hidden">
        <Watermark rotation={-15} size={600} opacity={0.28} />
        <OverlayLight />

        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#0F2A44] mb-4">
              {t('home.products_title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.products_subtitle')}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-[#1F6FA8]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link key={category.id} to={`/products/${category.id}`}>
                  <Card className="h-full border border-gray-200 hover:shadow-lg transition">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="text-4xl bg-[#1F6FA8]/10 p-3 rounded-lg">
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold text-lg text-[#0F2A44] mb-2">
                            {category.name[language]}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {category.description[language]}
                          </p>
                          <div className="flex items-center text-[#1F6FA8] text-sm font-medium mt-3">
                            {t('common.view_products')}
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link to="/catalog">
              <Button size="lg">
                {t('catalog.title')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= WHY US ================= */}
      <section className="relative py-24 bg-white overflow-hidden">
        <Watermark rotation={-10} size={600} opacity={0.28} />
        <OverlayLight />

        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#0F2A44] mb-4">
              {t('home.why_title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.why_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <Card key={i} className="border border-gray-200">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1F6FA8]/10 flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-[#1F6FA8]" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2 text-[#0F2A44]">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(feature.descKey)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative py-24 bg-[#0F2A44] text-white overflow-hidden">
        <Watermark rotation={-12} size={600} opacity={0.28} />
        <OverlayDark />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            {language === 'fr'
              ? 'Besoin d’un devis personnalisé ?'
              : 'Need a custom quote?'}
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
            {language === 'fr'
              ? 'Nos experts vous accompagnent sur vos projets industriels et scientifiques'
              : 'Our experts support your industrial and scientific projects'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quote">
              <Button size="lg" className="bg-[#1F6FA8] hover:bg-[#1a5f8f]">
                {t('nav.quote')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#0F2A44]"
              >
                {t('nav.contact')}
              </Button>
            </Link>
          </div>

          <div className="mt-8">
            <WhatsAppButton variant="hero" />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Users, Truck, ChevronRight, Loader2, Flask, Beaker, Microscope, TestTube } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WhatsAppButton from '@/components/WhatsAppButton';

// Composant Watermark décoratif
const Watermark: React.FC<{ image: string; opacity?: number; size?: number; rotation?: number }> = ({
  image,
  opacity = 0.12,
  size = 600,
  rotation = 0,
}) => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `url(${image})`,
      backgroundRepeat: 'repeat',
      backgroundSize: `${size}px`,
      backgroundPosition: 'center',
      opacity,
      transform: `rotate(${rotation}deg)`,
      filter: 'grayscale(100%) brightness(140%) blur(0.5px)',
      zIndex: 0,
    }}
  />
);

// Overlay sombre semi-transparent
const OverlayDark: React.FC = () => (
  <div className="absolute inset-0 bg-white/70 dark:bg-gray-100/70 z-10 pointer-events-none" />
);

// Ensemble des filigranes pour la page
const WatermarkDecorative: React.FC = () => (
  <>
    <Watermark image="https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/sicaf.png" size={600} opacity={0.2} rotation={-12} />
    <Watermark image="https://images.unsplash.com/photo-1581092333473-6f41e227c1f8" size={650} opacity={0.1} rotation={10} />
    <Watermark image="https://images.unsplash.com/photo-1581091012184-25a1ee2b6f4b" size={600} opacity={0.1} rotation={-8} />
    <Watermark image="https://images.unsplash.com/photo-1602080759555-0dc54a7e6a18" size={700} opacity={0.12} rotation={5} />
    <Watermark image="https://images.unsplash.com/photo-1612288093740-1535f1f6b7c6" size={650} opacity={0.1} rotation={-10} />
  </>
);

const Index = () => {
  const { language, t } = useLanguage();
  const { categories, loading } = useGitHubProducts();

  const features = [
    { icon: Shield, titleKey: 'home.quality', descKey: 'home.quality_desc', iconDecor: Flask },
    { icon: Award, titleKey: 'home.expertise', descKey: 'home.expertise_desc', iconDecor: Microscope },
    { icon: Users, titleKey: 'home.service', descKey: 'home.service_desc', iconDecor: Beaker },
    { icon: Truck, titleKey: 'home.delivery', descKey: 'home.delivery_desc', iconDecor: TestTube },
  ];

  return (
    <Layout>
      {/* Floating WhatsApp Button */}
      <WhatsAppButton variant="floating" />

      {/* Hero Section */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        <WatermarkDecorative />
        <OverlayDark />
        <div className="relative z-20 container mx-auto px-4 text-center">
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-[#0F2A44]">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-[#1F6FA8]/90 mb-8">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link to="/catalog">
              <Button size="lg" variant="outline" className="border-2 border-[#0F2A44] text-[#0F2A44] hover:bg-[#0F2A44] hover:text-white w-full sm:w-auto font-semibold">
                {t('hero.cta')}
              </Button>
            </Link>
            <Link to="/quote">
              <Button size="lg" className="bg-[#1F6FA8] text-white hover:bg-[#0F2A44] font-semibold w-full sm:w-auto">
                {t('nav.quote')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="relative py-24">
        <WatermarkDecorative />
        <OverlayDark />
        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-[#0F2A44] mb-4">
              {t('home.products_title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('home.products_subtitle')}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#0F2A44]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link key={category.id} to={`/products/${category.id}`}>
                  <Card className="group h-full hover:shadow-xl border border-gray-200 transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl p-3 bg-[#0F2A44]/10 rounded-lg group-hover:bg-[#1F6FA8]/20 transition-colors flex items-center justify-center">
                          {category.icon || <Flask className="h-6 w-6 text-[#0F2A44]" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-heading font-semibold text-lg text-[#0F2A44] mb-2 group-hover:text-[#1F6FA8] transition-colors flex items-center gap-2">
                            {category.name[language]}
                            <Beaker className="h-4 w-4 text-[#1F6FA8]" />
                          </h3>
                          <p className="text-sm text-gray-600">
                            {category.description[language]}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/catalog">
              <Button size="lg" className="bg-[#1F6FA8] text-white font-semibold hover:bg-[#0F2A44]">
                {t('catalog.title')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative py-24 bg-white">
        <WatermarkDecorative />
        <OverlayDark />
        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-[#0F2A44] mb-4">
              {t('home.why_title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('home.why_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border border-gray-200 shadow-sm hover:shadow-lg transition-all">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0F2A44]/10 text-[#0F2A44] mb-4">
                    <feature.iconDecor className="h-8 w-8" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-[#0F2A44] mb-2">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t(feature.descKey)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-[#0F2A44] text-white">
        <WatermarkDecorative />
        <OverlayDark />
        <div className="container mx-auto px-4 text-center relative z-20">
          <h2 className="font-heading text-4xl font-bold mb-4">
            {language === 'fr' ? "Besoin d'un devis personnalisé ?" : 'Need a custom quote?'}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {language === 'fr'
              ? "Notre équipe d'experts est prête à vous accompagner dans vos projets"
              : 'Our team of experts is ready to assist you with your projects'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link to="/quote">
              <Button size="lg" className="bg-[#1F6FA8] text-white hover:bg-[#0F2A44] font-semibold w-full sm:w-auto">
                {t('nav.quote')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#0F2A44] w-full sm:w-auto font-semibold">
                {t('nav.contact')}
              </Button>
            </Link>
          </div>

          {/* WhatsApp CTA */}
          <div className="pt-4">
            <WhatsAppButton variant="hero" />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

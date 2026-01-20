import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Users, Truck, ChevronRight, Loader2, Flask, Beaker, TestTube2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WhatsAppButton from '@/components/WhatsAppButton';

// Watermark overlay component
const WatermarkOverlay: React.FC<{ opacity?: number; size?: number; rotation?: number; imageUrl?: string }> = ({
  opacity = 0.12,
  size = 600,
  rotation = -12,
  imageUrl = 'https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/sicaf.png',
}) => (
  <div
    className="absolute inset-0 pointer-events-none z-0"
    style={{
      backgroundImage: `url(${imageUrl})`,
      backgroundRepeat: 'repeat',
      backgroundSize: `${size}px`,
      backgroundPosition: 'center',
      opacity,
      transform: `rotate(${rotation}deg)`,
      filter: 'grayscale(100%) brightness(120%) blur(0.5px)',
      zIndex: 0,
    }}
  />
);

const Index = () => {
  const { language, t } = useLanguage();
  const { categories, loading } = useGitHubProducts();

  const features = [
    { icon: Shield, titleKey: 'home.quality', descKey: 'home.quality_desc', chemistryIcon: Flask },
    { icon: Award, titleKey: 'home.expertise', descKey: 'home.expertise_desc', chemistryIcon: Beaker },
    { icon: Users, titleKey: 'home.service', descKey: 'home.service_desc', chemistryIcon: Users },
    { icon: Truck, titleKey: 'home.delivery', descKey: 'home.delivery_desc', chemistryIcon: TestTube2 },
  ];

  return (
    <Layout>
      {/* Floating WhatsApp Button */}
      <WhatsAppButton variant="floating" />

      {/* Hero Section */}
      <section className="relative text-primary-foreground py-32 md:py-40 bg-light-gray overflow-hidden">
        <WatermarkOverlay opacity={0.12} size={650} rotation={-10} />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-10">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalog">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white w-full sm:w-auto font-semibold"
              >
                {t('hero.cta')}
              </Button>
            </Link>
            <Link to="/quote">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto font-semibold"
              >
                {t('nav.quote')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="relative py-28 bg-white overflow-hidden">
        <WatermarkOverlay opacity={0.1} size={600} rotation={-15} imageUrl="https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/sicaf.png" />
        <WatermarkOverlay opacity={0.08} size={550} rotation={10} imageUrl="https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/lab.png" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-foreground mb-4">
              {t('home.products_title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.products_subtitle')}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link key={category.id} to={`/products/${category.id}`}>
                  <Card className="group h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200">
                    <CardContent className="p-6 flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl p-3 bg-primary/10 rounded-lg transition-colors">
                          {category.icon}
                        </div>
                        <h3 className="font-heading font-semibold text-lg text-foreground">
                          {category.name[language]}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground flex-1">
                        {category.description[language]}
                      </p>
                      <div className="flex items-center gap-2 text-primary font-medium mt-3">
                        <ChevronRight className="h-4 w-4" />
                        {t('common.view_products')}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/catalog">
              <Button size="lg" className="font-semibold">
                {t('catalog.title')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative py-28 bg-light-gray overflow-hidden">
        <WatermarkOverlay opacity={0.1} size={600} rotation={-12} imageUrl="https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/lab.png" />
        <WatermarkOverlay opacity={0.1} size={650} rotation={10} imageUrl="https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/instruments.png" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-foreground mb-4">
              {t('home.why_title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.why_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <CardContent className="pt-8 pb-6 px-6 flex flex-col items-center gap-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-2">
                    <feature.chemistryIcon className="h-8 w-8" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-foreground">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    {t(feature.descKey)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-28 bg-white overflow-hidden">
        <WatermarkOverlay opacity={0.12} size={600} rotation={5} imageUrl="https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/industry.png" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="font-heading text-4xl font-bold mb-4">
            {language === 'fr'
              ? 'Besoin d\'un devis personnalisé ?'
              : 'Need a custom quote?'}
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            {language === 'fr'
              ? 'Notre équipe d\'experts est prête à vous accompagner dans vos projets'
              : 'Our team of experts is ready to assist you with your projects'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quote">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold w-full sm:w-auto"
              >
                {t('nav.quote')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white w-full sm:w-auto font-semibold"
              >
                {t('nav.contact')}
              </Button>
            </Link>
          </div>

          <div className="pt-4">
            <WhatsAppButton variant="hero" />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Users, Truck, ChevronRight, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WhatsAppButton from '@/components/WhatsAppButton';

// Watermark Overlay Component
const watermarkImages = [
  'https://images.unsplash.com/photo-1581092795361-7f6f50c26996?auto=format&fit=crop&w=700&q=80', // Laboratoire chimique
  'https://images.unsplash.com/photo-1612832021405-0b7f8f1f1d7c?auto=format&fit=crop&w=700&q=80', // Produits chimiques
  'https://images.unsplash.com/photo-1611605691290-76de8d57e20e?auto=format&fit=crop&w=700&q=80', // Industrie chimique
  'https://images.unsplash.com/photo-1581091012184-8f2d0f54e8f3?auto=format&fit=crop&w=700&q=80'  // Autre usine chimique
];

const WatermarkOverlay: React.FC<{ opacity?: number; size?: number; rotation?: number }> = ({
  opacity = 0.12,
  size = 600,
  rotation = -10
}) => (
  <div className="absolute inset-0 pointer-events-none z-0">
    {watermarkImages.map((img, index) => (
      <div
        key={index}
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${img})`,
          backgroundRepeat: 'repeat',
          backgroundSize: `${size}px`,
          opacity,
          transform: `rotate(${rotation + index * 5}deg)`,
          filter: 'grayscale(100%) brightness(140%)',
          zIndex: 0,
        }}
      />
    ))}
    <div
      className="absolute inset-0"
      style={{
        backgroundColor: 'rgba(255,255,255,0.85)',
        zIndex: 0
      }}
    />
  </div>
);

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
      {/* Floating WhatsApp Button */}
      <WhatsAppButton variant="floating" />

      {/* Hero Section */}
      <section className="relative text-primary-foreground py-24 md:py-32">
        <WatermarkOverlay opacity={0.12} size={600} rotation={-10} />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            {t('hero.title')}
          </h1>
          <p className="text-2xl md:text-3xl text-primary-foreground/90 mb-8">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link to="/catalog">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#0F2A44] text-[#0F2A44] hover:bg-[#0F2A44] hover:text-white w-full sm:w-auto"
              >
                {t('hero.cta')}
              </Button>
            </Link>
            <Link to="/quote">
              <Button
                size="lg"
                className="bg-[#1F6FA8] text-white hover:bg-[#145E85] font-semibold w-full sm:w-auto flex items-center justify-center"
              >
                {t('nav.quote')} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="relative py-24 bg-gray-50">
        <WatermarkOverlay opacity={0.1} size={550} rotation={-12} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-[#0F2A44] mb-4">{t('home.products_title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('home.products_subtitle')}</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#0F2A44]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link key={category.id} to={`/products/${category.id}`}>
                  <Card className="group h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl p-3 bg-[#0F2A44]/10 rounded-lg group-hover:bg-[#0F2A44]/20 transition-colors">
                          {category.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-heading font-semibold text-lg text-[#0F2A44] mb-2 group-hover:text-[#1F6FA8] transition-colors">
                            {category.name[language]}
                          </h3>
                          <p className="text-sm text-gray-600">{category.description[language]}</p>
                          <div className="flex items-center text-[#1F6FA8] font-medium text-sm mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            {t('common.view_products')}
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/catalog">
              <Button size="lg" className="font-semibold bg-[#0F2A44] text-white hover:bg-[#145E85]">
                {t('catalog.title')} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative py-24 bg-white">
        <WatermarkOverlay opacity={0.1} size={600} rotation={-15} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-[#0F2A44] mb-4">{t('home.why_title')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('home.why_subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-none shadow-md">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0F2A44]/10 text-[#0F2A44] mb-4">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-[#0F2A44] mb-2">{t(feature.titleKey)}</h3>
                  <p className="text-sm text-gray-600">{t(feature.descKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-[#0F2A44] text-white">
        <WatermarkOverlay opacity={0.12} size={600} rotation={-10} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-heading text-4xl font-bold mb-4">
            {language === 'fr' ? 'Besoin d\'un devis personnalisé ?' : 'Need a custom quote?'}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {language === 'fr'
              ? 'Notre équipe d\'experts est prête à vous accompagner dans vos projets'
              : 'Our team of experts is ready to assist you with your projects'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link to="/quote">
              <Button size="lg" className="bg-[#1F6FA8] text-white hover:bg-[#145E85] font-semibold w-full sm:w-auto">
                {t('nav.quote')} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#0F2A44] w-full sm:w-auto">
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

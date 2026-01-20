import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  Award,
  Users,
  Truck,
  ChevronRight,
  Loader2,
  FlaskConical,
  Microscope,
  Factory,
} from 'lucide-react';

import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WhatsAppButton from '@/components/WhatsAppButton';

/* ======================================================
   CORPORATE CHEMICAL BACKGROUND
====================================================== */

const CorporateChemistryBackground = ({
  opacity = 0.08,
  rotation = -8,
}: {
  opacity?: number;
  rotation?: number;
}) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {/* SICAF Logo watermark */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          'url(https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/sicaf.png)',
        backgroundRepeat: 'repeat',
        backgroundSize: '520px',
        opacity: 0.05,
        transform: `rotate(${rotation}deg)`,
        filter: 'grayscale(100%)',
      }}
    />

    {/* Laboratory */}
    <div
      className="absolute top-20 right-0 w-[900px] h-[600px]"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1581093588401-22d07cddf79b)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity,
        filter: 'grayscale(100%)',
      }}
    />

    {/* Chemical industry */}
    <div
      className="absolute bottom-0 left-0 w-[900px] h-[600px]"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1614308457659-2e2e5b7e7c68)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: opacity - 0.02,
        filter: 'grayscale(100%)',
      }}
    />

    {/* Readability overlay */}
    <div className="absolute inset-0 bg-white/75" />
  </div>
);

/* ======================================================
   HOME PAGE
====================================================== */

const Index = () => {
  const { language, t } = useLanguage();
  const { categories, loading } = useGitHubProducts();

  const features = [
    { icon: FlaskConical, titleKey: 'home.quality', descKey: 'home.quality_desc' },
    { icon: Microscope, titleKey: 'home.expertise', descKey: 'home.expertise_desc' },
    { icon: Factory, titleKey: 'home.service', descKey: 'home.service_desc' },
    { icon: Shield, titleKey: 'home.delivery', descKey: 'home.delivery_desc' },
  ];

  return (
    <Layout>
      <WhatsAppButton variant="floating" />

      {/* ================= HERO ================= */}
      <section className="relative py-24 md:py-32 bg-background">
        <CorporateChemistryBackground />

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-muted-foreground mb-10">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/catalog">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground font-semibold px-8"
                >
                  {t('hero.cta')}
                </Button>
              </Link>

              <Link to="/quote">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary px-8"
                >
                  {t('nav.quote')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="relative py-24 bg-muted">
        <CorporateChemistryBackground opacity={0.06} />

        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              {t('home.products_title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.products_subtitle')}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link key={category.id} to={`/products/${category.id}`}>
                  <Card className="h-full border border-border bg-white/80 backdrop-blur hover:shadow-md transition">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary/10 text-primary">
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold text-lg mb-2">
                            {category.name[language]}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {category.description[language]}
                          </p>
                          <div className="flex items-center text-primary text-sm font-medium mt-3">
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
        </div>
      </section>

      {/* ================= WHY US ================= */}
      <section className="relative py-24 bg-background">
        <CorporateChemistryBackground opacity={0.06} />

        <div className="relative z-10 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border border-border bg-white/85">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2">
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
      <section className="relative py-24 bg-muted">
        <CorporateChemistryBackground opacity={0.05} />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            {language === 'fr'
              ? 'Besoin d’un devis personnalisé ?'
              : 'Need a custom quote?'}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {language === 'fr'
              ? 'Nos experts vous accompagnent dans vos projets industriels et scientifiques.'
              : 'Our experts support your industrial and scientific projects.'}
          </p>

          <Link to="/contact">
            <Button size="lg" className="bg-primary text-primary-foreground px-10">
              {t('nav.contact')}
              <Truck className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

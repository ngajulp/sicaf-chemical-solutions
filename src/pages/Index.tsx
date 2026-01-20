import { Link } from 'react-router-dom';
import {
  ArrowRight,
  FlaskConical,
  Microscope,
  Factory,
  ShieldCheck,
  Truck,
  ChevronRight,
  Loader2,
} from 'lucide-react';

import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';

/* ======================================================
   BACKGROUND DECORATION – LIGHT CHEMICAL CORPORATE
====================================================== */

const BackgroundChemistry = ({ opacity = 0.1 }: { opacity?: number }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* Laboratory image */}
    <div
      className="absolute right-0 top-1/4 w-[900px] h-[600px]"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1581093588401-22d07cddf79b)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity,
        filter: 'grayscale(100%)',
      }}
    />

    {/* Industrial chemistry */}
    <div
      className="absolute left-0 bottom-0 w-[900px] h-[600px]"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1614308457659-2e2e5b7e7c68)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: opacity - 0.02,
        filter: 'grayscale(100%)',
      }}
    />

    {/* SICAF logo watermark repeated */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          'url(https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/sicaf.png)',
        backgroundRepeat: 'repeat',
        backgroundSize: '600px',
        opacity: 0.06,
      }}
    />
  </div>
);

/* ======================================================
   HOME PAGE
====================================================== */

export default function Index() {
  const { language, t } = useLanguage();
  const { categories, loading } = useGitHubProducts();

  return (
    <Layout>
      <WhatsAppButton variant="floating" />

      {/* ================= HERO ================= */}
      <section className="relative py-28 bg-white">
        <BackgroundChemistry />

        <div className="relative z-10 container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-semibold text-[#0F2A44] mb-6">
            {t('home.hero.title')}
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-10">
            {t('home.hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/catalog">
              <Button size="lg" className="bg-[#0F2A44] text-white">
                {t('home.hero.cta_catalog')}
              </Button>
            </Link>

            <Link to="/quote">
              <Button
                size="lg"
                variant="outline"
                className="border-[#0F2A44] text-[#0F2A44]"
              >
                {t('home.hero.cta_quote')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="relative py-24 bg-gray-50">
        <BackgroundChemistry opacity={0.08} />

        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-[#0F2A44] mb-4">
              {t('home.categories.title')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('home.categories.subtitle')}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#1F6FA8]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link key={category.id} to={`/products/${category.id}`}>
                  <Card className="h-full border border-gray-200 shadow-sm hover:shadow-md transition">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-[#0F2A44] mb-2">
                        {category.name[language]}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {category.description[language]}
                      </p>
                      <span className="text-sm text-[#1F6FA8] flex items-center">
                        {t('common.explore')}
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= WHY SICAF ================= */}
      <section className="relative py-24 bg-white">
        <BackgroundChemistry opacity={0.07} />

        <div className="relative z-10 container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
          {[
            { icon: FlaskConical, key: 'chemicals' },
            { icon: Microscope, key: 'laboratory' },
            { icon: Factory, key: 'industry' },
            { icon: ShieldCheck, key: 'quality' },
          ].map((item, i) => (
            <Card key={i} className="border border-gray-200 shadow-sm">
              <CardContent className="p-8 text-center">
                <item.icon className="h-10 w-10 mx-auto text-[#1F6FA8] mb-4" />
                <h3 className="font-semibold text-[#0F2A44] mb-2">
                  {t(`home.why.${item.key}.title`)}
                </h3>
                <p className="text-sm text-gray-600">
                  {t(`home.why.${item.key}.desc`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative py-24 bg-gray-50">
        <BackgroundChemistry opacity={0.08} />

        <div className="relative z-10 container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-semibold text-[#0F2A44] mb-4">
            {t('home.cta.title')}
          </h2>
          <p className="text-gray-600 mb-8">
            {t('home.cta.subtitle')}
          </p>

          <Link to="/contact">
            <Button size="lg" className="bg-[#1F6FA8] text-white">
              {t('home.cta.button')}
              <Truck className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}

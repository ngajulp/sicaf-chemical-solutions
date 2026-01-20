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

// Filigranes chimiques / labo
const chemicalImages = [
  'https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/sicaf.png',
  'https://images.unsplash.com/photo-1581093588401-22d07cddf79b?auto=format&fit=crop&w=1600&q=80', // labo
  'https://images.unsplash.com/photo-1581091215369-1a7c8763d219?auto=format&fit=crop&w=1600&q=80', // matériel chimique
];

const WatermarkOverlay: React.FC<{
  images: string[];
  opacity?: number;
  size?: number;
  rotation?: number;
}> = ({ images, opacity = 0.08, size = 350, rotation = 0 }) => (
  <div className="absolute inset-0 pointer-events-none z-0">
    {images.map((img, idx) => (
      <div
        key={idx}
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${img})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${size}px`,
          backgroundPosition: ['20% 20%', '70% 25%', '50% 60%'][idx] || 'center',
          opacity,
          transform: `rotate(${rotation + idx * 15}deg)`,
          filter: 'grayscale(100%) contrast(115%) blur(0.5px)',
        }}
      />
    ))}
  </div>
);

export default function Index() {
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
      <section className="relative py-28 md:py-36 text-white overflow-hidden">
        {/* Background bleu clair + overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-blue-800" />
        <div className="absolute inset-0 bg-blue-900/25" />
        <WatermarkOverlay images={chemicalImages} opacity={0.12} size={300} rotation={-10} />

        <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8">{t('hero.subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link to="/catalog">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-slate-900 w-full sm:w-auto"
              >
                {t('hero.cta')}
              </Button>
            </Link>
            <Link to="/quote">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold w-full sm:w-auto"
              >
                {t('nav.quote')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= NOS PRODUITS ================= */}
      <section className="relative py-20 bg-slate-50 overflow-hidden">
        <WatermarkOverlay images={chemicalImages.slice(1)} opacity={0.07} size={300} rotation={5} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4">{t('home.products_title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.products_subtitle')}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link key={category.id} to={`/products/${category.id}`}>
                  <Card className="group h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          {category.icon || <FlaskConical />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-heading font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                            {category.name[language]}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {category.description[language]}
                          </p>
                          <div className="flex items-center text-primary font-medium text-sm mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
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
              <Button size="lg" className="font-semibold">
                {t('catalog.title')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= POURQUOI CHOISIR SICAF ================= */}
      <section className="relative py-20 bg-white overflow-hidden">
        <WatermarkOverlay images={chemicalImages.slice(1)} opacity={0.06} size={300} rotation={-10} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.why_title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('home.why_subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-none shadow-md">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground">{t(feature.descKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA DEVIS ================= */}
      <section className="relative py-24 bg-gradient-to-r from-blue-700 to-blue-900 text-white overflow-hidden">
        <WatermarkOverlay images={chemicalImages} opacity={0.1} rotation={5} size={350} />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {language === 'fr' ? "Besoin d'un devis personnalisé ?" : 'Need a custom quote?'}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {language === 'fr'
              ? "Notre équipe d'experts est prête à vous accompagner dans vos projets"
              : 'Our team of experts is ready to assist you with your projects'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link to="/quote">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold w-full sm:w-auto">
                {t('nav.quote')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-slate-900 w-full sm:w-auto">
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
}

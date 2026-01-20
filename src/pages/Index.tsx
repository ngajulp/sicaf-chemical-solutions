import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  FlaskConical,
  Factory,
  Microscope,
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

/* =========================================================
   WATERMARK SYSTEM – CORPORATE CHEMICAL
========================================================= */

const watermarkImages = [
  // SICAF LOGO – repeated many times
  'https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/sicaf.png',

  // Professional chemical / laboratory images (max 2 repetitions)
  'https://images.unsplash.com/photo-1581093588401-22d07cddf79b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1581091215369-1a7c8763d219?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1614308457659-2e2e5b7e7c68?auto=format&fit=crop&w=800&q=80',
];

const WatermarkOverlay = ({
  opacity = 0.11,
  size = 650,
  rotation = -12,
}: {
  opacity?: number;
  size?: number;
  rotation?: number;
}) => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
    {watermarkImages.map((img, index) => (
      <div
        key={index}
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${img})`,
          backgroundRepeat: index === 0 ? 'repeat' : 'no-repeat',
          backgroundSize: index === 0 ? `${size}px` : '900px',
          backgroundPosition: index === 0 ? 'center' : '20% 30%',
          opacity,
          transform: `rotate(${rotation}deg)`,
          filter: 'grayscale(100%) brightness(115%)',
        }}
      />
    ))}

    {/* Overlay for text readability */}
    <div className="absolute inset-0 bg-white/70" />
  </div>
);

/* =========================================================
   HOME PAGE
========================================================= */

export default function Index() {
  const { language, t } = useLanguage();
  const { categories, loading } = useGitHubProducts();

  const features = [
    {
      icon: FlaskConical,
      title: 'High-Purity Chemical Products',
      desc: 'Certified chemicals for industrial, laboratory and research use.',
    },
    {
      icon: Microscope,
      title: 'Laboratory Instruments',
      desc: 'Professional analytical and laboratory equipment.',
    },
    {
      icon: Factory,
      title: 'Industrial & Research Solutions',
      desc: 'Tailored chemical solutions for industry and R&D.',
    },
    {
      icon: ShieldCheck,
      title: 'Quality & Compliance',
      desc: 'International standards, safety and regulatory compliance.',
    },
  ];

  return (
    <Layout>
      <WhatsAppButton variant="floating" />

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative py-28 bg-[#0F2A44] text-white">
        <WatermarkOverlay />

        <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-semibold mb-6 leading-tight">
            Trusted Chemical Solutions for Industry & Research
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-10">
            Chemical products, laboratory instruments and consulting services
            for industries, laboratories and research centers worldwide.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/catalog">
              <Button
                size="lg"
                className="bg-white text-[#0F2A44] hover:bg-white/90 font-semibold"
              >
                View Catalog
              </Button>
            </Link>

            <Link to="/quote">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#0F2A44]"
              >
                Request a Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          PRODUCTS CATEGORIES
      ====================================================== */}
      <section className="relative py-24 bg-gray-50">
        <WatermarkOverlay opacity={0.1} />

        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-[#0F2A44] mb-4">
              Product Categories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A complete range of chemical products and laboratory solutions.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin h-8 w-8 text-[#1F6FA8]" />
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
                      <span className="text-sm font-medium text-[#1F6FA8] flex items-center">
                        Explore
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          WHY SICAF
      ====================================================== */}
      <section className="relative py-24 bg-white">
        <WatermarkOverlay opacity={0.1} />

        <div className="relative z-10 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {features.map((item, idx) => (
              <Card key={idx} className="border border-gray-200 shadow-sm">
                <CardContent className="p-8 text-center">
                  <item.icon className="h-10 w-10 mx-auto text-[#1F6FA8] mb-4" />
                  <h3 className="font-semibold text-[#0F2A44] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="relative py-24 bg-gray-50">
        <WatermarkOverlay opacity={0.1} />

        <div className="relative z-10 container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-semibold text-[#0F2A44] mb-4">
            Partner with a Reliable Chemical Supplier
          </h2>

          <p className="text-gray-600 mb-8">
            Our experts support industrial and research projects with precision,
            quality and compliance.
          </p>

          <Link to="/contact">
            <Button
              size="lg"
              className="bg-[#1F6FA8] hover:bg-[#1F6FA8]/90 text-white font-semibold"
            >
              Contact Our Experts
              <Truck className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}


export default Index;

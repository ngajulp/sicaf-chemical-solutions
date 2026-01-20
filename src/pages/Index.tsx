import { Link } from 'react-router-dom';
import {
  FlaskConical,
  Atom,
  Factory,
  Microscope,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

import Layout from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import WhatsAppButton from '../components/WhatsAppButton';
import { useLanguage } from '../contexts/LanguageContext';
import { useGitHubProducts } from '../hooks/useGitHubProducts';

/* ============================
   BACKGROUND VISUAL SYSTEM
============================ */

const BackgroundVisual = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Gradient base */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F33] via-[#0E4C75] to-[#0B1F33]" />

    {/* SICAF logo watermark (repeated) */}
    <div
      className="absolute inset-0 opacity-[0.08]"
      style={{
        backgroundImage:
          'url(https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/sicaf.png)',
        backgroundRepeat: 'repeat',
        backgroundSize: '520px',
      }}
    />

    {/* Chemical lab imagery */}
    <div
      className="absolute right-0 top-0 w-[55%] h-full opacity-20"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1581093458791-9f3c3900df38?auto=format&fit=crop&w=1600&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        maskImage:
          'linear-gradient(to left, black 40%, transparent 100%)',
      }}
    />

    {/* Dark overlay */}
    <div className="absolute inset-0 bg-black/40" />
  </div>
);

/* ============================
   PAGE
============================ */

export default function Index() {
  const { language } = useLanguage();
  const { categories } = useGitHubProducts();

  const strengths = [
    {
      icon: Atom,
      title: 'Advanced Chemical Expertise',
      text: 'High-performance chemical products engineered for industry and research.',
    },
    {
      icon: FlaskConical,
      title: 'Laboratory & Analysis',
      text: 'Precision instruments and certified laboratory solutions.',
    },
    {
      icon: Factory,
      title: 'Industrial Supply',
      text: 'Reliable chemical sourcing for industrial-scale operations.',
    },
    {
      icon: ShieldCheck,
      title: 'Compliance & Safety',
      text: 'Strict adherence to international quality and safety standards.',
    },
  ];

  return (
    <Layout>
      <WhatsAppButton variant="floating" />

      {/* ================= HERO ================= */}
      <section className="relative min-h-[90vh] flex items-center text-white">
        <BackgroundVisual />

        <div className="relative z-10 container mx-auto px-4 max-w-5xl">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm mb-6">
            <Atom className="h-4 w-4 text-[#1FA2FF]" />
            Global Chemical Solutions
          </span>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Powering Industry & Research
            <br />
            <span className="text-[#1FA2FF]">
              with Advanced Chemical Solutions
            </span>
          </h1>

          <p className="text-lg text-white/80 max-w-2xl mb-10">
            SICAF delivers high-quality chemical products, laboratory equipment,
            and industrial solutions trusted by professionals worldwide.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/catalog">
              <Button
                size="lg"
                className="bg-[#1FA2FF] hover:bg-[#1FA2FF]/90 text-[#0B1F33] font-semibold"
              >
                Explore Products
              </Button>
            </Link>

            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#0B1F33]"
              >
                Contact Experts
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= STRENGTHS ================= */}
      <section className="py-24 bg-[#0B1F33]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {strengths.map((s, i) => (
              <Card
                key={i}
                className="bg-white/5 border border-white/10 backdrop-blur text-white hover:bg-white/10 transition"
              >
                <CardContent className="p-8 text-center">
                  <s.icon className="h-12 w-12 mx-auto mb-4 text-[#1FA2FF]" />
                  <h3 className="font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-white/70">{s.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="py-24 bg-gradient-to-b from-[#0E4C75] to-[#0B1F33] text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Our Product Categories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/products/${cat.id}`}>
                <Card className="bg-white/10 border border-white/10 hover:bg-white/20 transition">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">
                      {cat.name[language]}
                    </h3>
                    <p className="text-sm text-white/70 mb-4">
                      {cat.description[language]}
                    </p>
                    <span className="text-[#1FA2FF] flex items-center text-sm font-medium">
                      View products
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

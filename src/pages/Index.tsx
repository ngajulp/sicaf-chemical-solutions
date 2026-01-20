import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Users, Truck, ChevronRight, Loader2, FlaskConical, Beaker, Microscope, TestTube2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WhatsAppButton from '@/components/WhatsAppButton';

// Composant Watermark polyvalent
const WatermarkOverlay: React.FC<{
  image: string;
  opacity?: number;
  size?: string | number; // Changé pour accepter des pourcentages
  rotation?: number;
  animate?: boolean;
  variant?: 'light' | 'dark'; 
  blur?: number;
  zIndex?: number;
  repeat?: 'repeat' | 'no-repeat';
  position?: string;
}> = ({ image, opacity = 0.08, size = 'cover', rotation = 0, animate = true, variant = 'dark', blur = 0, zIndex = 0, repeat = 'no-repeat', position = 'center' }) => (
  <div
    className={`absolute inset-0 pointer-events-none ${animate ? 'animate-watermark' : ''}`}
    style={{
      backgroundImage: `url(${image})`,
      backgroundRepeat: repeat,
      backgroundSize: size,
      backgroundPosition: position,
      opacity,
      zIndex,
      filter: `${variant === 'light' ? 'brightness(0) invert(1)' : 'grayscale(100%)'} blur(${blur}px)`,
      mixBlendMode: variant === 'dark' ? 'multiply' : 'screen', 
      '--rotation': `${rotation}deg`,
    } as React.CSSProperties}
  />
);

export default function Index() {
  const { language, t } = useLanguage();
  const { categories, loading } = useGitHubProducts();

  const LOGO_URL = "https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/sicaf.png";
  
  // NOUVELLES URLs : Images plus larges, plus nettes et plus industrielles
  const IMG_HERO_LAB = "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=2000&q=80"; // Grand laboratoire moderne
  const IMG_PRODUCTS_CHEM = "https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?auto=format&fit=crop&w=2000&q=80"; // Verrerie industrielle et fluides
  const IMG_WHY_MOLECULE = "https://images.unsplash.com/photo-1581093588401-22d07cddf79b?auto=format&fit=crop&w=2000&q=80"; // Structure/Recherche

  const features = [
    { icon: Shield, titleKey: 'home.quality', descKey: 'home.quality_desc' },
    { icon: Award, titleKey: 'home.expertise', descKey: 'home.expertise_desc' },
    { icon: Users, titleKey: 'home.service', descKey: 'home.service_desc' },
    { icon: Truck, titleKey: 'home.delivery', descKey: 'home.delivery_desc' },
  ];

  return (
    <Layout>
      <WhatsAppButton variant="floating" />

      {/* ======================= HERO ======================= */}
      <section className="relative py-32 md:py-48 text-white overflow-hidden bg-slate-900">
        {/* COUCHE 1 : Image de fond principale (Laboratoire Panoramique) */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${IMG_HERO_LAB})`, filter: 'grayscale(100%) contrast(120%)', opacity: 0.4 }} />
        <div className="absolute inset-0 bg-slate-900/80" /> {/* Overlay sombre pour le texte */}
        
        {/* COUCHE 2 : Motif Logo Corporate */}
        <WatermarkOverlay image={LOGO_URL} variant="light" opacity={0.1} rotation={-15} size={120} repeat='repeat' zIndex={2} />

        <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-md">
            <Microscope className="h-5 w-5 text-accent" />
            <span className="text-sm font-bold uppercase tracking-widest">{language === 'fr' ? 'Leader en Solutions Chimiques' : 'Leading Chemical Solutions'}</span>
          </div>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-tight uppercase tracking-tighter drop-shadow-lg">
            {t('hero.title')}
          </h1>
          <p className="text-2xl text-slate-100 mb-12 font-light max-w-3xl mx-auto drop-shadow-md">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/catalog" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-slate-900 w-full px-12 h-16 text-xl font-bold tracking-wide">
                {t('hero.cta')}
              </Button>
            </Link>
            <Link to="/quote" className="w-full sm:w-auto">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-black w-full px-12 h-16 text-xl tracking-wide shadow-xl">
                {t('nav.quote')}
                <ArrowRight className="ml-3 h-7 w-7" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ======================= PRODUCT CATEGORIES ======================= */}
      <section className="relative py-32 overflow-hidden bg-slate-50">
        {/* FILIGRANE MASSIF : Verrerie et Produits Chimiques */}
        <WatermarkOverlay 
          image={IMG_PRODUCTS_CHEM} 
          variant="dark" 
          opacity={0.08} // Opacité augmentée pour visibilité
          size="120%" // Dépasse du cadre pour l'immersion
          position="center top"
          repeat="no-repeat"
          blur={0} // Pas de flou, détails nets
          zIndex={1}
        />
        
        {/* Motif Logo discret par-dessus */}
        <WatermarkOverlay image={LOGO_URL} variant="dark" opacity={0.04} size={180} rotation={10} repeat='repeat' zIndex={2} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-6 text-slate-900 uppercase tracking-tight">{t('home.products_title')}</h2>
            <div className="h-2 bg-primary w-32 mx-auto rounded-full mb-8"></div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto italic font-medium">
              {t('home.products_subtitle')}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {categories.map((category) => (
                <Link key={category.id} to={`/products/${category.id}`}>
                  <Card className="group h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/90 backdrop-blur-md border-none ring-1 ring-slate-200/50 hover:ring-primary/50">
                    <CardContent className="p-10">
                      <div className="flex flex-col gap-6">
                        <div className="w-20 h-20 flex items-center justify-center bg-slate-900 text-white rounded-2xl group-hover:bg-primary transition-all duration-500 shadow-lg">
                          {category.icon || <Beaker className="h-10 w-10" />}
                        </div>
                        <div>
                          <h3 className="font-heading font-black text-2xl text-slate-900 mb-4 tracking-wide uppercase">
                            {category.name[language]}
                          </h3>
                          <p className="text-slate-600 leading-relaxed text-base font-medium">
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
        </div>
      </section>

      {/* ======================= WHY CHOOSE US ======================= */}
      <section className="relative py-32 overflow-hidden bg-white">
        {/* FILIGRANE MASSIF : Recherche et Structure */}
        <WatermarkOverlay 
          image={IMG_WHY_MOLECULE} 
          variant="dark" 
          opacity={0.06} 
          size="cover" 
          position="center"
          repeat="no-repeat"
          blur={1} 
          zIndex={1}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 uppercase tracking-tight">{t('home.why_title')}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium">{t('home.why_subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-10 rounded-3xl bg-slate-50 border-2 border-slate-100 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-500 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border-2 border-primary/20 text-primary group-hover:bg-white group-hover:text-slate-900 mb-8 shadow-md">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="font-heading font-bold text-xl mb-4 uppercase tracking-wide">{t(feature.titleKey)}</h3>
                <p className="text-base opacity-90 leading-relaxed">{t(feature.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= CTA ======================= */}
      <section className="relative py-32 bg-slate-900 text-white overflow-hidden">
        {/* Image de fond Laboratoire Industriel */}
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${IMG_PRODUCTS_CHEM})`, filter: 'grayscale(100%) brightness(0.4)' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-primary/40" />
        
        {/* Motif Logo Corporate par-dessus */}
        <WatermarkOverlay image={LOGO_URL} variant="light" opacity={0.08} size={100} rotation={25} repeat='repeat' zIndex={2} />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="mb-10 flex justify-center gap-6 opacity-60">
             <TestTube2 className="h-16 w-16 text-accent" />
             <Beaker className="h-16 w-16 text-primary" />
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter uppercase italic drop-shadow-2xl">
            {language === 'fr' ? "Prêt à innover ?" : 'Ready to innovate?'}
          </h2>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Link to="/quote">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-black px-16 h-20 text-2xl shadow-2xl uppercase tracking-widest transform hover:scale-105 transition-transform">
                {t('nav.quote')}
              </Button>
            </Link>
            <WhatsAppButton variant="hero" />
          </div>
        </div>
      </section>

      <style>
        {`
          @keyframes watermarkMove {
            0% { transform: translate(0, 0) rotate(var(--rotation)); }
            50% { transform: translate(-20px, -10px) rotate(calc(var(--rotation) + 0.5deg)); }
            100% { transform: translate(0, 0) rotate(var(--rotation)); }
          }
          .animate-watermark {
            animation: watermarkMove 45s ease-in-out infinite;
            will-change: transform;
          }
        `}
      </style>
    </Layout>
  );
}

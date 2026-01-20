import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Users, Truck, ChevronRight, Loader2, FlaskConical, Beaker, Microscope, TestTube2, Atom, FileBadge2, Factory } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WhatsAppButton from '@/components/WhatsAppButton';

// Composant Watermark ultra-flexible pour le layering complexe
const WatermarkOverlay: React.FC<{
  image: string;
  opacity?: number;
  size?: string | number;
  rotation?: number;
  animate?: boolean;
  variant?: 'light' | 'dark' | 'blueprint'; // Ajout du mode 'blueprint' pour l'effet brevet
  blur?: number;
  zIndex?: number;
  repeat?: 'repeat' | 'no-repeat';
  position?: string;
  mixBlendMode?: 'multiply' | 'screen' | 'overlay' | 'soft-light'; // Contrôle précis du blend mode
}> = ({ image, opacity = 0.08, size = 'cover', rotation = 0, animate = true, variant = 'dark', blur = 0, zIndex = 0, repeat = 'no-repeat', position = 'center', mixBlendMode }) => {
  
  // Détermination automatique du blend mode si non spécifié
  let finalBlendMode = mixBlendMode;
  if (!finalBlendMode) {
      if (variant === 'blueprint') finalBlendMode = 'overlay';
      else finalBlendMode = variant === 'dark' ? 'multiply' : 'screen';
  }

  // Filtres spécifiques pour le style corporate
  let filters = `blur(${blur}px)`;
  if (variant === 'light') filters += ' brightness(0) invert(1)';
  else if (variant === 'dark') filters += ' grayscale(100%) contrast(120%)';
  else if (variant === 'blueprint') filters += ' grayscale(100%) brightness(1.2) contrast(150%) sepia(20%)'; // Effet papier technique

  return (
  <div
    className={`absolute inset-0 pointer-events-none ${animate ? 'animate-watermark-slow' : ''}`}
    style={{
      backgroundImage: `url(${image})`,
      backgroundRepeat: repeat,
      backgroundSize: size,
      backgroundPosition: position,
      opacity,
      zIndex,
      filter: filters,
      mixBlendMode: finalBlendMode,
      '--rotation': `${rotation}deg`,
    } as React.CSSProperties}
  />
)};

export default function Index() {
  const { language, t } = useLanguage();
  const { categories, loading } = useGitHubProducts();

  const LOGO_URL = "https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public/sicaf.png";
  
  // NOUVELLE SÉLECTION D'IMAGES CORPORATE / SCIENCE / INDUSTRIE
  // Hero: Abstrait, R&D de pointe, lumière bleue
  const IMG_HERO_SCIENCE = "https://images.unsplash.com/photo-1532187875460-12d0c2cf36e5?auto=format&fit=crop&w=2000&q=80"; 
  // Produits: Structure moléculaire, pureté, "brevet"
  const IMG_MOLECULE_STRUCT = "https://images.unsplash.com/photo-1628595351029-c2bf17511435?auto=format&fit=crop&w=2000&q=80";
  // Why Us: Verrerie de précision, contrôle qualité
  const IMG_PRECISION_LAB = "https://images.unsplash.com/photo-1581093588401-22d07cddf79b?auto=format&fit=crop&w=2000&q=80";
  // CTA: Industrie lourde, échelle globale, usine moderne
  const IMG_INDUSTRY_GLOBAL = "https://images.unsplash.com/photo-1565896311032-1334a90286b5?auto=format&fit=crop&w=2000&q=80";

  const features = [
    { icon: Shield, titleKey: 'home.quality', descKey: 'home.quality_desc' },
    { icon: Award, titleKey: 'home.expertise', descKey: 'home.expertise_desc' },
    { icon: Users, titleKey: 'home.service', descKey: 'home.service_desc' },
    { icon: Truck, titleKey: 'home.delivery', descKey: 'home.delivery_desc' },
  ];

  // Palette de couleurs "Corporate Science" (à définir dans votre tailwind.config.js idéalement)
  // On utilise ici des classes utilitaires pour simuler : Bleu profond, Gris technique.
  const bgDarkCorporate = "bg-[#0A1A2F]"; // Bleu nuit très profond
  const bgLightTechnical = "bg-[#F4F7FA]"; // Blanc cassé technique/froid

  return (
    <Layout>
      <WhatsAppButton variant="floating" />

      {/* ======================= HERO : R&D GLOBALE ======================= */}
      <section className={`relative py-32 md:py-48 text-white overflow-hidden ${bgDarkCorporate}`}>
        {/* COUCHE 1 : Ambiance Laboratoire High-Tech (Grande échelle) */}
        <WatermarkOverlay 
            image={IMG_HERO_SCIENCE} 
            variant="light" // Devient blanc sur fond sombre
            opacity={0.15}
            size="cover"
            position="center"
            blur={2} // Flou pour la profondeur de champ
            zIndex={0}
            animate={false}
        />
        
        {/* COUCHE 2 : Overlay dégradé pour assombrir et donner un ton bleu technique */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1A2F]/90 via-[#0A1A2F]/80 to-[#0A1A2F]/95" style={{zIndex: 1}} />
        
        {/* COUCHE 3 : Motif Logo Corporate Fragmenté (Filigrane de sécurité) */}
        <WatermarkOverlay 
            image={LOGO_URL} 
            variant="light" 
            opacity={0.05} // Très subtil
            rotation={-15} 
            size={130} // Petite taille pour répétition dense
            repeat='repeat' 
            zIndex={2} 
            mixBlendMode="overlay" // Incrustation subtile
        />

        <div className="relative z-10 container mx-auto px-4 text-center max-w-5xl">
          {/* Badge technique */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#1E2D4A] border border-blue-400/20 mb-10 backdrop-blur-md shadow-lg">
            <Atom className="h-5 w-5 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
              {language === 'fr' ? 'Innovation & Chimie Industrielle' : 'Innovation & Industrial Chemistry'}
            </span>
          </div>
          
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight uppercase tracking-tighter drop-shadow-2xl bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-slate-300">
            {t('hero.title')}
          </h1>
          <p className="text-2xl text-blue-50/80 mb-14 font-light max-w-3xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/catalog" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="border border-blue-400/30 text-white hover:bg-blue-400/10 hover:border-blue-400/50 w-full px-12 h-16 text-lg font-bold tracking-widest uppercase rounded-sm backdrop-blur-sm transition-all">
                {t('hero.cta')}
              </Button>
            </Link>
            <Link to="/quote" className="w-full sm:w-auto">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white border border-accent/50 font-black w-full px-12 h-16 text-lg tracking-widest uppercase shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] rounded-sm transition-all">
                {t('nav.quote')}
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ======================= PRODUCT CATEGORIES : STRUCTURE & BREVETS ======================= */}
      <section className={`relative py-32 overflow-hidden ${bgLightTechnical}`}>
        {/* COUCHE 1 : Structure Moléculaire (Effet Brevet/Blueprint) */}
        <WatermarkOverlay 
          image={IMG_MOLECULE_STRUCT} 
          variant="blueprint" // Nouveau mode "papier technique"
          opacity={0.07} 
          size="110%" // Légèrement zoomé
          position="center"
          repeat="no-repeat"
          blur={0} // Net pour voir les détails techniques
          zIndex={0}
          mixBlendMode="multiply"
          animate={false}
        />
        
        {/* COUCHE 2 : Motif Logo discret */}
        <WatermarkOverlay image={LOGO_URL} variant="dark" opacity={0.03} size={180} rotation={10} repeat='repeat' zIndex={1} mixBlendMode="multiply" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="flex justify-center mb-4">
                <FileBadge2 className="h-10 w-10 text-primary/60" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-[#0A1A2F] uppercase tracking-tight">
                {t('home.products_title')}
            </h2>
            <div className="h-1 bg-primary w-24 mx-auto mb-8"></div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
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
                  {/* Carte style "Verre trempé" et bordure technique */}
                  <Card className="group h-full hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-md border border-slate-200/60 hover:border-primary/50 rounded-none">
                    <CardContent className="p-10 relative overflow-hidden">
                      {/* Petit accent technique dans le coin */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="flex flex-col gap-6">
                        <div className="w-20 h-20 flex items-center justify-center bg-[#0A1A2F] text-white rounded-sm group-hover:bg-primary transition-all duration-500 shadow-md ring-1 ring-white/10">
                          {category.icon || <FlaskConical className="h-9 w-9" />}
                        </div>
                        <div>
                          <h3 className="font-heading font-black text-xl text-[#0A1A2F] mb-4 tracking-wide uppercase">
                            {category.name[language]}
                          </h3>
                          <p className="text-slate-600 leading-relaxed text-base">
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

      {/* ======================= WHY CHOOSE US : PRÉCISION & QUALITÉ ======================= */}
      <section className="relative py-32 overflow-hidden bg-white">
        {/* COUCHE 1 : Verrerie de précision (Nette et clinique) */}
        <WatermarkOverlay 
          image={IMG_PRECISION_LAB} 
          variant="dark" 
          opacity={0.05} 
          size="cover" 
          position="center right" // Cadrage dynamique
          repeat="no-repeat"
          blur={0} 
          zIndex={0}
          mixBlendMode="multiply"
          animate={false}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-[#0A1A2F] uppercase tracking-tight">{t('home.why_title')}</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium">{t('home.why_subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              // Cartes style "Bloc de données"
              <div key={index} className="group p-10 bg-[#F4F7FA] border border-slate-200 hover:border-[#0A1A2F] hover:bg-[#0A1A2F] hover:text-white transition-all duration-500 text-center rounded-none relative">
                {/* Ligne technique décorative */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-primary/20 group-hover:bg-primary transition-colors"></div>
                
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white border border-slate-200 text-primary group-hover:bg-white/10 group-hover:border-white/20 group-hover:text-white mb-8 shadow-sm rounded-sm transition-all">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-4 uppercase tracking-wider">{t(feature.titleKey)}</h3>
                <p className="text-sm opacity-90 leading-relaxed font-medium">{t(feature.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= CTA : PUISSANCE INDUSTRIELLE ======================= */}
      <section className={`relative py-32 overflow-hidden ${bgDarkCorporate}`}>
        {/* COUCHE 1 : Industrie Lourde / Usine (Grande échelle) */}
        <WatermarkOverlay 
            image={IMG_INDUSTRY_GLOBAL} 
            variant="light"
            opacity={0.2}
            size="cover"
            position="center"
            blur={3} // Flou pour donner une atmosphère dense
            zIndex={0}
            mixBlendMode="screen"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A2F] via-[#0A1A2F]/90 to-primary/30" style={{zIndex: 1}} />
        
        {/* COUCHE 2 : Motif Logo Corporate (Dense et net) */}
        <WatermarkOverlay image={LOGO_URL} variant="light" opacity={0.07} size={90} rotation={25} repeat='repeat' zIndex={2} mixBlendMode="overlay" />

        <div className="container mx-auto px-4 text-center relative z-10 text-white">
          <div className="mb-10 flex justify-center gap-6 opacity-50">
             <Factory className="h-16 w-16" />
             <FileBadge2 className="h-16 w-16" />
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter uppercase italic drop-shadow-2xl">
            {language === 'fr' ? "Partenaire de votre innovation" : 'Partnering for innovation'}
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Link to="/quote">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white border border-accent/50 font-black px-16 h-20 text-2xl shadow-[0_0_40px_rgba(var(--accent-rgb),0.3)] uppercase tracking-widest rounded-sm transform hover:scale-105 transition-transform">
                {t('nav.quote')}
              </Button>
            </Link>
            <WhatsAppButton variant="hero" />
          </div>
        </div>
      </section>

      <style>
        {`
          /* Animation beaucoup plus lente et subtile pour un effet "sérieux" */
          @keyframes watermarkMoveSlow {
            0% { transform: translate(0, 0) rotate(var(--rotation)); }
            50% { transform: translate(-10px, -5px) rotate(calc(var(--rotation) + 0.2deg)); }
            100% { transform: translate(0, 0) rotate(var(--rotation)); }
          }
          .animate-watermark-slow {
            animation: watermarkMoveSlow 60s ease-in-out infinite;
            will-change: transform;
          }
        `}
      </style>
    </Layout>
  );
}

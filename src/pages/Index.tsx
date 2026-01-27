import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Users, Truck, ChevronRight, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WhatsAppButton from '@/components/WhatsAppButton';

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
      <WhatsAppButton variant="floating" />

      {/* --- HERO SECTION : STYLE IDENTIQUE SICAF --- */}
      <section className="relative bg-[#000000] text-white min-h-[85vh] flex items-center overflow-hidden border-b border-white/10">
        {/* Filigrane décoratif conservé (Wave SVG en bas) */}
        <div className="absolute inset-0 z-0 opacity-20 grayscale pointer-events-none bg-[url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/labochimie.png')] bg-cover bg-center" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-12 h-[1px] bg-primary"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Expertise Industrielle</span>
            </div>

            <h1 className="text-5xl md:text-[100px] font-black uppercase italic leading-[0.85] tracking-tighter mb-10">
              {t('hero.title').split(' ')[0]} <br/>
              <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.7)' }}>
                {t('hero.title').split(' ').slice(1).join(' ')}
              </span>
            </h1>

            <p className="text-sm md:text-lg text-slate-400 max-w-xl mb-12 font-medium leading-relaxed border-l-2 border-primary pl-8">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-0">
              <Link to="/catalog">
                <Button className="bg-white text-black hover:bg-primary hover:text-white px-12 h-20 rounded-none font-black text-[11px] tracking-[0.3em] uppercase transition-all duration-300 w-full sm:w-auto">
                  {t('hero.cta')}
                </Button>
              </Link>
              <Link to="/quote">
                <Button className="bg-transparent border border-white/20 text-white hover:bg-white hover:text-black px-12 h-20 rounded-none font-black text-[11px] tracking-[0.3em] uppercase transition-all duration-300 w-full sm:w-auto">
                  {t('nav.quote')} <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>      
            </div>
          </div>
        </div>

        {/* Vos vagues décoratives originales (Fidélité à votre code) */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden z-1 opacity-10">
          <svg className="relative w-full h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" className="fill-white" />
          </svg>
        </div>
      </section>

      {/* --- SECTION PRODUITS : SLIDER VIVANT --- */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6 mb-16">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-black">
            {t('home.products_title')}
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
        ) : (
          <div className="relative border-y border-black overflow-hidden group">
            <div className="flex animate-infinite-scroll py-0 hover:pause">
              {[...categories, ...categories].map((category, idx) => (
                <div key={`${category.id}-${idx}`} className="w-[300px] md:w-[450px] border-r border-black shrink-0">
                  <Link to={`/products/${category.id}`} className="group/item block bg-white hover:bg-black transition-colors duration-500">
                    <div className="p-12 h-[350px] flex flex-col justify-between">
                      <div className="text-6xl group-hover/item:scale-110 transition-transform duration-500">
                        {category.icon}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-primary tracking-widest uppercase mb-2 block">Division</span>
                        <h3 className="text-3xl font-black uppercase italic text-black group-hover/item:text-white transition-colors">
                          {category.name[language]}
                        </h3>
                        <p className="text-xs text-slate-500 mt-4 line-clamp-2 uppercase font-bold tracking-tight">
                          {category.description[language]}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* --- WHY CHOOSE US : GRILLE INDUSTRIELLE --- */}
      <section className="py-0 bg-black">
        <div className="grid grid-cols-1 md:grid-cols-4 border-t border-white/10">
          {features.map((feature, index) => (
            <div key={index} className="p-16 border-b border-r border-white/10 hover:bg-primary transition-all duration-500 group">
              <div className="text-primary group-hover:text-white mb-8">
                <feature.icon className="h-10 w-10" />
              </div>
              <h3 className="text-white font-black uppercase italic text-sm tracking-widest mb-4">
                {t(feature.titleKey)}
              </h3>
              <p className="text-[10px] text-slate-500 group-hover:text-white/80 uppercase font-bold tracking-widest leading-relaxed">
                {t(feature.descKey)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- CTA FINAL : STYLE IDENTIQUE --- */}
      <section className="py-32 bg-white text-center relative overflow-hidden border-t-4 border-black">
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-5xl md:text-[90px] font-black uppercase italic mb-12 tracking-tighter leading-none text-black">
            Besoin d'un <span className="text-primary">Devis</span> ?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quote">
              <Button size="lg" className="bg-black text-white hover:bg-primary px-16 h-24 rounded-none font-black text-[12px] tracking-[0.4em] uppercase transition-all shadow-2xl">
                {t('nav.quote')}
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Grille technique en filigrane conservée */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
           <div className="h-full w-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>
      </section>

      {/* ANIMATION CSS POUR LE SLIDER VIVANT */}
      <style>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 35s linear infinite;
        }
        .hover\\:pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </Layout>
  );
};

export default Index;

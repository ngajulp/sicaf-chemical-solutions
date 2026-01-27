import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Users, Truck, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { language, t } = useLanguage();
  const { categories, loading } = useGitHubProducts();

  const features = [
    { icon: Shield, titleKey: 'home.quality' },
    { icon: Award, titleKey: 'home.expertise' },
    { icon: Users, titleKey: 'home.service' },
    { icon: Truck, titleKey: 'home.delivery' },
  ];

  return (
    <Layout>
      {/* --- HERO SECTION : COPIE CONFORME --- */}
      <section className="relative bg-[#000000] text-white min-h-[80vh] flex items-center overflow-hidden border-b border-white/10">
        {/* Filigrane Labo Conservé */}
        <div 
          className="absolute inset-0 z-0 opacity-20 grayscale pointer-events-none bg-[url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/labochimie.png')] bg-cover bg-center" 
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <p className="text-[#FACC15] font-bold tracking-[0.4em] uppercase text-[10px] mb-6 flex items-center gap-3">
              <span className="w-10 h-[1px] bg-[#FACC15]"></span> {language === 'fr' ? 'Solutions Chimiques' : 'Chemical Solutions'}
            </p>
            
            {/* Taille de texte normalisée SICAF */}
            <h1 className="text-5xl md:text-7xl font-black uppercase italic leading-[0.9] tracking-tighter mb-8">
              {t('hero.title').split(' ')[0]} <br/>
              <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.6)' }}>
                {t('hero.title').split(' ').slice(1).join(' ')}
              </span>
            </h1>

            <p className="text-sm md:text-base text-gray-400 max-w-lg mb-10 font-medium leading-relaxed border-l border-[#FACC15] pl-6">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-row gap-0">
              <Link to="/catalog">
                <Button className="bg-white text-black hover:bg-[#FACC15] hover:text-white px-10 h-14 rounded-none font-black text-[10px] tracking-[0.2em] uppercase transition-all duration-300">
                  {t('hero.cta')}
                </Button>
              </Link>
              <Link to="/quote">
                <Button className="bg-[#FACC15] text-white hover:bg-white hover:text-black px-10 h-14 rounded-none font-black text-[10px] tracking-[0.2em] uppercase transition-all duration-300 border-l border-white/10">
                  {t('nav.quote')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- NOS PRODUITS : SLIDER VIVANT (IDENTIQUE RÉFÉRENCE) --- */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-6 mb-12">
          <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-black">
            {t('home.products_title')}
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#FACC15]" /></div>
        ) : (
          <div className="relative border-y border-black group">
            <div className="flex animate-sicaf-slide py-0">
              {[...categories, ...categories].map((cat, i) => (
                <div key={i} className="w-[300px] md:w-[400px] flex-shrink-0 border-r border-black group/card cursor-pointer">
                  <Link to={`/products/${cat.id}`}>
                    <div className="p-10 h-[320px] bg-white group-hover/card:bg-black transition-colors duration-500 flex flex-col justify-between">
                      <div className="text-5xl group-hover/card:scale-110 transition-transform">{cat.icon}</div>
                      <div>
                        <h3 className="text-2xl font-black uppercase italic text-black group-hover/card:text-white tracking-tighter transition-colors">
                          {cat.name[language]}
                        </h3>
                        <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest opacity-0 group-hover/card:opacity-100 transition-opacity">
                          Voir la gamme +
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

      {/* --- SECTION FEATURES : GRILLE NOIRE --- */}
      <section className="bg-black border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4">
          {features.map((f, i) => (
            <div key={i} className="p-12 border-r border-b border-white/5 hover:bg-[#FACC15]/10 transition-all group">
              <f.icon className="h-7 w-7 text-[#FACC15] mb-6" />
              <h4 className="text-white font-black uppercase italic tracking-widest text-[11px]">{t(f.titleKey)}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* --- CTA FINAL : GRILLE TECHNIQUE --- */}
      <section className="relative py-24 bg-white text-center border-t-2 border-black overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-black mb-10">
            {language === 'fr' ? 'Besoin d\'un devis ?' : 'Need a quote?'}
          </h2>
          <Link to="/quote">
            <Button className="bg-black text-white hover:bg-[#FACC15] px-14 h-16 rounded-none font-black text-[10px] tracking-[0.3em] uppercase transition-all">
              {t('nav.quote')}
            </Button>
          </Link>
        </div>
        
        {/* Grille technique en filigrane (Fidélité au design original) */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[size:40px_40px] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)]" />
      </section>

      <style>{`
        @keyframes sicaf-slide {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-sicaf-slide {
          animation: sicaf-slide 30s linear infinite;
        }
        .animate-sicaf-slide:hover {
          animation-play-state: paused;
        }
      `}</style>
    </Layout>
  );
};

export default Index;

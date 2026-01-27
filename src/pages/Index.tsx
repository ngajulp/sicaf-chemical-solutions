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
      {/* --- HERO SECTION : BLEU PRÉDOMINANT & TYPO SICAF --- */}
      <section className="relative bg-[#001529] text-white h-[85vh] flex items-center overflow-hidden border-b-4 border-[#DAA520]">
        {/* Filigrane Labo Conservé (Opacité 10% pour ne pas gêner le bleu) */}
        <div 
          className="absolute inset-0 z-0 opacity-10 grayscale pointer-events-none bg-[url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/labochimie.png')] bg-cover bg-center" 
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl">
            <p className="text-[#DAA520] font-black tracking-[0.5em] uppercase text-[10px] mb-6">
              SICAF CHEMICAL SOLUTIONS
            </p>
            
            {/* Manière d'écrire SICAF : Taille massive, Italic, Outline */}
            <h1 className="text-6xl md:text-8xl font-black uppercase italic leading-[0.8] tracking-tighter mb-10">
              <span className="block">{t('hero.title').split(' ')[0]}</span>
              <span className="text-transparent" style={{ WebkitTextStroke: '1.5px #DAA520' }}>
                {t('hero.title').split(' ').slice(1).join(' ')}
              </span>
            </h1>

            <p className="text-base md:text-xl text-blue-100/70 max-w-2xl mb-12 font-medium leading-tight border-l-4 border-[#DAA520] pl-6 italic">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-0">
              {/* Bouton Format Bloc SICAF */}
              <Link to="/catalog">
                <Button className="bg-[#DAA520] text-white hover:bg-white hover:text-[#001529] px-14 h-16 rounded-none font-black text-[11px] tracking-[0.3em] uppercase transition-all duration-300 shadow-lg">
                  {t('hero.cta')}
                </Button>
              </Link>
              <Link to="/quote">
                <Button className="bg-white text-[#001529] hover:bg-[#DAA520] hover:text-white px-14 h-16 rounded-none font-black text-[11px] tracking-[0.3em] uppercase transition-all duration-300">
                  {t('nav.quote')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- NOS PRODUITS : SLIDES AVEC CARDS REMODELÉES --- */}
      <section className="py-24 bg-[#f8f9fa] overflow-hidden">
        <div className="container mx-auto px-6 mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[2px] w-12 bg-[#001529]"></div>
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-[#001529]">
              {t('home.products_title')}
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#001529]" /></div>
        ) : (
          <div className="relative border-y-2 border-[#001529]/10 group bg-white">
            <div className="flex animate-slide-vif py-0">
              {[...categories, ...categories].map((cat, i) => (
                <div key={i} className="w-[350px] md:w-[500px] flex-shrink-0 border-r-2 border-[#001529]/5 group/card cursor-pointer relative overflow-hidden h-[450px]">
                  <Link to={`/products/${cat.id}`}>
                    {/* Background visuel de la card */}
                    <div className="absolute inset-0 bg-[#001529] opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 z-0" />
                    
                    <div className="relative z-10 p-12 h-full flex flex-col justify-between">
                      <div className="text-7xl mb-6 group-hover/card:scale-110 transition-transform duration-500">
                        {cat.icon}
                      </div>
                      
                      <div>
                        <h3 className="text-3xl font-black uppercase italic text-[#001529] group-hover/card:text-[#DAA520] tracking-tighter transition-colors mb-4 leading-none">
                          {cat.name[language]}
                        </h3>
                        <p className="text-sm text-gray-500 group-hover/card:text-blue-100 transition-colors line-clamp-3 font-medium italic">
                          {cat.description[language]}
                        </p>
                        <div className="mt-8 flex items-center text-[#DAA520] font-black text-[10px] tracking-[0.2em] opacity-0 group-hover/card:opacity-100 transition-all transform translate-y-4 group-hover/card:translate-y-0">
                          EXPLORER LA DIVISION <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* --- CTA SECTION : IDENTIQUE COULEUR & FORMAT --- */}
      <section className="relative py-32 bg-[#001529] text-center overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white mb-12 leading-tight">
            BESOIN D'UNE <span className="text-[#DAA520]">EXPERTISE</span> <br/> TECHNIQUE ?
          </h2>
          <Link to="/quote">
            <Button className="bg-white text-[#001529] hover:bg-[#DAA520] hover:text-white px-20 h-20 rounded-none font-black text-[12px] tracking-[0.4em] uppercase transition-all shadow-[0_0_30px_rgba(218,165,32,0.2)]">
              DEMANDER UN DEVIS
            </Button>
          </Link>
        </div>
        
        {/* Filigrane Grille Technique Conservé (Opacité 5%) */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[size:50px_50px] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]" />
      </section>

      <style>{`
        @keyframes slide-vif {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-slide-vif {
          animation: slide-vif 45s linear infinite;
        }
        .animate-slide-vif:hover {
          animation-play-state: paused;
        }
      `}</style>
    </Layout>
  );
};

export default Index;

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

      {/* --- 1. HERO SECTION (AVEC VAGUES) --- */}
      <section className="gradient-hero text-primary-foreground py-20 md:py-32 relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-20 pointer-events-none grayscale"
          style={{
            backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/labochimie.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight uppercase tracking-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 italic">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link to="/catalog">
                <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full sm:w-auto font-bold bg-white">
                  {t('hero.cta')}
                </Button>
              </Link>
              <Link to="/quote">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold w-full sm:w-auto">
                  {t('nav.quote')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>      
            </div>
          </div>
        </div>
        
        {/* VAGUES SVG ORIGINALES */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden z-10">
          <svg className="relative w-full h-12 md:h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-background" />
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-background" />
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-background" />
          </svg>
        </div>
      </section>

      {/* --- 2. NOS PRODUITS (CAROUSEL RÉALIGNÉ) --- */}
      <section className="py-24 md:py-32 bg-background relative overflow-hidden text-center">
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-16">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6 uppercase tracking-tight">
              {t('home.products_title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto italic">
              {t('home.products_subtitle')}
            </p>
            <div className="h-1.5 w-24 bg-primary mx-auto mt-6" />
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>
          ) : (
            <div className="relative w-full overflow-hidden">
              <div className="flex animate-scroll-horizontal gap-8 w-max py-4">
                {[...categories, ...categories, ...categories].map((category, idx) => (
                  <div key={`${category.id}-${idx}`} className="w-[300px] md:w-[380px] shrink-0 text-left">
                    <Link to={`/products/${category.id}`} className="group block h-full">
                      <Card className="h-full border-none shadow-xl rounded-none overflow-hidden transition-all duration-500 hover:-translate-y-2 bg-white">
                        <div className="relative h-64 overflow-hidden">
                          {category.img ? (
                            <img src={category.img} alt={category.name[language]} className="w-full h-full object-cover grayscale-[0.6] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                          ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-6xl opacity-20">{category.icon}</div>
                          )}
                          <div className="absolute top-4 left-4">
                             <div className="bg-accent text-accent-foreground p-3 shadow-2xl text-2xl">
                               {category.icon}
                             </div>
                          </div>
                          <div className="absolute bottom-0 left-0 bg-primary text-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                             {language === 'fr' ? 'Gamme Certifiée' : 'Certified Range'}
                          </div>
                        </div>

                        <CardContent className="p-8 space-y-4">
                          <h3 className="text-2xl font-bold uppercase text-slate-900 group-hover:text-primary transition-colors min-h-[64px] leading-tight tracking-tighter">
                            {category.name[language]}
                          </h3>
                          <div className="h-1 w-12 bg-secondary group-hover:w-full transition-all duration-500" />
                          <p className="text-base text-muted-foreground line-clamp-2 italic">
                            {language === 'fr' ? "Disponibilité immédiate et solutions logistiques adaptées." : "Immediate availability and tailored logistics solutions."}
                          </p>
                          <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                            <span className="text-[11px] font-black uppercase tracking-widest text-primary">Spécifications</span>
                            <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                              <ChevronRight className="h-5 w-5 group-hover:text-white" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                ))}
              </div>
              <div className="absolute top-0 left-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
            </div>
          )}

          <div className="text-center mt-16">
            <Link to="/catalog">
              <Button size="lg" className="h-16 px-12 font-bold uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform">
                {t('catalog.title')} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- 3. POURQUOI NOUS --- */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold text-foreground mb-4 uppercase">{t('home.why_title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t('home.why_subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-none shadow-md bg-white">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6"><feature.icon className="h-8 w-8" /></div>
                  <h3 className="font-bold text-lg mb-2 uppercase">{t(feature.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground">{t(feature.descKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. CTA FINAL --- */}
      <section className="py-20 gradient-primary text-primary-foreground relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6 uppercase tracking-tighter">{language === 'fr' ? 'Sécurisez votre Approvisionnement' : 'Secure your Supply Chain'}</h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
             {language === 'fr' ? 'Nos experts traitent vos demandes de cotations en priorité pour garantir vos délais.' : 'Our experts process your quote requests as a priority to guarantee your deadlines.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quote"><Button size="lg" className="bg-accent text-accent-foreground font-bold px-12">DEVIS EXPRESS</Button></Link>
            <Link to="/contact"><Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary font-bold px-12">NOUS CONTACTER</Button></Link>
          </div>
          <div className="pt-8 flex justify-center"><WhatsAppButton variant="hero" /></div>
        </div>
      </section>

      <style>{`
        @keyframes scroll-horizontal {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-33.33% - 2.66rem)); }
        }
        .animate-scroll-horizontal { animation: scroll-horizontal 45s linear infinite; }
        .animate-scroll-horizontal:hover { animation-play-state: paused; }
      `}</style>
    </Layout>
  );
};

export default Index;

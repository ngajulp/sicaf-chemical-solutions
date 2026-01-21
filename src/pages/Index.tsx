import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Users, Truck, ChevronRight, Loader2, Beaker, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Badge } from '@/components/ui/badge';

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

      {/* 1. HERO SECTION - Plus d'impact et de hauteur */}
      <section className="relative text-white min-h-[90vh] flex items-center pt-20 pb-32 overflow-hidden bg-slate-900">
        <div 
          className="absolute inset-0 z-0 opacity-40 grayscale-[0.5]"
          style={{
            backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/labochimie.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-background z-1" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <Badge className="mb-6 bg-secondary text-primary font-black uppercase tracking-[0.3em] px-4 py-2 border-none">
              Expertise Chimique Industrielle
            </Badge>
            <h1 className="font-heading text-5xl md:text-8xl font-black mb-8 leading-[0.9] uppercase italic tracking-tighter">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-3xl text-white/90 mb-12 max-w-2xl font-medium leading-relaxed italic border-l-4 border-secondary pl-6">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/catalog">
                <Button size="lg" className="h-20 px-10 bg-secondary text-primary hover:bg-white font-black uppercase tracking-widest italic text-lg shadow-2xl transition-all hover:-translate-y-1">
                  {t('hero.cta')}
                </Button>
              </Link>
              <Link to="/quote">
                <Button size="lg" variant="outline" className="h-20 px-10 border-2 border-white text-white hover:bg-white hover:text-primary font-black uppercase tracking-widest italic text-lg backdrop-blur-sm">
                  {t('nav.quote')}
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>      
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg className="w-full h-24 text-background fill-current" viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,100 C480,100 960,100 1440,100 L1440,0 C960,100 480,0 0,0 Z"></path>
          </svg>
        </div>
      </section>

      {/* 2. PRODUCT CATEGORIES - Filigrane très visible en fond */}
      <section className="py-24 md:py-32 bg-background relative">
        <div 
          className="absolute inset-0 z-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/stockageproduits.png')`,
            backgroundSize: '1200px',
            backgroundPosition: 'right -200px top 100px',
            backgroundRepeat: 'no-repeat'
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="font-heading text-4xl md:text-6xl font-black text-foreground mb-6 uppercase italic tracking-tighter">
                {t('home.products_title')}
              </h2>
              <div className="h-2 w-24 bg-primary mb-6" />
              <p className="text-xl text-muted-foreground font-medium">
                {t('home.products_subtitle')}
              </p>
            </div>
            <Link to="/catalog" className="hidden md:block">
               <Button variant="outline" className="border-2 border-primary text-primary font-black uppercase tracking-widest italic hover:bg-primary hover:text-white transition-all">
                  Voir tout le catalogue
               </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {categories.map((category) => (
                <Link key={category.id} to={`/products/${category.id}`} className="group">
                  <Card className="h-full border-none shadow-[0_10px_40px_rgba(0,0,0,0.04)] bg-white/80 backdrop-blur-xl group-hover:shadow-[0_20px_60px_rgba(0,102,204,0.15)] transition-all duration-500 rounded-none border-l-0 group-hover:border-l-[8px] group-hover:border-primary">
                    <CardContent className="p-10">
                      <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-500 block origin-left">
                        {category.icon}
                      </div>
                      <h3 className="font-heading text-2xl font-black text-foreground mb-4 uppercase italic tracking-tighter group-hover:text-primary transition-colors">
                        {category.name[language]}
                      </h3>
                      <p className="text-slate-500 font-medium leading-relaxed mb-8">
                        {category.description[language]}
                      </p>
                      <div className="flex items-center text-primary font-black uppercase text-xs tracking-[0.2em]">
                        Explorer la gamme
                        <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. WHY CHOOSE US - Design épuré et fort */}
      <section className="py-24 md:py-32 bg-slate-900 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 -skew-x-12 translate-x-1/4" />
         
         <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
               <div>
                  <h2 className="font-heading text-4xl md:text-6xl font-black mb-8 uppercase italic tracking-tighter">
                    {t('home.why_title')}
                  </h2>
                  <p className="text-xl text-slate-400 font-medium mb-12">
                    {t('home.why_subtitle')}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                      <div key={index} className="space-y-4">
                        <div className="w-12 h-12 bg-secondary flex items-center justify-center rounded-none rotate-3">
                           <feature.icon className="h-6 w-6 text-primary -rotate-3" />
                        </div>
                        <h3 className="font-black uppercase tracking-widest text-sm text-white">
                          {t(feature.titleKey)}
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {t(feature.descKey)}
                        </p>
                      </div>
                    ))}
                  </div>
               </div>
               <div className="relative">
                  <div className="absolute -inset-4 border-2 border-secondary/30 translate-x-8 translate-y-8" />
                  <img 
                    src="https://images.unsplash.com/photo-1532187875605-2fe358a3d46a?auto=format&fit=crop&q=80" 
                    alt="Laboratoire SICAF" 
                    className="relative z-10 w-full h-[500px] object-cover grayscale"
                  />
                  <div className="absolute bottom-8 left-8 z-20 bg-primary p-8 max-w-[200px]">
                     <p className="text-4xl font-black italic tracking-tighter">15+</p>
                     <p className="text-xs font-bold uppercase tracking-widest opacity-80">Années d'excellence</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. CTA FINAL - Dynamique */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/industriechimie.png')`,
            backgroundSize: 'cover'
          }}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-heading text-4xl md:text-7xl font-black mb-8 uppercase italic tracking-tighter">
            {language === 'fr' ? 'Prêt à transformer votre production ?' : 'Ready to boost your production?'}
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/quote">
              <Button size="lg" className="h-20 px-12 bg-white text-primary hover:bg-secondary hover:text-primary font-black uppercase tracking-widest italic text-xl shadow-2xl transition-all hover:scale-105">
                {t('nav.quote')}
              </Button>
            </Link>
            <WhatsAppButton variant="hero" />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

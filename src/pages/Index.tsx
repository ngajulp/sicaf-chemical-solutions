import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Users, Truck,ChevronRight, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card, CardContent } from '@/components/ui/card';
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
      {/* --- HERO SECTION : BLEU PRÉDOMINANT & TYPO SICAF --- */}
      {/* Floating WhatsApp Button */}
      <WhatsAppButton variant="floating" />
      <section className="gradient-hero text-primary-foreground py-20 md:py-32 relative">
        {/* FILIGRANE LABOCHIMIE - Ajouté en respectant le style initial */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20 grayscale mix-blend-overlay"
            style={{ 
              backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/labochimie.png')` 
            }}
          />
        </div>
      
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link to="/catalog">
                <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full sm:w-auto">
                  {t('hero.cta')}
                </Button>
              </Link>
              <Link to="/quote">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold w-full sm:w-auto">
                  {t('nav.quote')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>      
            </div>
          </div>
        </div>
      
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg className="relative w-full h-12 md:h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                  opacity=".25" 
                  className="fill-background" />
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
                  opacity=".5" 
                  className="fill-background" />
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
                  className="fill-background" />
          </svg>
        </div>
      </section>

      {/* --- NOS PRODUITS : SLIDES AVEC CARDS REMODELÉES --- */}
      <section className="py-24 bg-[#f8f9fa] overflow-hidden">
        <div className="container mx-auto px-6 mb-16">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-[2px] w-12 bg-[#001529]"></div>
          {/* Taille réduite pour correspondre à la section "Why Choose Us" */}
          <h2 className="font-heading text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-[#001529]">
            {t('home.products_title')}
          </h2>
        </div>
      </div>
      
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin h-10 w-10 text-[#001529]" />
          </div>
        ) : (
          <div className="relative group">
            {/* Container du Slider */}
            <div className="flex animate-slide-vif py-6">
              {[...categories, ...categories].map((cat, i) => (
                <div key={i} className="w-[380px] md:w-[450px] flex-shrink-0 px-4">
                  <Link to={`/products/${cat.id}`}>
                    {/* --- ASPECT DES CARDS DU DEUXIÈME CODE --- */}
                    <div className="bg-white p-8 rounded-xl border-2 border-transparent hover:border-[#DAA520]/20 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 h-full flex items-start gap-6 group/card">
                      
                      {/* Icône à gauche avec fond */}
                      <div className="text-5xl p-5 bg-blue-50 text-[#001529] rounded-2xl group-hover/card:bg-[#001529] group-hover/card:text-white transition-all duration-500 shadow-inner">
                        {cat.icon}
                      </div>
                      
                      {/* Contenu à droite */}
                      <div className="flex-1">
                        <h3 className="text-xl font-black uppercase italic text-[#001529] group-hover/card:text-[#DAA520] transition-colors mb-2 tracking-tight">
                          {cat.name[language]}
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 font-medium">
                          {cat.description[language]}
                        </p>
                        
                        {/* Petit indicateur d'action */}
                        <div className="mt-4 flex items-center text-[#DAA520] font-black text-[10px] tracking-widest opacity-0 group-hover/card:opacity-100 transition-all transform translate-x-[-10px] group-hover/card:translate-x-0">
                          VOIR LA GAMME <ArrowRight className="ml-2 h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      
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
      </section>
      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('home.why_title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.why_subtitle')}
            </p>
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
                  <p className="text-sm text-muted-foreground">
                    {t(feature.descKey)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 md:py-20 gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            {language === 'fr' ? 'Besoin d\'un devis personnalisé ?' : 'Need a custom quote?'}
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            {language === 'fr' 
              ? 'Notre équipe d\'experts est prête à vous accompagner dans vos projets'
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
              <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full sm:w-auto">
                {t('nav.contact')}
              </Button>
            </Link>
          </div>
          
          {/* WhatsApp CTA */}
          <div className="pt-4">
            <WhatsAppButton variant="hero" />
          </div>
        </div>
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

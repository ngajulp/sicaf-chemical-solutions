import { Target, Heart, Lightbulb, Leaf } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const { t } = useLanguage();

  const values = [
    { icon: Target, titleKey: 'about.value1', descKey: 'about.value1_desc' },
    { icon: Heart, titleKey: 'about.value2', descKey: 'about.value2_desc' },
    { icon: Lightbulb, titleKey: 'about.value3', descKey: 'about.value3_desc' },
    { icon: Leaf, titleKey: 'about.value4', descKey: 'about.value4_desc' },
  ];

  return (
    <Layout>
      {/* 1. HERO SECTION - Filigrane Labo */}
      <section className="gradient-hero text-primary-foreground py-20 md:py-32 relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-20 pointer-events-none grayscale"
          style={{
            backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/labochimie.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 tracking-tight uppercase">
            {t('about.title')}
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto font-medium leading-relaxed italic">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* 2. HISTORY & MISSION - Filigrane aligné TOP pour visibilité maximale */}
      <section className="py-24 md:py-36 bg-background relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-15 pointer-events-none grayscale"
          style={{
            backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/stockageproduits.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'top', // Correction demandée : alignement en haut
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* History Bloc */}
            <div className="bg-white/75 backdrop-blur-md p-10 border-l-[5px] border-primary shadow-xl">
              <h2 className="font-heading text-3xl font-bold text-foreground mb-6 uppercase tracking-tighter italic">
                {t('about.history_title')}
              </h2>
              <div className="h-1 bg-primary/20 w-20 mb-6"></div>
              <p className="text-muted-foreground leading-relaxed font-semibold text-lg">
                {t('about.history')}
              </p>
            </div>

            {/* Mission Bloc */}
            <div className="bg-white/75 backdrop-blur-md p-10 border-l-[5px] border-primary shadow-xl">
              <h2 className="font-heading text-3xl font-bold text-foreground mb-6 uppercase tracking-tighter italic">
                {t('about.mission_title')}
              </h2>
              <div className="h-1 bg-primary/20 w-20 mb-6"></div>
              <p className="text-muted-foreground leading-relaxed font-semibold text-lg">
                {t('about.mission')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VALUES SECTION - Filigrane Produits Chimiques */}
      <section className="py-20 md:py-28 bg-muted relative overflow-hidden border-y border-slate-200">
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none grayscale"
          style={{
            backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/produitschimique.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground text-center mb-16 uppercase tracking-tighter">
            {t('about.values_title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="group text-center border-none shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm hover:-translate-y-2">
                <CardContent className="pt-10 pb-8 px-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-foreground mb-6 transform group-hover:scale-110 transition-transform duration-300 shadow-inner">
                    <value.icon className="h-10 w-10" />
                  </div>
                  <h3 className="font-heading font-black text-xl text-foreground mb-4 uppercase italic">
                    {t(value.titleKey)}
                  </h3>
                  <p className="text-slate-600 font-bold leading-snug">
                    {t(value.descKey)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COMPANY STATS - Filigrane Industrie (Style CTA) */}
      <section className="py-20 md:py-24 gradient-primary text-primary-foreground relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-overlay grayscale"
          style={{
            backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/industriechimie.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="text-5xl md:text-7xl font-black mb-3 drop-shadow-lg italic">20+</div>
              <div className="text-primary-foreground font-black uppercase tracking-widest text-sm">
                {t('about.history_title').includes('Histoire') ? 'Années d\'expérience' : 'Years of Experience'}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-5xl md:text-7xl font-black mb-3 drop-shadow-lg italic">39</div>
              <div className="text-primary-foreground font-black uppercase tracking-widest text-sm">
                {t('about.history_title').includes('Histoire') ? 'Produits chimiques' : 'Chemical Products'}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-5xl md:text-7xl font-black mb-3 drop-shadow-lg italic">9</div>
              <div className="text-primary-foreground font-black uppercase tracking-widest text-sm">
                {t('about.history_title').includes('Histoire') ? 'Catégories' : 'Categories'}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-5xl md:text-7xl font-black mb-3 drop-shadow-lg italic">500+</div>
              <div className="text-primary-foreground font-black uppercase tracking-widest text-sm">
                {t('about.history_title').includes('Histoire') ? 'Clients satisfaits' : 'Satisfied Clients'}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;

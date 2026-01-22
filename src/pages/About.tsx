import { Target, Heart, Lightbulb, Leaf, ShieldCheck, Factory, Microscope, Users2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const { t, language } = useLanguage();

  const values = [
    { icon: Target, titleKey: 'about.value1', descKey: 'about.value1_desc' },
    { icon: Heart, titleKey: 'about.value2', descKey: 'about.value2_desc' },
    { icon: Lightbulb, titleKey: 'about.value3', descKey: 'about.value3_desc' },
    { icon: Leaf, titleKey: 'about.value4', descKey: 'about.value4_desc' },
  ];

  return (
    <Layout>
      {/* --- 1. HERO SECTION UNIFORMISÉE --- */}
      <section className="relative text-white min-h-[450px] md:h-[550px] flex items-center py-24 overflow-hidden bg-slate-900">
        <div 
          className="absolute inset-0 z-0 opacity-25 grayscale brightness-125 scale-105 pointer-events-none"
          style={{
            backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/labochimie.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent z-1" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 bg-primary/20 text-secondary px-4 py-2 border-l-4 border-secondary mb-8">
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                {language === 'fr' ? 'Identité & Engagement' : 'Identity & Commitment'}
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-8 uppercase italic tracking-tighter leading-[0.9] drop-shadow-2xl">
              {t('about.title').split(' ')[0]} <br/>
              <span className="text-primary-foreground/40">{t('about.title').split(' ').slice(1).join(' ')}</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 font-medium italic border-l-4 border-primary pl-8 max-w-2xl leading-relaxed">
              {t('about.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* --- 2. HISTORY & MISSION (Style Industriel épuré) --- */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-5 pointer-events-none grayscale"
          style={{
            backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/stockageproduits.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'top',
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* History Bloc */}
            <div className="group">
              <div className="flex items-center gap-4 mb-6">
                <Factory className="h-8 w-8 text-primary" />
                <h2 className="font-heading text-4xl font-black text-slate-900 uppercase tracking-tighter italic">
                  {t('about.history_title')}
                </h2>
              </div>
              <div className="h-1.5 bg-secondary w-20 mb-8 group-hover:w-full transition-all duration-700"></div>
              <p className="text-slate-600 leading-relaxed font-medium text-lg border-l-2 border-slate-100 pl-6 italic">
                {t('about.history')}
              </p>
            </div>

            {/* Mission Bloc */}
            <div className="group">
              <div className="flex items-center gap-4 mb-6">
                <Microscope className="h-8 w-8 text-primary" />
                <h2 className="font-heading text-4xl font-black text-slate-900 uppercase tracking-tighter italic">
                  {t('about.mission_title')}
                </h2>
              </div>
              <div className="h-1.5 bg-secondary w-20 mb-8 group-hover:w-full transition-all duration-700"></div>
              <p className="text-slate-600 leading-relaxed font-medium text-lg border-l-2 border-slate-100 pl-6 italic">
                {t('about.mission')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. VALUES SECTION (Cartes plus lisibles) --- */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">Nos Piliers</p>
            <h2 className="font-heading text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter italic">
              {t('about.values_title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="border-none shadow-xl rounded-none overflow-hidden group hover:bg-slate-900 transition-all duration-500">
                <CardContent className="pt-12 pb-10 px-8 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 text-primary mb-8 rounded-none group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <value.icon className="h-10 w-10" />
                  </div>
                  <h3 className="font-black text-xl text-slate-900 mb-4 uppercase italic tracking-tighter group-hover:text-white transition-colors">
                    {t(value.titleKey)}
                  </h3>
                  <p className="text-slate-500 text-sm font-bold leading-relaxed uppercase tracking-tight group-hover:text-slate-400">
                    {t(value.descKey)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. COMPANY STATS (Style CTA Uniforme) --- */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none grayscale"
          style={{
            backgroundImage: `url('https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/img/industriechimie.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { label: language === 'fr' ? "ANNÉES D'EXPERTISE" : "YEARS OF EXPERTISE", val: "20+" },
              { label: language === 'fr' ? "PRODUITS RÉFÉRENCÉS" : "CHEMICAL PRODUCTS", val: "39+" },
              { label: language === 'fr' ? "DIVISIONS TECHNIQUES" : "TECHNICAL DIVISIONS", val: "09" },
              { label: language === 'fr' ? "CLIENTS INDUSTRIELS" : "INDUSTRIAL CLIENTS", val: "500+" }
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-6xl md:text-8xl font-black mb-4 italic tracking-tighter text-white group-hover:text-secondary transition-colors duration-500">
                  {stat.val}
                </div>
                <div className="h-1 w-12 bg-primary mx-auto mb-4 group-hover:w-full transition-all duration-500" />
                <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;

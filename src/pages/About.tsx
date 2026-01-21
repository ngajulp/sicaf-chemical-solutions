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
      {/* Hero */}
      <section className="gradient-hero text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            {t('about.title')}
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* History & Mission */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* History */}
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">
                {t('about.history_title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('about.history')}
              </p>
            </div>

            {/* Mission */}
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6">
                {t('about.mission_title')}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('about.mission')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            {t('about.values_title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-4">
                    <value.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                    {t(value.titleKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t(value.descKey)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-16 md:py-20 gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">20+</div>
              <div className="text-primary-foreground/80">
                {t('about.history_title').includes('Histoire') ? 'Années d\'expérience' : 'Years of Experience'}
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">39</div>
              <div className="text-primary-foreground/80">
                {t('about.history_title').includes('Histoire') ? 'Produits chimiques' : 'Chemical Products'}
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">9</div>
              <div className="text-primary-foreground/80">
                {t('about.history_title').includes('Histoire') ? 'Catégories' : 'Categories'}
              </div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-primary-foreground/80">
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

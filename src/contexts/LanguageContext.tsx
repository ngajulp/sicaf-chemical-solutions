import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.about': 'À Propos',
    'nav.products': 'Produits',
    'nav.catalog': 'Catalogue',
    'nav.contact': 'Contacts',
    'nav.quote': 'Demandez un Dévis',
    
    // Categories
    'cat.treated_water': 'Eaux Et Environenemt',
    'cat.mineral_acids': 'Acides Minéraux',
    'cat.organic_acids': 'Acides Organiques',
    'cat.bases': 'Bases & Hydroxydes',
    'cat.salts': 'Sels & Composés Minéraux',
    'cat.resins': 'Résines & Adsorbants',
    'cat.solvents': 'Solvants & Additifs',
    'cat.specialized': 'Produits Spécialisés',
    'cat.water_treatment': 'Systèmes de Traitement de l\'Eau',
    
    // Hero
    'hero.title': 'Excellence en Chimie Industrielle',
    'hero.subtitle': 'Votre partenaire de confiance pour la distribution des produits chimique de haute qualité ',
    'hero.cta': 'Découvrir nos produits',
    'hero.contact': 'Nous contacter',
    
    // Home sections
    'home.products_title': 'Nos Produits',
    'home.products_subtitle': 'Une gamme complète de produits chimiques pour répondre à tous vos besoins',
    'home.why_title': 'Pourquoi Choisir SICAF ?',
    'home.why_subtitle': 'Notre engagement envers l\'excellence nous distingue',
    'home.quality': 'Qualité Supérieure',
    'home.quality_desc': 'Tous nos produits respectent les normes internationales de qualité les plus strictes',
    'home.expertise': 'Expertise Reconnue',
    'home.expertise_desc': 'Plus de 20 ans d\'expérience dans l\'industrie chimique africaine',
    'home.service': 'Service Client',
    'home.service_desc': 'Un accompagnement personnalisé pour chacun de nos clients',
    'home.delivery': 'Livraison Rapide',
    'home.delivery_desc': 'Un réseau logistique optimisé pour des livraisons dans toute l\'Afrique',
    
    // Product table
    'table.reference': 'Référence',
    'table.product': 'Produit',
    'table.applications': 'Applications principales',
    'table.specifications': 'Spécifications',
    
    // Contact
    'contact.title': 'Contactez-Nous',
    'contact.subtitle': 'Notre équipe est à votre disposition pour répondre à toutes vos questions',
    'contact.name': 'Nom complet',
    'contact.email': 'Adresse email',
    'contact.phone': 'Téléphone',
    'contact.company': 'Entreprise',
    'contact.message': 'Votre message',
    'contact.send': 'Envoyer le message',
    'contact.info_title': 'Nos Coordonnées',
    'contact.address': 'Adresse',
    'contact.success': 'Message envoyé avec succès !',
    
    // Quote
    'quote.title': 'Demandez un Dévis',
    'quote.subtitle': 'Sélectionnez les produits qui vous intéressent et recevez un devis personnalisé',
    'quote.select_products': 'Sélectionnez les produits',
    'quote.quantity': 'Quantité estimée',
    'quote.additional_info': 'Informations complémentaires',
    'quote.submit': 'Soumettre la demande',
    
    // Catalog
    'catalog.title': 'Catalogue Complet',
    'catalog.subtitle': 'Explorez notre gamme complète de produits chimiques',
    'catalog.search': 'Rechercher un produit...',
    'catalog.filter': 'Filtrer par catégorie',
    'catalog.all': 'Toutes les catégories',
    'catalog.download': 'Télécharger la brochure PDF',
    'catalog.products_count': 'produits trouvés',
    
    // About
    'about.title': 'À Propos de SICAF',
    'about.subtitle': 'Société des Industries Chimiques d\'Afrique',
    'about.history_title': 'Notre Histoire',
    'about.history': 'Fondée à Douala, au cœur économique du Cameroun, SICAF s\'est imposée comme un leader dans la distribution de produits chimiques industriels en Afrique centrale. Notre engagement envers la qualité et l\'innovation nous permet de servir efficacement les industries les plus exigeantes.',
    'about.mission_title': 'Notre Mission',
    'about.mission': 'Fournir des solutions chimiques de haute qualité qui répondent aux besoins spécifiques de chaque industrie, tout en maintenant les plus hauts standards de sécurité et de respect de l\'environnement.',
    'about.values_title': 'Nos Valeurs',
    'about.value1': 'Excellence',
    'about.value1_desc': 'Nous visons l\'excellence dans chaque aspect de notre activité',
    'about.value2': 'Intégrité',
    'about.value2_desc': 'Nous agissons avec honnêteté et transparence',
    'about.value3': 'Innovation',
    'about.value3_desc': 'Nous recherchons constamment de meilleures solutions',
    'about.value4': 'Responsabilité',
    'about.value4_desc': 'Nous nous engageons pour un avenir durable',
    
    // Footer
    'footer.rights': 'Tous droits réservés',
    'footer.quick_links': 'Liens Rapides',
    'footer.our_products': 'Nos Produits',
    'footer.contact_us': 'Contactez-Nous',
    'footer.description': 'Leader dans la distribution de produits chimiques industriels en Afrique centrale, nous offrons des solutions de qualité pour toutes vos applications industrielles.',
    
    // Common
    'common.learn_more': 'En savoir plus',
    'common.view_products': 'Voir les produits',
    'common.back_to_catalog': 'Retour au catalogue',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.products': 'Products',
    'nav.catalog': 'Catalog',
    'nav.contact': 'Contact',
    'nav.quote': 'Request Quote',
    
    // Categories
    'cat.treated_water': 'Treated Water',
    'cat.mineral_acids': 'Mineral Acids',
    'cat.organic_acids': 'Organic Acids',
    'cat.bases': 'Bases & Hydroxides',
    'cat.salts': 'Salts & Mineral Compounds',
    'cat.resins': 'Resins & Adsorbents',
    'cat.solvents': 'Solvents & Additives',
    'cat.specialized': 'Specialized Products',
    'cat.water_treatment': 'Water Treatment Systems',
    
    // Hero
    'hero.title': 'Excellence in Industrial Chemistry',
    'hero.subtitle': 'Your trusted partner for high-quality chemical products in Africa',
    'hero.cta': 'Discover our products',
    'hero.contact': 'Contact us',
    
    // Home sections
    'home.products_title': 'Our Product Categories',
    'home.products_subtitle': 'A complete range of chemical products to meet all your industrial needs',
    'home.why_title': 'Why Choose SICAF?',
    'home.why_subtitle': 'Our commitment to excellence sets us apart',
    'home.quality': 'Superior Quality',
    'home.quality_desc': 'All our products meet the strictest international quality standards',
    'home.expertise': 'Recognized Expertise',
    'home.expertise_desc': 'Over 20 years of experience in the African chemical industry',
    'home.service': 'Customer Service',
    'home.service_desc': 'Personalized support for each of our customers',
    'home.delivery': 'Fast Delivery',
    'home.delivery_desc': 'An optimized logistics network for deliveries throughout Africa',
    
    // Product table
    'table.reference': 'Reference',
    'table.product': 'Product',
    'table.applications': 'Main Applications',
    'table.specifications': 'Specifications',
    
    // Contact
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Our team is available to answer all your questions',
    'contact.name': 'Full name',
    'contact.email': 'Email address',
    'contact.phone': 'Phone',
    'contact.company': 'Company',
    'contact.message': 'Your message',
    'contact.send': 'Send message',
    'contact.info_title': 'Our Contact Details',
    'contact.address': 'Address',
    'contact.success': 'Message sent successfully!',
    
    // Quote
    'quote.title': 'Quote Request',
    'quote.subtitle': 'Select the products you are interested in and receive a personalized quote',
    'quote.select_products': 'Select products',
    'quote.quantity': 'Estimated quantity',
    'quote.additional_info': 'Additional information',
    'quote.submit': 'Submit request',
    
    // Catalog
    'catalog.title': 'Complete Catalog',
    'catalog.subtitle': 'Explore our complete chemical products',
    'catalog.search': 'Search for a product...',
    'catalog.filter': 'Filter by category',
    'catalog.all': 'All categories',
    'catalog.download': 'Download PDF brochure',
    'catalog.products_count': 'products found',
    
    // About
    'about.title': 'About SICAF',
    'about.subtitle': 'Société des Industries Chimiques d\'Afrique',
    'about.history_title': 'Our History',
    'about.history': 'Founded in Douala, at the economic heart of Cameroon, SICAF has established itself as a leader in the distribution of industrial chemical products in Central Africa. Our commitment to quality and innovation allows us to efficiently serve the most demanding industries.',
    'about.mission_title': 'Our Mission',
    'about.mission': 'Provide high-quality chemical solutions that meet the specific needs of each industry, while maintaining the highest standards of safety and environmental respect.',
    'about.values_title': 'Our Values',
    'about.value1': 'Excellence',
    'about.value1_desc': 'We strive for excellence in every aspect of our business',
    'about.value2': 'Integrity',
    'about.value2_desc': 'We act with honesty and transparency',
    'about.value3': 'Innovation',
    'about.value3_desc': 'We constantly seek better solutions',
    'about.value4': 'Responsibility',
    'about.value4_desc': 'We are committed to a sustainable future',
    
    // Footer
    'footer.rights': 'All rights reserved',
    'footer.quick_links': 'Quick Links',
    'footer.our_products': 'Our Products',
    'footer.contact_us': 'Contact Us',
    'footer.description': 'Leader in the distribution of industrial chemical products in Central Africa, we offer quality solutions for all your industrial applications.',
    
    // Common
    'common.learn_more': 'Learn more',
    'common.view_products': 'View products',
    'common.back_to_catalog': 'Back to catalog',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

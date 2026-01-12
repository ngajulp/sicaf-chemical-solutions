export interface Product {
  reference: string;
  name: {
    fr: string;
    en: string;
  };
  applications: {
    fr: string;
    en: string;
  };
  specifications: string;
  category: string;
}

export interface Category {
  id: string;
  name: {
    fr: string;
    en: string;
  };
  icon: string;
  description: {
    fr: string;
    en: string;
  };
}

export const categories: Category[] = [
  {
    id: 'treated_water',
    name: { fr: 'Eaux Traitées', en: 'Treated Water' },
    icon: '🧪',
    description: {
      fr: 'Eaux purifiées pour applications industrielles et laboratoires',
      en: 'Purified water for industrial applications and laboratories'
    }
  },
  {
    id: 'mineral_acids',
    name: { fr: 'Acides Minéraux', en: 'Mineral Acids' },
    icon: '⚗️',
    description: {
      fr: 'Acides inorganiques pour diverses applications industrielles',
      en: 'Inorganic acids for various industrial applications'
    }
  },
  {
    id: 'organic_acids',
    name: { fr: 'Acides Organiques', en: 'Organic Acids' },
    icon: '🧬',
    description: {
      fr: 'Acides organiques pour l\'alimentation et la pharmaceutique',
      en: 'Organic acids for food and pharmaceutical industries'
    }
  },
  {
    id: 'bases',
    name: { fr: 'Bases & Hydroxydes', en: 'Bases & Hydroxides' },
    icon: '🧱',
    description: {
      fr: 'Solutions alcalines pour le traitement et la production',
      en: 'Alkaline solutions for treatment and production'
    }
  },
  {
    id: 'salts',
    name: { fr: 'Sels & Composés Minéraux', en: 'Salts & Mineral Compounds' },
    icon: '🧂',
    description: {
      fr: 'Composés minéraux pour diverses industries',
      en: 'Mineral compounds for various industries'
    }
  },
  {
    id: 'resins',
    name: { fr: 'Résines & Adsorbants', en: 'Resins & Adsorbents' },
    icon: '🧽',
    description: {
      fr: 'Matériaux filtrants et adsorbants',
      en: 'Filtering and adsorbent materials'
    }
  },
  {
    id: 'solvents',
    name: { fr: 'Solvants & Additifs', en: 'Solvents & Additives' },
    icon: '🧴',
    description: {
      fr: 'Solvants industriels et additifs chimiques',
      en: 'Industrial solvents and chemical additives'
    }
  },
  {
    id: 'specialized',
    name: { fr: 'Produits Spécialisés', en: 'Specialized Products' },
    icon: '🧪',
    description: {
      fr: 'Produits chimiques pour applications spécifiques',
      en: 'Chemical products for specific applications'
    }
  },
  {
    id: 'water_treatment',
    name: { fr: 'Systèmes de Traitement de l\'Eau', en: 'Water Treatment Systems' },
    icon: '🚰',
    description: {
      fr: 'Équipements et produits pour le traitement de l\'eau',
      en: 'Equipment and products for water treatment'
    }
  }
];

export const products: Product[] = [
  // Eaux Traitées
  {
    reference: 'WF-EAU-001',
    name: { fr: 'Eau déminéralisée', en: 'Demineralized water' },
    applications: { fr: 'Laboratoires, industries pharmaceutique et électronique', en: 'Laboratories, pharmaceutical and electronic industries' },
    specifications: 'Conductivité < 1 µS/cm',
    category: 'treated_water'
  },
  {
    reference: 'WF-EAU-002',
    name: { fr: 'Eau distillée', en: 'Distilled water' },
    applications: { fr: 'Analyses scientifiques, batteries, systèmes de refroidissement', en: 'Scientific analyses, batteries, cooling systems' },
    specifications: 'Pureté > 99,9 %',
    category: 'treated_water'
  },
  {
    reference: 'WF-EAU-003',
    name: { fr: 'Eau alcaline', en: 'Alkaline water' },
    applications: { fr: 'Traitement des eaux, industries alimentaire et pharmaceutique', en: 'Water treatment, food and pharmaceutical industries' },
    specifications: 'pH 8,5 – 9,5',
    category: 'treated_water'
  },
  
  // Acides Minéraux
  {
    reference: 'WF-AC-101',
    name: { fr: 'Acide chlorhydrique', en: 'Hydrochloric acid' },
    applications: { fr: 'Décapage métallurgique, traitement des eaux, ajustement pH', en: 'Metallurgical pickling, water treatment, pH adjustment' },
    specifications: '30 – 33 %',
    category: 'mineral_acids'
  },
  {
    reference: 'WF-AC-102',
    name: { fr: 'Acide sulfurique', en: 'Sulfuric acid' },
    applications: { fr: 'Industries chimiques, batteries, traitement des métaux', en: 'Chemical industries, batteries, metal treatment' },
    specifications: '96 – 98 %',
    category: 'mineral_acids'
  },
  {
    reference: 'WF-AC-103',
    name: { fr: 'Acide nitrique', en: 'Nitric acid' },
    applications: { fr: 'Engrais, explosifs, métallurgie, gravure', en: 'Fertilizers, explosives, metallurgy, etching' },
    specifications: '65 – 68 %',
    category: 'mineral_acids'
  },
  {
    reference: 'WF-AC-104',
    name: { fr: 'Acide phosphorique', en: 'Phosphoric acid' },
    applications: { fr: 'Engrais, détergents, alimentaire, traitement des métaux', en: 'Fertilizers, detergents, food, metal treatment' },
    specifications: '75 – 85 %',
    category: 'mineral_acids'
  },
  
  // Acides Organiques
  {
    reference: 'WF-AC-201',
    name: { fr: 'Acide acétique', en: 'Acetic acid' },
    applications: { fr: 'Alimentaire, textile, pharmaceutique', en: 'Food, textile, pharmaceutical' },
    specifications: '80 – 99 %',
    category: 'organic_acids'
  },
  {
    reference: 'WF-AC-202',
    name: { fr: 'Acide citrique', en: 'Citric acid' },
    applications: { fr: 'Alimentaire, pharmaceutique, détergents', en: 'Food, pharmaceutical, detergents' },
    specifications: 'Qualité USP/BP',
    category: 'organic_acids'
  },
  {
    reference: 'WF-AC-203',
    name: { fr: 'Acide laurique', en: 'Lauric acid' },
    applications: { fr: 'Cosmétiques, détergents, pharmaceutiques', en: 'Cosmetics, detergents, pharmaceuticals' },
    specifications: 'Pureté > 98 %',
    category: 'organic_acids'
  },
  {
    reference: 'WF-AC-204',
    name: { fr: 'Acide ascorbique', en: 'Ascorbic acid' },
    applications: { fr: 'Alimentaire, pharmaceutique, cosmétique', en: 'Food, pharmaceutical, cosmetic' },
    specifications: 'Qualité USP/BP',
    category: 'organic_acids'
  },
  
  // Bases & Hydroxydes
  {
    reference: 'WF-BS-301',
    name: { fr: 'Soude caustique', en: 'Caustic soda' },
    applications: { fr: 'Savons, traitement des eaux, industrie papetière', en: 'Soaps, water treatment, paper industry' },
    specifications: 'Pureté > 99 %',
    category: 'bases'
  },
  {
    reference: 'WF-BS-302',
    name: { fr: 'Hydroxyde de potassium', en: 'Potassium hydroxide' },
    applications: { fr: 'Engrais, détergents, pharmaceutiques', en: 'Fertilizers, detergents, pharmaceuticals' },
    specifications: '45 – 85 %',
    category: 'bases'
  },
  
  // Sels & Composés Minéraux
  {
    reference: 'WF-SL-401',
    name: { fr: 'Bicarbonate de sodium', en: 'Sodium bicarbonate' },
    applications: { fr: 'Alimentaire, pharmaceutique, extincteurs', en: 'Food, pharmaceutical, fire extinguishers' },
    specifications: 'Qualité alimentaire/technique',
    category: 'salts'
  },
  {
    reference: 'WF-SL-402',
    name: { fr: 'Carbonate de sodium', en: 'Sodium carbonate' },
    applications: { fr: 'Verrerie, détergents, traitement des eaux', en: 'Glassware, detergents, water treatment' },
    specifications: 'Pureté > 99 %',
    category: 'salts'
  },
  {
    reference: 'WF-SL-403',
    name: { fr: 'Sulfate d\'aluminium', en: 'Aluminum sulfate' },
    applications: { fr: 'Traitement des eaux, papier, textile', en: 'Water treatment, paper, textile' },
    specifications: 'Qualité technique',
    category: 'salts'
  },
  {
    reference: 'WF-SL-404',
    name: { fr: 'Permanganate de potassium', en: 'Potassium permanganate' },
    applications: { fr: 'Traitement des eaux, désinfection', en: 'Water treatment, disinfection' },
    specifications: 'Pureté > 99 %',
    category: 'salts'
  },
  {
    reference: 'WF-SL-405',
    name: { fr: 'Phosphate de zinc', en: 'Zinc phosphate' },
    applications: { fr: 'Anticorrosion, peintures, ciments dentaires', en: 'Anti-corrosion, paints, dental cements' },
    specifications: 'Qualité technique',
    category: 'salts'
  },
  {
    reference: 'WF-SL-406',
    name: { fr: 'Iodure de potassium', en: 'Potassium iodide' },
    applications: { fr: 'Photographie, nutrition, pharmaceutique', en: 'Photography, nutrition, pharmaceutical' },
    specifications: 'USP / technique',
    category: 'salts'
  },
  
  // Résines & Adsorbants
  {
    reference: 'WF-RS-501',
    name: { fr: 'Charbon actif', en: 'Activated carbon' },
    applications: { fr: 'Filtration eau/air, purification, or', en: 'Water/air filtration, purification, gold' },
    specifications: 'Granulométrie variée',
    category: 'resins'
  },
  {
    reference: 'WF-RS-502',
    name: { fr: 'Résine échangeuse d\'ions', en: 'Ion exchange resin' },
    applications: { fr: 'Adoucissement, déminéralisation', en: 'Softening, demineralization' },
    specifications: 'Anionique / cationique',
    category: 'resins'
  },
  {
    reference: 'WF-RS-503',
    name: { fr: 'Bentonite', en: 'Bentonite' },
    applications: { fr: 'Forage, fonderies, clarification vins', en: 'Drilling, foundries, wine clarification' },
    specifications: 'Technique / alimentaire',
    category: 'resins'
  },
  {
    reference: 'WF-RS-504',
    name: { fr: 'Terre décolorante', en: 'Bleaching earth' },
    applications: { fr: 'Raffinage huiles, filtration', en: 'Oil refining, filtration' },
    specifications: 'Blancheur > 85 %',
    category: 'resins'
  },
  
  // Solvants & Additifs
  {
    reference: 'WF-SV-601',
    name: { fr: 'Toluène', en: 'Toluene' },
    applications: { fr: 'Solvant industriel, peintures', en: 'Industrial solvent, paints' },
    specifications: 'Pureté > 99,5 %',
    category: 'solvents'
  },
  {
    reference: 'WF-SV-602',
    name: { fr: 'Acétone', en: 'Acetone' },
    applications: { fr: 'Solvant universel, nettoyage industriel', en: 'Universal solvent, industrial cleaning' },
    specifications: 'Pureté > 99,5 %',
    category: 'solvents'
  },
  {
    reference: 'WF-SV-603',
    name: { fr: 'Acétate d\'éthyle', en: 'Ethyl acetate' },
    applications: { fr: 'Peintures, encres, extraction', en: 'Paints, inks, extraction' },
    specifications: 'Qualité technique',
    category: 'solvents'
  },
  {
    reference: 'WF-SV-604',
    name: { fr: 'Éthylène glycol', en: 'Ethylene glycol' },
    applications: { fr: 'Antigel, hydraulique, résines', en: 'Antifreeze, hydraulic, resins' },
    specifications: 'Pureté > 99 %',
    category: 'solvents'
  },
  
  // Produits Spécialisés
  {
    reference: 'WF-SP-701',
    name: { fr: 'Ammoniaque', en: 'Ammonia' },
    applications: { fr: 'Engrais, nettoyage industriel', en: 'Fertilizers, industrial cleaning' },
    specifications: '25 – 30 %',
    category: 'specialized'
  },
  {
    reference: 'WF-SP-702',
    name: { fr: 'Hypochlorite de sodium', en: 'Sodium hypochlorite' },
    applications: { fr: 'Désinfection, blanchiment', en: 'Disinfection, bleaching' },
    specifications: '12 – 15 %',
    category: 'specialized'
  },
  {
    reference: 'WF-SP-703',
    name: { fr: 'Tétraméthylthiurame', en: 'Tetramethylthiuram' },
    applications: { fr: 'Additif caoutchouc, fongicide', en: 'Rubber additive, fungicide' },
    specifications: 'Qualité technique',
    category: 'specialized'
  },
  {
    reference: 'WF-SP-704',
    name: { fr: 'Chlorure d\'ammonium', en: 'Ammonium chloride' },
    applications: { fr: 'Accumulateurs, textile, alimentation animale', en: 'Batteries, textile, animal feed' },
    specifications: 'Pureté > 99 %',
    category: 'specialized'
  },
  {
    reference: 'WF-SP-705',
    name: { fr: 'Ammonium quaternaire', en: 'Quaternary ammonium' },
    applications: { fr: 'Désinfectants, cosmétiques', en: 'Disinfectants, cosmetics' },
    specifications: 'Qualité technique',
    category: 'specialized'
  },
  
  // Systèmes de Traitement de l'Eau
  {
    reference: 'WF-TE-801',
    name: { fr: 'Sable Birm', en: 'Birm sand' },
    applications: { fr: 'Filtration fer/manganèse', en: 'Iron/manganese filtration' },
    specifications: 'Granulométrie calibrée',
    category: 'water_treatment'
  },
  {
    reference: 'WF-TE-802',
    name: { fr: 'Sel de régénération', en: 'Regeneration salt' },
    applications: { fr: 'Adoucisseurs d\'eau', en: 'Water softeners' },
    specifications: 'Qualité technique supérieure',
    category: 'water_treatment'
  },
  {
    reference: 'WF-TE-803',
    name: { fr: 'Détartrants', en: 'Descalers' },
    applications: { fr: 'Chaudières, échangeurs', en: 'Boilers, exchangers' },
    specifications: 'Formulation concentrée',
    category: 'water_treatment'
  },
  {
    reference: 'WF-TE-804',
    name: { fr: 'Solution anti-mousse', en: 'Anti-foam solution' },
    applications: { fr: 'Eaux usées, industrie', en: 'Wastewater, industry' },
    specifications: 'Action rapide et durable',
    category: 'water_treatment'
  },
  {
    reference: 'WF-TE-805',
    name: { fr: 'Solution anti-tartre', en: 'Anti-scale solution' },
    applications: { fr: 'Protection circuits', en: 'Circuit protection' },
    specifications: 'Inhibiteur de tartre',
    category: 'water_treatment'
  },
  {
    reference: 'WF-TE-806',
    name: { fr: 'Ammonium quaternaire', en: 'Quaternary ammonium' },
    applications: { fr: 'Désinfection eaux industrielles', en: 'Industrial water disinfection' },
    specifications: 'Large spectre',
    category: 'water_treatment'
  }
];

export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter(product => product.category === categoryId);
};

export const getCategoryById = (categoryId: string): Category | undefined => {
  return categories.find(cat => cat.id === categoryId);
};

export const searchProducts = (query: string, lang: 'fr' | 'en'): Product[] => {
  const lowerQuery = query.toLowerCase();
  return products.filter(product => 
    product.reference.toLowerCase().includes(lowerQuery) ||
    product.name[lang].toLowerCase().includes(lowerQuery) ||
    product.applications[lang].toLowerCase().includes(lowerQuery)
  );
};

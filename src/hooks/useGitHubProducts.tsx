import { useState, useEffect } from 'react';
import { getProductsRaw } from '@/lib/github';

export interface GitHubProduct {
  reference: string;
  produit: string;
  applications: string[];
  specifications: string;
  qty: number;
  prix_unit: number;
  img?: string;
  pdf?: string;
}

export interface GitHubProductCategory {
  categorie: string;
  img?: string;
  datas: GitHubProduct[];
}

export interface FormattedProduct {
  reference: string;
  name: { fr: string; en: string };
  applications: { fr: string; en: string };
  specifications: string;
  category: string;
  img?: string;
  pdf?: string;
}

export interface FormattedCategory {
  id: string;
  name: { fr: string; en: string };
  icon: string;
  description: { fr: string; en: string };
  img?: string;
}

// Map category names to IDs and icons
const categoryMapping: Record<string, { id: string; icon: string; descFr: string; descEn: string }> = {
  'Eau et environnenemt': {
    id: 'treated_water',
    icon: '🧪',
    descFr: 'Eaux purifiées pour applications industrielles et laboratoires',
    descEn: 'Purified water for industrial applications and laboratories'
  },
  'Acides minéraux': {
    id: 'mineral_acids',
    icon: '⚗️',
    descFr: 'Acides inorganiques pour diverses applications industrielles',
    descEn: 'Inorganic acids for various industrial applications'
  },
  'Acides organiques': {
    id: 'organic_acids',
    icon: '🧬',
    descFr: 'Acides organiques pour l\'alimentation et la pharmaceutique',
    descEn: 'Organic acids for food and pharmaceutical industries'
  },
  'Bases & Hydroxydes': {
    id: 'bases',
    icon: '🧱',
    descFr: 'Solutions alcalines pour le traitement et la production',
    descEn: 'Alkaline solutions for treatment and production'
  },
  'Sels & composés minéraux': {
    id: 'salts',
    icon: '🧂',
    descFr: 'Composés minéraux pour diverses industries',
    descEn: 'Mineral compounds for various industries'
  },
  'Résines & Adsorbants': {
    id: 'resins',
    icon: '🧽',
    descFr: 'Matériaux filtrants et adsorbants',
    descEn: 'Filtering and adsorbent materials'
  }
};

const normalizeCategoryKey = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')                 // enlève accents
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

const normalizedCategoryMapping = Object.fromEntries(
  Object.entries(categoryMapping).map(([key, value]) => [
    normalizeCategoryKey(key),
    value
  ])
);
export const useGitHubProducts = () => {
  const [rawCategories, setRawCategories] = useState<GitHubProductCategory[]>([]);
  const [products, setProducts] = useState<FormattedProduct[]>([]);
  const [categories, setCategories] = useState<FormattedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data: GitHubProductCategory[] = await getProductsRaw();
        setRawCategories(data);

        // ---- FORMAT CATEGORIES ----
        const formattedCategories: FormattedCategory[] = data.map(cat => {
          const key = normalizeCategoryKey(cat.categorie);
          const mapping = normalizedCategoryMapping[key];

          const id = mapping?.id || key;

          if (!mapping) {
            console.warn(`⚠️ Catégorie non mappée : "${cat.categorie}" → "${id}"`);
          }

          return {
            id,
            name: { fr: cat.categorie, en: cat.categorie },
            icon: mapping?.icon || '📦',
            description: {
              fr: mapping?.descFr || cat.categorie,
              en: mapping?.descEn || cat.categorie
            },
            img: cat.img
          };
        });

        setCategories(formattedCategories);

        // ---- FORMAT PRODUCTS ----
        const formattedProducts: FormattedProduct[] = data.flatMap(cat => {
          const key = normalizeCategoryKey(cat.categorie);
          const categoryId = normalizedCategoryMapping[key]?.id || key;

          return cat.datas.map(p => ({
            reference: p.reference,
            name: { fr: p.produit, en: p.produit },
            applications: {
              fr: p.applications.join(', '),
              en: p.applications.join(', ')
            },
            specifications: p.specifications,
            category: categoryId,
            img: p.img,
            pdf: p.pdf
          }));
        });

        setProducts(formattedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching GitHub products:', err);
        setError('Erreur lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getProductsByCategory = (categoryId: string) =>
    products.filter(p => p.category === categoryId);

  const getCategoryById = (categoryId: string) =>
    categories.find(c => c.id === categoryId);

  const searchProducts = (query: string, lang: 'fr' | 'en') => {
    const q = query.toLowerCase();
    return products.filter(p =>
      p.reference.toLowerCase().includes(q) ||
      p.name[lang].toLowerCase().includes(q) ||
      p.applications[lang].toLowerCase().includes(q)
    );
  };

  return {
    rawCategories,
    products,
    categories,
    loading,
    error,
    getProductsByCategory,
    getCategoryById,
    searchProducts
  };
};


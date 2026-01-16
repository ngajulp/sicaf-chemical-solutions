import { useState, useEffect } from 'react';
import { getProductsRaw } from '@/lib/github';

export interface GitHubProduct {
  reference: string;
  produit: string;
  applications: string[];
  specifications: string;
  qty: number;
  prix_unit: number;
}

export interface GitHubProductCategory {
  categorie: string;
  datas: GitHubProduct[];
}

export interface FormattedProduct {
  reference: string;
  name: { fr: string; en: string };
  applications: { fr: string; en: string };
  specifications: string;
  category: string;
}

export interface FormattedCategory {
  id: string;
  name: { fr: string; en: string };
  icon: string;
  description: { fr: string; en: string };
}

// Map category names to IDs and icons
const categoryMapping: Record<string, { id: string; icon: string; descFr: string; descEn: string }> = {
  'Eaux traitées': { id: 'treated_water', icon: '🧪', descFr: 'Eaux purifiées pour applications industrielles et laboratoires', descEn: 'Purified water for industrial applications and laboratories' },
  'Acides minéraux': { id: 'mineral_acids', icon: '⚗️', descFr: 'Acides inorganiques pour diverses applications industrielles', descEn: 'Inorganic acids for various industrial applications' },
  'Acides organiques': { id: 'organic_acids', icon: '🧬', descFr: 'Acides organiques pour l\'alimentation et la pharmaceutique', descEn: 'Organic acids for food and pharmaceutical industries' },
  'Bases & Hydroxydes': { id: 'bases', icon: '🧱', descFr: 'Solutions alcalines pour le traitement et la production', descEn: 'Alkaline solutions for treatment and production' },
  'Sels & Composés Minéraux': { id: 'salts', icon: '🧂', descFr: 'Composés minéraux pour diverses industries', descEn: 'Mineral compounds for various industries' },
  'Résines & Adsorbants': { id: 'resins', icon: '🧽', descFr: 'Matériaux filtrants et adsorbants', descEn: 'Filtering and adsorbent materials' },
  'Solvants & Additifs': { id: 'solvents', icon: '🧴', descFr: 'Solvants industriels et additifs chimiques', descEn: 'Industrial solvents and chemical additives' },
  'Produits Spécialisés': { id: 'specialized', icon: '🔬', descFr: 'Produits chimiques pour applications spécifiques', descEn: 'Chemical products for specific applications' },
  'Systèmes de Traitement de l\'Eau': { id: 'water_treatment', icon: '🚰', descFr: 'Équipements et produits pour le traitement de l\'eau', descEn: 'Equipment and products for water treatment' },
};

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
        
        // Format categories
        const formattedCategories: FormattedCategory[] = data.map(cat => {
          const mapping = categoryMapping[cat.categorie] || { 
            id: cat.categorie.toLowerCase().replace(/[^a-z0-9]/g, '_'), 
            icon: '📦',
            descFr: cat.categorie,
            descEn: cat.categorie
          };
          return {
            id: mapping.id,
            name: { fr: cat.categorie, en: cat.categorie },
            icon: mapping.icon,
            description: { fr: mapping.descFr, en: mapping.descEn }
          };
        });
        setCategories(formattedCategories);
        
        // Format products
        const formattedProducts: FormattedProduct[] = data.flatMap(cat => {
          const mapping = categoryMapping[cat.categorie] || { id: cat.categorie.toLowerCase().replace(/[^a-z0-9]/g, '_') };
          return cat.datas.map(p => ({
            reference: p.reference,
            name: { fr: p.produit, en: p.produit },
            applications: { 
              fr: p.applications.join(', '),
              en: p.applications.join(', ')
            },
            specifications: p.specifications,
            category: mapping.id
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

  const getProductsByCategory = (categoryId: string): FormattedProduct[] => {
    return products.filter(product => product.category === categoryId);
  };

  const getCategoryById = (categoryId: string): FormattedCategory | undefined => {
    return categories.find(cat => cat.id === categoryId);
  };

  const searchProducts = (query: string, lang: 'fr' | 'en'): FormattedProduct[] => {
    const lowerQuery = query.toLowerCase();
    return products.filter(product => 
      product.reference.toLowerCase().includes(lowerQuery) ||
      product.name[lang].toLowerCase().includes(lowerQuery) ||
      product.applications[lang].toLowerCase().includes(lowerQuery)
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

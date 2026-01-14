import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, FileText, Users, TrendingUp, ArrowRight } from 'lucide-react';

interface ProductCategory {
  categorie: string;
  datas: Array<{
    reference: string;
    produit: string;
  }>;
}

const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    lastUpdate: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, historyRes] = await Promise.all([
          fetch(`${GITHUB_BASE_URL}/products.json`),
          fetch(`${GITHUB_BASE_URL}/history.json`)
        ]);

        if (productsRes.ok) {
          const products: ProductCategory[] = await productsRes.json();
          const totalProducts = products.reduce((acc, cat) => acc + cat.datas.length, 0);
          setStats(prev => ({
            ...prev,
            totalProducts,
            totalCategories: products.length
          }));
        }

        if (historyRes.ok) {
          const history = await historyRes.json();
          setStats(prev => ({
            ...prev,
            lastUpdate: history.date || 'N/A'
          }));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const quickActions = [
    {
      title: 'Voir les produits',
      description: 'Gérer le catalogue de produits',
      icon: Package,
      path: '/admin/products',
      color: 'bg-blue-500'
    },
    {
      title: 'Créer un devis',
      description: 'Générer un proforma ou devis',
      icon: FileText,
      path: '/admin/proforma',
      color: 'bg-green-500'
    },
    {
      title: 'Utilisateurs',
      description: 'Gérer les comptes utilisateurs',
      icon: Users,
      path: '/admin/users',
      color: 'bg-purple-500'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1">Bienvenue dans l'administration SICAF</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Produits
              </CardTitle>
              <Package className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {loading ? '...' : stats.totalProducts}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                dans le catalogue
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Catégories
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {loading ? '...' : stats.totalCategories}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                catégories de produits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Dernière mise à jour
              </CardTitle>
              <FileText className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {loading ? '...' : stats.lastUpdate}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                des données GitHub
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Statut
              </CardTitle>
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-green-600">
                En ligne
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Système opérationnel
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-heading text-xl font-semibold mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <Link key={action.path} to={action.path}>
                <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg ${action.color} text-white flex items-center justify-center mb-4`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-heading font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {action.description}
                    </p>
                    <div className="flex items-center text-primary text-sm font-medium">
                      Accéder
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Info Notice */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold mb-1">Mode lecture seule</h3>
                <p className="text-sm text-muted-foreground">
                  Les données sont chargées depuis GitHub. Les modifications (ajout, suppression) 
                  nécessitent une mise à jour directe des fichiers JSON sur le dépôt GitHub.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

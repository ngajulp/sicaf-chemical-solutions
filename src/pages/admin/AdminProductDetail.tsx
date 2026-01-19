import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, FileText, Download, Edit, Loader2 } from 'lucide-react';
import { getProducts } from '@/lib/github';

interface ProductData {
  reference: string;
  produit: string;
  applications: string[];
  specifications: string;
  qty: number;
  prix_unit: number;
  img?: string;
  pdf?: string;
}

interface ProductCategory {
  categorie: string;
  img?: string;
  datas: ProductData[];
}

const AdminProductDetail = () => {
  const { categoryName, reference } = useParams<{ categoryName: string; reference: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const products: ProductCategory[] = await getProducts();
        const foundCategory = products.find(c => c.categorie === decodeURIComponent(categoryName || ''));
        if (foundCategory) {
          setCategory(foundCategory);
          const foundProduct = foundCategory.datas.find(p => p.reference === decodeURIComponent(reference || ''));
          setProduct(foundProduct || null);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [categoryName, reference]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!product || !category) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
          <Button onClick={() => navigate('/admin/products')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux produits
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/admin/products')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{product.produit}</h1>
              <p className="text-muted-foreground font-mono">{product.reference}</p>
            </div>
          </div>
          <Button onClick={() => navigate('/admin/products')}>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Product Image */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {product.img ? (
                <img 
                  src={product.img} 
                  alt={product.produit}
                  className="w-full h-[400px] object-cover"
                />
              ) : (
                <div className="w-full h-[400px] bg-muted flex items-center justify-center">
                  <Package className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Info */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Référence</p>
                    <p className="font-mono font-medium">{product.reference}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Catégorie</p>
                    <Badge variant="secondary">{category.categorie}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Quantité</p>
                    <p className="font-medium">{product.qty}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Prix unitaire</p>
                    <p className="font-medium text-primary">{product.prix_unit.toLocaleString()} FCFA</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Spécifications</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="text-base px-4 py-2">
                  {product.specifications}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {product.applications.map((app, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-muted-foreground">{app}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* PDF Download */}
            {product.pdf && (
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-red-500" />
                      <div>
                        <p className="font-medium">Fiche technique</p>
                        <p className="text-sm text-muted-foreground">Document PDF disponible</p>
                      </div>
                    </div>
                    <a href={product.pdf} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Télécharger
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProductDetail;

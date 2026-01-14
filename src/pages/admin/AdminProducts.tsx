import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Package, Loader2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ProductData {
  reference: string;
  produit: string;
  applications: string[];
  specifications: string;
  qty: number;
  prix_unit: number;
}

interface ProductCategory {
  categorie: string;
  datas: ProductData[];
}

const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data';

const AdminProducts = () => {
  const [products, setProducts] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${GITHUB_BASE_URL}/products.json`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.map(category => ({
    ...category,
    datas: category.datas.filter(product =>
      product.produit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.applications.some(app => app.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(category => category.datas.length > 0);

  const totalProducts = products.reduce((acc, cat) => acc + cat.datas.length, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Produits</h1>
            <p className="text-muted-foreground mt-1">
              {totalProducts} produits dans {products.length} catégories
            </p>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, référence ou application..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Accordion type="multiple" className="space-y-4">
            {filteredProducts.map((category, index) => (
              <AccordionItem 
                key={index} 
                value={`category-${index}`}
                className="border rounded-lg bg-card shadow-sm"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-heading font-semibold">{category.categorie}</h3>
                      <p className="text-sm text-muted-foreground">
                        {category.datas.length} produit{category.datas.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">Référence</TableHead>
                          <TableHead className="font-semibold">Produit</TableHead>
                          <TableHead className="font-semibold">Applications</TableHead>
                          <TableHead className="font-semibold">Spécifications</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {category.datas.map((product, pIndex) => (
                          <TableRow key={pIndex}>
                            <TableCell>
                              <Badge variant="outline" className="font-mono">
                                {product.reference}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{product.produit}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {product.applications.slice(0, 2).map((app, aIndex) => (
                                  <Badge key={aIndex} variant="secondary" className="text-xs">
                                    {app}
                                  </Badge>
                                ))}
                                {product.applications.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{product.applications.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {product.specifications}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        {!loading && filteredProducts.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-heading font-semibold text-lg mb-2">Aucun produit trouvé</h3>
              <p className="text-muted-foreground">
                Aucun produit ne correspond à votre recherche "{searchQuery}"
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;

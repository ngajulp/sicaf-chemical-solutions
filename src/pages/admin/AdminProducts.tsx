import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Package, Loader2, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { getProducts, getProductsSha, updateProducts } from '@/lib/github';

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

const AdminProducts = () => {
  const [products, setProducts] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sha, setSha] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  
  // Form states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number>(-1);
  const [newCategory, setNewCategory] = useState('');
  const [formData, setFormData] = useState<ProductData>({
    reference: '',
    produit: '',
    applications: [],
    specifications: '',
    qty: 1,
    prix_unit: 0
  });
  const [applicationsText, setApplicationsText] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const content = await getProducts();
      setProducts(content || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  // Get SHA only when needed for write operations
  const getShaForWrite = async (): Promise<string> => {
    if (sha) return sha;
    const fileSha = await getProductsSha();
    setSha(fileSha);
    return fileSha;
  };

  const resetForm = () => {
    setFormData({
      reference: '',
      produit: '',
      applications: [],
      specifications: '',
      qty: 1,
      prix_unit: 0
    });
    setApplicationsText('');
    setSelectedCategory('');
    setEditingProduct(null);
    setEditingCategoryIndex(-1);
  };

  const handleAddProduct = async () => {
    if (!selectedCategory || !formData.reference || !formData.produit) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSaving(true);
    try {
      const currentSha = await getShaForWrite();
      const newProduct: ProductData = {
        ...formData,
        applications: applicationsText.split('\n').filter(a => a.trim())
      };

      const updatedProducts = products.map(cat => {
        if (cat.categorie === selectedCategory) {
          return { ...cat, datas: [...cat.datas, newProduct] };
        }
        return cat;
      });

      const result = await updateProducts(updatedProducts, currentSha, `Ajout produit: ${formData.produit}`);
      setSha(result.newSha);
      toast.success('Produit ajouté avec succès');
      setShowAddModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Erreur lors de l\'ajout du produit');
    } finally {
      setSaving(false);
    }
  };

  const handleEditProduct = async () => {
    if (!formData.reference || !formData.produit) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSaving(true);
    try {
      const currentSha = await getShaForWrite();
      const updatedProduct: ProductData = {
        ...formData,
        applications: applicationsText.split('\n').filter(a => a.trim())
      };

      const updatedProducts = products.map((cat, catIndex) => {
        if (catIndex === editingCategoryIndex) {
          return {
            ...cat,
            datas: cat.datas.map(p =>
              p.reference === editingProduct?.reference ? updatedProduct : p
            )
          };
        }
        return cat;
      });

      const result = await updateProducts(updatedProducts, currentSha, `Modification produit: ${formData.produit}`);
      setSha(result.newSha);
      toast.success('Produit modifié avec succès');
      setShowEditModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Erreur lors de la modification du produit');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!editingProduct) return;

    setSaving(true);
    try {
      const currentSha = await getShaForWrite();
      const updatedProducts = products.map((cat, catIndex) => {
        if (catIndex === editingCategoryIndex) {
          return {
            ...cat,
            datas: cat.datas.filter(p => p.reference !== editingProduct.reference)
          };
        }
        return cat;
      });

      const result = await updateProducts(updatedProducts, currentSha, `Suppression produit: ${editingProduct.produit}`);
      setSha(result.newSha);
      toast.success('Produit supprimé avec succès');
      setShowDeleteModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Erreur lors de la suppression du produit');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error('Veuillez saisir un nom de catégorie');
      return;
    }

    setSaving(true);
    try {
      const currentSha = await getShaForWrite();
      const updatedProducts = [...products, { categorie: newCategory, datas: [] }];
      const result = await updateProducts(updatedProducts, currentSha, `Ajout catégorie: ${newCategory}`);
      setSha(result.newSha);
      toast.success('Catégorie ajoutée avec succès');
      setShowAddCategoryModal(false);
      setNewCategory('');
      fetchProducts();
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Erreur lors de l\'ajout de la catégorie');
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (product: ProductData, categoryIndex: number) => {
    setEditingProduct(product);
    setEditingCategoryIndex(categoryIndex);
    setFormData(product);
    setApplicationsText(product.applications.join('\n'));
    setShowEditModal(true);
  };

  const openDeleteModal = (product: ProductData, categoryIndex: number) => {
    setEditingProduct(product);
    setEditingCategoryIndex(categoryIndex);
    setShowDeleteModal(true);
  };

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
          <div className="flex gap-2">
            <Button onClick={() => setShowAddCategoryModal(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Catégorie
            </Button>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Produit
            </Button>
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
                          <TableHead className="font-semibold text-right">Qté</TableHead>
                          <TableHead className="font-semibold text-right">Prix Unit.</TableHead>
                          <TableHead className="font-semibold text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {category.datas.map((product, pIndex) => (
                          <TableRow key={pIndex}>
                            <TableCell className="max-w-[120px]">
                              <Badge
                                variant="outline"
                                className="font-mono whitespace-nowrap truncate block"
                                title={product.reference}
                              >
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
                            <TableCell className="text-right font-medium">
                              {product.qty}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {product.prix_unit.toLocaleString('fr-FR')} FCFA
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={() => openEditModal(product, products.findIndex(p => p.categorie === category.categorie))}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => openDeleteModal(product, products.findIndex(p => p.categorie === category.categorie))}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
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

      {/* Add Product Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter un produit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Catégorie *</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((cat, i) => (
                    <SelectItem key={i} value={cat.categorie}>{cat.categorie}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Référence *</Label>
                <Input
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  placeholder="Ex: WF-EAU-001"
                />
              </div>
              <div>
                <Label>Nom du produit *</Label>
                <Input
                  value={formData.produit}
                  onChange={(e) => setFormData({ ...formData, produit: e.target.value })}
                  placeholder="Nom du produit"
                />
              </div>
            </div>
            <div>
              <Label>Applications (une par ligne)</Label>
              <Textarea
                value={applicationsText}
                onChange={(e) => setApplicationsText(e.target.value)}
                placeholder="Application 1&#10;Application 2"
                rows={3}
              />
            </div>
            <div>
              <Label>Spécifications</Label>
              <Input
                value={formData.specifications}
                onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                placeholder="Spécifications techniques"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Quantité</Label>
                <Input
                  type="number"
                  value={formData.qty}
                  onChange={(e) => setFormData({ ...formData, qty: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div>
                <Label>Prix unitaire (FCFA)</Label>
                <Input
                  type="number"
                  value={formData.prix_unit}
                  onChange={(e) => setFormData({ ...formData, prix_unit: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddModal(false); resetForm(); }}>
              Annuler
            </Button>
            <Button onClick={handleAddProduct} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Référence *</Label>
                <Input
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                />
              </div>
              <div>
                <Label>Nom du produit *</Label>
                <Input
                  value={formData.produit}
                  onChange={(e) => setFormData({ ...formData, produit: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>Applications (une par ligne)</Label>
              <Textarea
                value={applicationsText}
                onChange={(e) => setApplicationsText(e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label>Spécifications</Label>
              <Input
                value={formData.specifications}
                onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Quantité</Label>
                <Input
                  type="number"
                  value={formData.qty}
                  onChange={(e) => setFormData({ ...formData, qty: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div>
                <Label>Prix unitaire (FCFA)</Label>
                <Input
                  type="number"
                  value={formData.prix_unit}
                  onChange={(e) => setFormData({ ...formData, prix_unit: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowEditModal(false); resetForm(); }}>
              Annuler
            </Button>
            <Button onClick={handleEditProduct} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Êtes-vous sûr de vouloir supprimer le produit <strong>{editingProduct?.produit}</strong> ?
            Cette action est irréversible.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Category Modal */}
      <Dialog open={showAddCategoryModal} onOpenChange={setShowAddCategoryModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une catégorie</DialogTitle>
          </DialogHeader>
          <div>
            <Label>Nom de la catégorie</Label>
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nom de la catégorie"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCategoryModal(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddCategory} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProducts;

import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Package, Loader2, Plus, Edit, Trash2, Save, X, Upload, Image, FileText, Download, Eye, ExternalLink, FolderX } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { getProducts, getProductsSha, updateProducts, uploadImageToGitHub, uploadPdfToGitHub } from '@/lib/github';

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

const AdminProducts = () => {
  const navigate = useNavigate();
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
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [deletingCategoryIndex, setDeletingCategoryIndex] = useState<number>(-1);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  
  // Form states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number>(-1);
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState<File | null>(null);
  const [formData, setFormData] = useState<ProductData>({
    reference: '',
    produit: '',
    applications: [],
    specifications: '',
    qty: 1,
    prix_unit: 0,
    img: '',
    pdf: ''
  });
  const [applicationsText, setApplicationsText] = useState('');
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productPdf, setProductPdf] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  // Refs for file inputs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const categoryImageInputRef = useRef<HTMLInputElement>(null);

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
      prix_unit: 0,
      img: '',
      pdf: ''
    });
    setApplicationsText('');
    setSelectedCategory('');
    setEditingProduct(null);
    setEditingCategoryIndex(-1);
    setProductImage(null);
    setProductPdf(null);
    setNewCategoryImage(null);
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    setUploadingImage(true);
    try {
      const timestamp = Date.now();
      const fileName = `product_${timestamp}_${file.name}`;
      const result = await uploadImageToGitHub(file, fileName);
      toast.success('Image uploadée avec succès');
      return result.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erreur lors de l\'upload de l\'image');
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePdfUpload = async (file: File): Promise<string> => {
    setUploadingPdf(true);
    try {
      const timestamp = Date.now();
      const fileName = `product_${timestamp}_${file.name}`;
      const result = await uploadPdfToGitHub(file, fileName);
      toast.success('PDF uploadé avec succès');
      return result.url;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast.error('Erreur lors de l\'upload du PDF');
      throw error;
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleAddProduct = async () => {
    if (!selectedCategory || !formData.reference || !formData.produit) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSaving(true);
    try {
      const currentSha = await getShaForWrite();
      
      let imgUrl = formData.img;
      let pdfUrl = formData.pdf;
      
      // Upload image if selected
      if (productImage) {
        imgUrl = await handleImageUpload(productImage);
      }
      
      // Upload PDF if selected
      if (productPdf) {
        pdfUrl = await handlePdfUpload(productPdf);
      }
      
      const newProduct: ProductData = {
        ...formData,
        applications: applicationsText.split('\n').filter(a => a.trim()),
        img: imgUrl,
        pdf: pdfUrl
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
      
      let imgUrl = formData.img;
      let pdfUrl = formData.pdf;
      
      // Upload new image if selected
      if (productImage) {
        imgUrl = await handleImageUpload(productImage);
      }
      
      // Upload new PDF if selected
      if (productPdf) {
        pdfUrl = await handlePdfUpload(productPdf);
      }
      
      const updatedProduct: ProductData = {
        ...formData,
        applications: applicationsText.split('\n').filter(a => a.trim()),
        img: imgUrl,
        pdf: pdfUrl
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
      
      let categoryImgUrl = '';
      if (newCategoryImage) {
        const timestamp = Date.now();
        const fileName = `category_${timestamp}_${newCategoryImage.name}`;
        const result = await uploadImageToGitHub(newCategoryImage, fileName);
        categoryImgUrl = result.url;
      }
      
      const updatedProducts = [...products, { categorie: newCategory, img: categoryImgUrl, datas: [] }];
      const result = await updateProducts(updatedProducts, currentSha, `Ajout catégorie: ${newCategory}`);
      setSha(result.newSha);
      toast.success('Catégorie ajoutée avec succès');
      setShowAddCategoryModal(false);
      setNewCategory('');
      setNewCategoryImage(null);
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

  const openImagePreview = (url: string) => {
    setPreviewImageUrl(url);
    setShowImagePreview(true);
  };

  const openDeleteCategoryModal = (categoryIndex: number) => {
    setDeletingCategoryIndex(categoryIndex);
    setShowDeleteCategoryModal(true);
  };

  const handleDeleteCategory = async () => {
    if (deletingCategoryIndex < 0) return;

    setSaving(true);
    try {
      const currentSha = await getShaForWrite();
      const categoryName = products[deletingCategoryIndex].categorie;
      const updatedProducts = products.filter((_, index) => index !== deletingCategoryIndex);

      const result = await updateProducts(updatedProducts, currentSha, `Suppression catégorie: ${categoryName}`);
      setSha(result.newSha);
      toast.success('Catégorie supprimée avec succès');
      setShowDeleteCategoryModal(false);
      setDeletingCategoryIndex(-1);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Erreur lors de la suppression de la catégorie');
    } finally {
      setSaving(false);
    }
  };

  const navigateToProductDetail = (categoryId: string, productRef: string) => {
    navigate(`/admin/products/${encodeURIComponent(categoryId)}/${encodeURIComponent(productRef)}`);
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

  // Product Form Component
  const ProductForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      {!isEdit && (
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
      )}
      
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

      {/* Image Upload */}
      <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
        <Label className="flex items-center gap-2">
          <Image className="h-4 w-4" />
          Image du produit
        </Label>
        <div className="flex items-center gap-3">
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setProductImage(e.target.files?.[0] || null)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => imageInputRef.current?.click()}
            disabled={uploadingImage}
          >
            {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
            {productImage ? 'Changer' : 'Sélectionner'}
          </Button>
          {productImage && (
            <span className="text-sm text-muted-foreground truncate max-w-[200px]">
              {productImage.name}
            </span>
          )}
          {formData.img && !productImage && (
            <div className="flex items-center gap-2">
              <img src={formData.img} alt="Aperçu" className="h-10 w-10 object-cover rounded" />
              <span className="text-xs text-green-600">Image existante</span>
            </div>
          )}
        </div>
      </div>

      {/* PDF Upload */}
      <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
        <Label className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Fiche technique (PDF)
        </Label>
        <div className="flex items-center gap-3">
          <input
            ref={pdfInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => setProductPdf(e.target.files?.[0] || null)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => pdfInputRef.current?.click()}
            disabled={uploadingPdf}
          >
            {uploadingPdf ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
            {productPdf ? 'Changer' : 'Sélectionner'}
          </Button>
          {productPdf && (
            <span className="text-sm text-muted-foreground truncate max-w-[200px]">
              {productPdf.name}
            </span>
          )}
          {formData.pdf && !productPdf && (
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-500" />
              <span className="text-xs text-green-600">PDF existant</span>
              <a href={formData.pdf} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline">
                Voir
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );

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
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-3">
                      {category.img ? (
                        <img 
                          src={category.img} 
                          alt={category.categorie}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <div className="text-left">
                        <h3 className="font-heading font-semibold">{category.categorie}</h3>
                        <p className="text-sm text-muted-foreground">
                          {category.datas.length} produit{category.datas.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteCategoryModal(products.findIndex(p => p.categorie === category.categorie));
                      }}
                    >
                      <FolderX className="h-4 w-4 mr-1" />
                      Supprimer
                    </Button>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold w-16">Image</TableHead>
                          <TableHead className="font-semibold">Référence</TableHead>
                          <TableHead className="font-semibold">Produit</TableHead>
                          <TableHead className="font-semibold">Applications</TableHead>
                          <TableHead className="font-semibold">Spécifications</TableHead>
                          <TableHead className="font-semibold text-right">Prix</TableHead>
                          <TableHead className="font-semibold text-center">Fichiers</TableHead>
                          <TableHead className="font-semibold text-center w-32">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {category.datas.map((product, pIndex) => (
                          <TableRow key={pIndex}>
                            <TableCell>
                              {product.img ? (
                                <img 
                                  src={product.img} 
                                  alt={product.produit}
                                  className="w-12 h-12 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => openImagePreview(product.img!)}
                                />
                              ) : (
                                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                                  <Image className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="max-w-[100px]">
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
                            <TableCell className="text-right font-semibold">
                              {product.prix_unit.toLocaleString('fr-FR')} FCFA
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                {product.img && (
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-blue-500"
                                    onClick={() => openImagePreview(product.img!)}
                                    title="Voir l'image"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                )}
                                {product.pdf && (
                                  <a
                                    href={product.pdf}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                  >
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" title="Télécharger PDF">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </a>
                                )}
                                {!product.img && !product.pdf && (
                                  <span className="text-muted-foreground text-xs">—</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-primary"
                                  onClick={() => navigateToProductDetail(category.categorie, product.reference)}
                                  title="Voir détails"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={() => openEditModal(product, products.findIndex(p => p.categorie === category.categorie))}
                                  title="Modifier"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => openDeleteModal(product, products.findIndex(p => p.categorie === category.categorie))}
                                  title="Supprimer"
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
          <ProductForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddModal(false); resetForm(); }}>
              Annuler
            </Button>
            <Button onClick={handleAddProduct} disabled={saving || uploadingImage || uploadingPdf}>
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
          <ProductForm isEdit />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowEditModal(false); resetForm(); }}>
              Annuler
            </Button>
            <Button onClick={handleEditProduct} disabled={saving || uploadingImage || uploadingPdf}>
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
          <div className="space-y-4">
            <div>
              <Label>Nom de la catégorie *</Label>
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nom de la catégorie"
              />
            </div>
            
            {/* Category Image Upload */}
            <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
              <Label className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Image de la catégorie
              </Label>
              <div className="flex items-center gap-3">
                <input
                  ref={categoryImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setNewCategoryImage(e.target.files?.[0] || null)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => categoryImageInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {newCategoryImage ? 'Changer' : 'Sélectionner'}
                </Button>
                {newCategoryImage && (
                  <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {newCategoryImage.name}
                  </span>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddCategoryModal(false); setNewCategory(''); setNewCategoryImage(null); }}>
              Annuler
            </Button>
            <Button onClick={handleAddCategory} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Modal */}
      <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Aperçu de l'image</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <img 
              src={previewImageUrl} 
              alt="Aperçu" 
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
          </div>
          <DialogFooter>
            <a href={previewImageUrl} download target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Confirmation Modal */}
      <Dialog open={showDeleteCategoryModal} onOpenChange={setShowDeleteCategoryModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <FolderX className="h-5 w-5" />
              Supprimer la catégorie
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Êtes-vous sûr de vouloir supprimer la catégorie{' '}
              <strong className="text-foreground">
                {deletingCategoryIndex >= 0 ? products[deletingCategoryIndex]?.categorie : ''}
              </strong> ?
            </p>
            {deletingCategoryIndex >= 0 && products[deletingCategoryIndex]?.datas.length > 0 && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive font-medium">
                  ⚠️ Attention : Cette catégorie contient{' '}
                  {products[deletingCategoryIndex]?.datas.length} produit(s) qui seront également supprimés.
                </p>
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              Cette action est irréversible.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowDeleteCategoryModal(false); setDeletingCategoryIndex(-1); }}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Supprimer la catégorie
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminProducts;
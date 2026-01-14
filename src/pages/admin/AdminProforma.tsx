import { useEffect, useState, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Search, Plus, Minus, Trash2, FileText, Printer, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ProductData {
  reference: string;
  produit: string;
  applications: string[];
  specifications: string;
  qty: number;
  prix_unit: number;
  categorie?: string;
}

interface ProductCategory {
  categorie: string;
  datas: ProductData[];
}

interface CompanyInfo {
  nomentreprise: string;
  boitepostate: string;
  siege: string;
  Telephone: string;
  email: string;
  siteweb: string;
}

interface SelectedProduct extends ProductData {
  quantity: number;
}

const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data';

const AdminProforma = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, infoRes] = await Promise.all([
          fetch(`${GITHUB_BASE_URL}/products.json`),
          fetch(`${GITHUB_BASE_URL}/infospersonnelles.json`)
        ]);

        if (productsRes.ok) {
          const data: ProductCategory[] = await productsRes.json();
          const allProducts = data.flatMap(cat => 
            cat.datas.map(p => ({ ...p, categorie: cat.categorie }))
          );
          setProducts(allProducts);
        }

        if (infoRes.ok) {
          const info = await infoRes.json();
          setCompanyInfo(info);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter(product =>
    product.produit.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addProduct = (product: ProductData) => {
    const existing = selectedProducts.find(p => p.reference === product.reference);
    if (existing) {
      setSelectedProducts(prev =>
        prev.map(p =>
          p.reference === product.reference
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      );
    } else {
      setSelectedProducts(prev => [...prev, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (reference: string, delta: number) => {
    setSelectedProducts(prev =>
      prev.map(p => {
        if (p.reference === reference) {
          const newQty = Math.max(1, p.quantity + delta);
          return { ...p, quantity: newQty };
        }
        return p;
      })
    );
  };

  const removeProduct = (reference: string) => {
    setSelectedProducts(prev => prev.filter(p => p.reference !== reference));
  };

  const totalAmount = selectedProducts.reduce(
    (acc, p) => acc + p.quantity * p.prix_unit,
    0
  );

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Proforma - SICAF</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .logo { width: 80px; height: 80px; }
            .company-info { text-align: right; }
            .company-name { font-size: 24px; font-weight: bold; color: #1e40af; }
            .title { font-size: 28px; font-weight: bold; text-align: center; margin: 20px 0; color: #1e40af; }
            .client-info { background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background: #1e40af; color: white; }
            tr:nth-child(even) { background: #f9fafb; }
            .total-row { font-weight: bold; font-size: 18px; background: #dbeafe !important; }
            .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 12px; }
            @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const proformaNumber = `PRO-${Date.now().toString().slice(-8)}`;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Générateur Proforma / Devis</h1>
          <p className="text-muted-foreground mt-1">
            Sélectionnez les produits et générez un document PDF
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Sélectionner les produits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {filteredProducts.slice(0, 20).map((product) => (
                    <div
                      key={product.reference}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.produit}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">{product.reference}</Badge>
                          <span>{product.prix_unit.toLocaleString('fr-FR')} FCFA</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addProduct(product)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Produits sélectionnés ({selectedProducts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Client Info */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="clientName">Nom du client</Label>
                  <Input
                    id="clientName"
                    placeholder="Nom de l'entreprise ou du client"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="clientAddress">Adresse</Label>
                  <Input
                    id="clientAddress"
                    placeholder="Adresse du client"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              {selectedProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Aucun produit sélectionné</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedProducts.map((product) => (
                    <div
                      key={product.reference}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.produit}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.prix_unit.toLocaleString('fr-FR')} FCFA × {product.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(product.reference, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{product.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(product.reference, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8"
                          onClick={() => removeProduct(product.reference)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between font-heading text-xl font-bold">
                <span>Total:</span>
                <span className="text-primary">{totalAmount.toLocaleString('fr-FR')} FCFA</span>
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  disabled={selectedProducts.length === 0}
                  onClick={() => setShowPreview(true)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Aperçu
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  disabled={selectedProducts.length === 0}
                  onClick={handlePrint}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Print Preview (Hidden) */}
        <div className="hidden">
          <div ref={printRef}>
            <div className="header">
              <img src={`${GITHUB_BASE_URL}/logo.png`} alt="SICAF Logo" className="logo" />
              <div className="company-info">
                <div className="company-name">{companyInfo?.nomentreprise}</div>
                <div>{companyInfo?.siege}</div>
                <div>BP: {companyInfo?.boitepostate}</div>
                <div>Tél: {companyInfo?.Telephone}</div>
                <div>{companyInfo?.email}</div>
              </div>
            </div>

            <div className="title">FACTURE PROFORMA</div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <strong>N° Proforma:</strong> {proformaNumber}
              </div>
              <div>
                <strong>Date:</strong> {currentDate}
              </div>
            </div>

            <div className="client-info">
              <strong>Client:</strong><br />
              {clientName || 'Non spécifié'}<br />
              {clientAddress || ''}
            </div>

            <table>
              <thead>
                <tr>
                  <th>Réf.</th>
                  <th>Désignation</th>
                  <th>Qté</th>
                  <th>Prix Unit.</th>
                  <th>Montant</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{product.reference}</td>
                    <td>{product.produit}</td>
                    <td style={{ textAlign: 'center' }}>{product.quantity}</td>
                    <td style={{ textAlign: 'right' }}>{product.prix_unit.toLocaleString('fr-FR')} FCFA</td>
                    <td style={{ textAlign: 'right' }}>{(product.quantity * product.prix_unit).toLocaleString('fr-FR')} FCFA</td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td colSpan={4} style={{ textAlign: 'right' }}>TOTAL</td>
                  <td style={{ textAlign: 'right' }}>{totalAmount.toLocaleString('fr-FR')} FCFA</td>
                </tr>
              </tbody>
            </table>

            <div className="footer">
              <p>{companyInfo?.nomentreprise} - {companyInfo?.siege}</p>
              <p>{companyInfo?.siteweb} | {companyInfo?.email}</p>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Aperçu du Proforma</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimer
                  </Button>
                  <Button variant="outline" onClick={() => setShowPreview(false)}>
                    Fermer
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-6 bg-white">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-8">
                    <img 
                      src={`${GITHUB_BASE_URL}/logo.png`} 
                      alt="SICAF Logo" 
                      className="w-20 h-20 object-contain"
                    />
                    <div className="text-right">
                      <h2 className="font-heading text-2xl font-bold text-primary">{companyInfo?.nomentreprise}</h2>
                      <p className="text-sm text-muted-foreground">{companyInfo?.siege}</p>
                      <p className="text-sm text-muted-foreground">BP: {companyInfo?.boitepostate}</p>
                      <p className="text-sm text-muted-foreground">Tél: {companyInfo?.Telephone}</p>
                      <p className="text-sm text-muted-foreground">{companyInfo?.email}</p>
                    </div>
                  </div>

                  <h1 className="text-3xl font-bold text-center text-primary mb-6">FACTURE PROFORMA</h1>

                  <div className="flex justify-between mb-6">
                    <div>
                      <strong>N° Proforma:</strong> {proformaNumber}
                    </div>
                    <div>
                      <strong>Date:</strong> {currentDate}
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg mb-6">
                    <strong>Client:</strong><br />
                    {clientName || 'Non spécifié'}<br />
                    {clientAddress || ''}
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow className="bg-primary text-primary-foreground">
                        <TableHead className="text-primary-foreground">Réf.</TableHead>
                        <TableHead className="text-primary-foreground">Désignation</TableHead>
                        <TableHead className="text-primary-foreground text-center">Qté</TableHead>
                        <TableHead className="text-primary-foreground text-right">Prix Unit.</TableHead>
                        <TableHead className="text-primary-foreground text-right">Montant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedProducts.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>{product.reference}</TableCell>
                          <TableCell>{product.produit}</TableCell>
                          <TableCell className="text-center">{product.quantity}</TableCell>
                          <TableCell className="text-right">{product.prix_unit.toLocaleString('fr-FR')} FCFA</TableCell>
                          <TableCell className="text-right font-medium">
                            {(product.quantity * product.prix_unit).toLocaleString('fr-FR')} FCFA
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-primary/10 font-bold">
                        <TableCell colSpan={4} className="text-right text-lg">TOTAL</TableCell>
                        <TableCell className="text-right text-lg text-primary">
                          {totalAmount.toLocaleString('fr-FR')} FCFA
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProforma;

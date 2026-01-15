import { useEffect, useState, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Search, Plus, Minus, Trash2, FileText, Printer, Loader2, Upload, Image } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

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
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientLogo, setClientLogo] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Le logo ne doit pas dépasser 2 Mo');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setClientLogo(e.target?.result as string);
        toast.success('Logo client ajouté');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeClientLogo = () => {
    setClientLogo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePrint = () => {
    if (!clientName.trim()) {
      toast.error('Veuillez saisir le nom du client');
      return;
    }

    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Proforma - ${clientName} - SICAF</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; margin: 0; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
            .logo { width: 80px; height: 80px; object-fit: contain; }
            .company-info { text-align: right; }
            .company-name { font-size: 24px; font-weight: bold; color: #1e40af; }
            .title { font-size: 28px; font-weight: bold; text-align: center; margin: 20px 0; color: #1e40af; }
            .info-section { display: flex; justify-content: space-between; margin-bottom: 20px; gap: 20px; }
            .client-info { background: #f3f4f6; padding: 15px; border-radius: 8px; flex: 1; }
            .client-info.with-logo { display: flex; align-items: flex-start; gap: 15px; }
            .client-logo { width: 60px; height: 60px; object-fit: contain; border-radius: 4px; }
            .doc-info { background: #dbeafe; padding: 15px; border-radius: 8px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background: #1e40af; color: white; }
            tr:nth-child(even) { background: #f9fafb; }
            .total-row { font-weight: bold; font-size: 18px; background: #dbeafe !important; }
            .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; }
            .signature-section { margin-top: 40px; display: flex; justify-content: space-between; }
            .signature-box { width: 45%; text-align: center; }
            .signature-line { border-top: 1px solid #333; margin-top: 60px; padding-top: 10px; }
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

          {/* Selected Products & Client Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Produits sélectionnés ({selectedProducts.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Client Info */}
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold flex items-center gap-2">
                  <span>Informations Client</span>
                  <Badge variant="secondary">Obligatoire</Badge>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Label htmlFor="clientName">Nom du client / Entreprise *</Label>
                    <Input
                      id="clientName"
                      placeholder="Nom de l'entreprise ou du client"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="clientAddress">Adresse</Label>
                    <Input
                      id="clientAddress"
                      placeholder="Adresse du client"
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientPhone">Téléphone</Label>
                    <Input
                      id="clientPhone"
                      placeholder="Téléphone"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientEmail">Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      placeholder="Email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                </div>
                
                {/* Logo Upload */}
                <div className="pt-2">
                  <Label>Logo du client (optionnel)</Label>
                  <div className="flex items-center gap-3 mt-2">
                    {clientLogo ? (
                      <div className="relative">
                        <img 
                          src={clientLogo} 
                          alt="Logo client" 
                          className="w-16 h-16 object-contain border rounded-lg"
                        />
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={removeClientLogo}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div 
                        className="w-16 h-16 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/50"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Image className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    {!clientLogo && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Importer logo
                      </Button>
                    )}
                  </div>
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
                  disabled={selectedProducts.length === 0 || !clientName.trim()}
                  onClick={() => setShowPreview(true)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Aperçu
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  disabled={selectedProducts.length === 0 || !clientName.trim()}
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

            <div className="info-section">
              <div className={`client-info ${clientLogo ? 'with-logo' : ''}`}>
                {clientLogo && (
                  <img src={clientLogo} alt="Logo client" className="client-logo" />
                )}
                <div>
                  <strong>Client:</strong><br />
                  {clientName}<br />
                  {clientAddress && <>{clientAddress}<br /></>}
                  {clientPhone && <>Tél: {clientPhone}<br /></>}
                  {clientEmail && <>{clientEmail}</>}
                </div>
              </div>
              <div className="doc-info">
                <strong>N° Proforma:</strong> {proformaNumber}<br />
                <strong>Date:</strong> {currentDate}
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Réf.</th>
                  <th>Désignation</th>
                  <th style={{ textAlign: 'center' }}>Qté</th>
                  <th style={{ textAlign: 'right' }}>Prix Unit.</th>
                  <th style={{ textAlign: 'right' }}>Montant</th>
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

            <div className="signature-section">
              <div className="signature-box">
                <div className="signature-line">Le Client</div>
              </div>
              <div className="signature-box">
                <div className="signature-line">{companyInfo?.nomentreprise}</div>
              </div>
            </div>

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
                <CardTitle>Aperçu du Proforma - {clientName}</CardTitle>
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

                  <div className="flex justify-between gap-4 mb-6">
                    <div className="bg-muted p-4 rounded-lg flex-1">
                      <div className="flex items-start gap-3">
                        {clientLogo && (
                          <img src={clientLogo} alt="Logo client" className="w-12 h-12 object-contain rounded" />
                        )}
                        <div>
                          <strong>Client:</strong><br />
                          {clientName}<br />
                          {clientAddress && <>{clientAddress}<br /></>}
                          {clientPhone && <>Tél: {clientPhone}<br /></>}
                          {clientEmail && <>{clientEmail}</>}
                        </div>
                      </div>
                    </div>
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <strong>N° Proforma:</strong> {proformaNumber}<br />
                      <strong>Date:</strong> {currentDate}
                    </div>
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

                  <div className="flex justify-between mt-12">
                    <div className="text-center w-40">
                      <div className="border-t border-foreground mt-16 pt-2">Le Client</div>
                    </div>
                    <div className="text-center w-40">
                      <div className="border-t border-foreground mt-16 pt-2">{companyInfo?.nomentreprise}</div>
                    </div>
                  </div>
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

import { useEffect, useState, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Search, Plus, Minus, Trash2, FileText, Printer, Loader2, Upload, Image, Download } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { getProductsRaw, getCompanyInfo } from '@/lib/github';
import { pdf, Document, Page, Text, View, StyleSheet, Image as PDFImage } from '@react-pdf/renderer';

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
  discount: number; // Remise en %
}

type DocumentType = 'PROFORMA' | 'DEVIS' | 'FACTURE';

const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data';

// PDF Styles
const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  companyInfo: {
    textAlign: 'left',
  },
  clientInfo: {
    textAlign: 'right',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#1e40af',
  },
  infoRow: {
    fontSize: 9,
    marginBottom: 2,
  },
  table: {
    marginTop: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e40af',
    padding: 8,
  },
  tableHeaderCell: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 8,
  },
  tableRowAlt: {
    backgroundColor: '#f9fafb',
  },
  tableCell: {
    fontSize: 9,
  },
  colRef: { width: '12%' },
  colDesign: { width: '28%' },
  colQty: { width: '8%', textAlign: 'center' },
  colPrix: { width: '14%', textAlign: 'right' },
  colRemise: { width: '10%', textAlign: 'center' },
  colMontant: { width: '14%', textAlign: 'right' },
  colTotal: { width: '14%', textAlign: 'right' },
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#dbeafe',
    padding: 10,
    marginTop: 2,
  },
  totalLabel: {
    width: '72%',
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 11,
  },
  totalValue: {
    width: '28%',
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 11,
    color: '#1e40af',
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
  },
  signatureBox: {
    width: '40%',
    textAlign: 'center',
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    marginTop: 50,
    paddingTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#6b7280',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
  logo: {
    width: 60,
    height: 60,
    objectFit: 'contain',
  },
  clientLogo: {
    width: 40,
    height: 40,
    objectFit: 'contain',
  },
});

// PDF Document Component
const InvoicePDF = ({ 
  documentType, 
  documentNumber, 
  currentDate, 
  companyInfo, 
  clientName, 
  clientAddress, 
  clientPhone, 
  clientEmail, 
  clientLogo, 
  selectedProducts, 
  totalDiscount,
  subtotal,
  discountAmount,
  totalAmount 
}: {
  documentType: DocumentType;
  documentNumber: string;
  currentDate: string;
  companyInfo: CompanyInfo | null;
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  clientEmail: string;
  clientLogo: string | null;
  selectedProducts: SelectedProduct[];
  totalDiscount: number;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
}) => {
  const getDocTitle = () => {
    switch (documentType) {
      case 'DEVIS': return 'DEVIS';
      case 'FACTURE': return 'FACTURE';
      default: return 'FACTURE PROFORMA';
    }
  };

  const getDocPrefix = () => {
    switch (documentType) {
      case 'DEVIS': return 'DEV';
      case 'FACTURE': return 'FAC';
      default: return 'PRO';
    }
  };

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        {/* Header */}
        <View style={pdfStyles.header}>
          <View style={pdfStyles.companyInfo}>
            <Text style={pdfStyles.companyName}>{companyInfo?.nomentreprise}</Text>
            <Text style={pdfStyles.infoRow}>{companyInfo?.siege}</Text>
            <Text style={pdfStyles.infoRow}>BP: {companyInfo?.boitepostate}</Text>
            <Text style={pdfStyles.infoRow}>Tél: {companyInfo?.Telephone}</Text>
            <Text style={pdfStyles.infoRow}>{companyInfo?.email}</Text>
            <Text style={pdfStyles.infoRow}>{companyInfo?.siteweb}</Text>
          </View>
          <View style={pdfStyles.clientInfo}>
            <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>CLIENT:</Text>
            <Text style={pdfStyles.infoRow}>{clientName}</Text>
            {clientAddress && <Text style={pdfStyles.infoRow}>{clientAddress}</Text>}
            {clientPhone && <Text style={pdfStyles.infoRow}>Tél: {clientPhone}</Text>}
            {clientEmail && <Text style={pdfStyles.infoRow}>{clientEmail}</Text>}
            <Text style={{ ...pdfStyles.infoRow, marginTop: 8 }}>N° {getDocPrefix()}: {documentNumber}</Text>
            <Text style={pdfStyles.infoRow}>Date: {currentDate}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={pdfStyles.title}>{getDocTitle()}</Text>

        {/* Table */}
        <View style={pdfStyles.table}>
          <View style={pdfStyles.tableHeader}>
            <Text style={{ ...pdfStyles.tableHeaderCell, ...pdfStyles.colRef }}>Réf.</Text>
            <Text style={{ ...pdfStyles.tableHeaderCell, ...pdfStyles.colDesign }}>Désignation</Text>
            <Text style={{ ...pdfStyles.tableHeaderCell, ...pdfStyles.colQty }}>Qté</Text>
            <Text style={{ ...pdfStyles.tableHeaderCell, ...pdfStyles.colPrix }}>Prix Unit.</Text>
            <Text style={{ ...pdfStyles.tableHeaderCell, ...pdfStyles.colRemise }}>Remise %</Text>
            <Text style={{ ...pdfStyles.tableHeaderCell, ...pdfStyles.colMontant }}>Montant</Text>
          </View>
          {selectedProducts.map((product, index) => {
            const lineTotal = product.quantity * product.prix_unit;
            const lineDiscount = lineTotal * (product.discount / 100);
            const lineFinal = lineTotal - lineDiscount;
            return (
              <View key={index} style={{ ...pdfStyles.tableRow, ...(index % 2 === 1 ? pdfStyles.tableRowAlt : {}) }}>
                <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.colRef }}>{product.reference}</Text>
                <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.colDesign }}>{product.produit}</Text>
                <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.colQty }}>{product.quantity}</Text>
                <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.colPrix }}>{product.prix_unit.toLocaleString('fr-FR')} FCFA</Text>
                <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.colRemise }}>{product.discount}%</Text>
                <Text style={{ ...pdfStyles.tableCell, ...pdfStyles.colMontant }}>{lineFinal.toLocaleString('fr-FR')} FCFA</Text>
              </View>
            );
          })}
          
          {/* Subtotal */}
          <View style={pdfStyles.totalRow}>
            <Text style={pdfStyles.totalLabel}>Sous-total:</Text>
            <Text style={pdfStyles.totalValue}>{subtotal.toLocaleString('fr-FR')} FCFA</Text>
          </View>
          
          {/* Total Discount */}
          {totalDiscount > 0 && (
            <View style={{ ...pdfStyles.totalRow, backgroundColor: '#fef3c7' }}>
              <Text style={pdfStyles.totalLabel}>Remise globale ({totalDiscount}%):</Text>
              <Text style={{ ...pdfStyles.totalValue, color: '#d97706' }}>-{discountAmount.toLocaleString('fr-FR')} FCFA</Text>
            </View>
          )}
          
          {/* Final Total */}
          <View style={{ ...pdfStyles.totalRow, backgroundColor: '#1e40af' }}>
            <Text style={{ ...pdfStyles.totalLabel, color: 'white' }}>TOTAL TTC:</Text>
            <Text style={{ ...pdfStyles.totalValue, color: 'white' }}>{totalAmount.toLocaleString('fr-FR')} FCFA</Text>
          </View>
        </View>

        {/* Signatures */}
        <View style={pdfStyles.signatureSection}>
          <View style={pdfStyles.signatureBox}>
            <Text style={pdfStyles.signatureLine}>Le Client</Text>
          </View>
          <View style={pdfStyles.signatureBox}>
            <Text style={pdfStyles.signatureLine}>{companyInfo?.nomentreprise}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={pdfStyles.footer}>
          <Text>{companyInfo?.nomentreprise} - {companyInfo?.siege}</Text>
          <Text>{companyInfo?.siteweb} | {companyInfo?.email}</Text>
        </View>
      </Page>
    </Document>
  );
};

const AdminProforma = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientLogo, setClientLogo] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>('PROFORMA');
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, infoData] = await Promise.all([
          getProductsRaw(),
          getCompanyInfo()
        ]);

        const allProducts = productsData.flatMap((cat: ProductCategory) => 
          cat.datas.map((p: ProductData) => ({ ...p, categorie: cat.categorie }))
        );
        setProducts(allProducts);
        setCompanyInfo(infoData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Erreur lors du chargement des données');
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
      setSelectedProducts(prev => [...prev, { ...product, quantity: 1, discount: 0 }]);
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

  const updateDiscount = (reference: string, discount: number) => {
    setSelectedProducts(prev =>
      prev.map(p => {
        if (p.reference === reference) {
          return { ...p, discount: Math.min(100, Math.max(0, discount)) };
        }
        return p;
      })
    );
  };

  const removeProduct = (reference: string) => {
    setSelectedProducts(prev => prev.filter(p => p.reference !== reference));
  };

  // Calculate totals
  const subtotal = selectedProducts.reduce((acc, p) => {
    const lineTotal = p.quantity * p.prix_unit;
    const lineDiscount = lineTotal * (p.discount / 100);
    return acc + (lineTotal - lineDiscount);
  }, 0);

  const discountAmount = subtotal * (totalDiscount / 100);
  const totalAmount = subtotal - discountAmount;

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

  const getDocTitle = () => {
    switch (documentType) {
      case 'DEVIS': return 'DEVIS';
      case 'FACTURE': return 'FACTURE';
      default: return 'FACTURE PROFORMA';
    }
  };

  const getDocPrefix = () => {
    switch (documentType) {
      case 'DEVIS': return 'DEV';
      case 'FACTURE': return 'FAC';
      default: return 'PRO';
    }
  };

  const handleDownloadPDF = async () => {
    if (!clientName.trim()) {
      toast.error('Veuillez saisir le nom du client');
      return;
    }

    setGenerating(true);
    try {
      const blob = await pdf(
        <InvoicePDF
          documentType={documentType}
          documentNumber={documentNumber}
          currentDate={currentDate}
          companyInfo={companyInfo}
          clientName={clientName}
          clientAddress={clientAddress}
          clientPhone={clientPhone}
          clientEmail={clientEmail}
          clientLogo={clientLogo}
          selectedProducts={selectedProducts}
          totalDiscount={totalDiscount}
          subtotal={subtotal}
          discountAmount={discountAmount}
          totalAmount={totalAmount}
        />
      ).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${getDocPrefix()}-${documentNumber}-${clientName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('PDF téléchargé avec succès');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    } finally {
      setGenerating(false);
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
          <title>${getDocTitle()} - ${clientName} - SICAF</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; margin: 0; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
            .company-info { text-align: left; }
            .client-info { text-align: right; }
            .company-name { font-size: 24px; font-weight: bold; color: #1e40af; }
            .title { font-size: 28px; font-weight: bold; text-align: center; margin: 20px 0; color: #1e40af; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background: #1e40af; color: white; }
            tr:nth-child(even) { background: #f9fafb; }
            .subtotal-row { font-weight: bold; background: #dbeafe !important; }
            .discount-row { font-weight: bold; background: #fef3c7 !important; color: #d97706; }
            .total-row { font-weight: bold; font-size: 16px; background: #1e40af !important; color: white; }
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

  const documentNumber = `${Date.now().toString().slice(-8)}`;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Générateur de Documents</h1>
          <p className="text-muted-foreground mt-1">
            Créez des proformas, devis ou factures et téléchargez-les en PDF
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
                Configuration du document
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Document Type */}
              <div className="space-y-2">
                <Label>Type de document *</Label>
                <Select value={documentType} onValueChange={(v) => setDocumentType(v as DocumentType)}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PROFORMA">Facture Proforma</SelectItem>
                    <SelectItem value="DEVIS">Devis</SelectItem>
                    <SelectItem value="FACTURE">Facture</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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

              {/* Selected Products */}
              <div>
                <h3 className="font-semibold mb-3">Produits sélectionnés ({selectedProducts.length})</h3>
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
                          <div className="flex items-center gap-1">
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
                          </div>
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={product.discount}
                              onChange={(e) => updateDiscount(product.reference, Number(e.target.value))}
                              className="w-16 h-8 text-center"
                            />
                            <span className="text-xs text-muted-foreground">%</span>
                          </div>
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
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Sous-total:</span>
                  <span className="font-medium">{subtotal.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Label>Remise globale:</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={totalDiscount}
                      onChange={(e) => setTotalDiscount(Math.min(100, Math.max(0, Number(e.target.value))))}
                      className="w-20 h-8 text-center"
                    />
                    <span className="text-muted-foreground">%</span>
                  </div>
                  {totalDiscount > 0 && (
                    <span className="text-destructive">-{discountAmount.toLocaleString('fr-FR')} FCFA</span>
                  )}
                </div>
                <div className="flex items-center justify-between font-heading text-xl font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span className="text-primary">{totalAmount.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  className="flex-1"
                  disabled={selectedProducts.length === 0 || !clientName.trim()}
                  onClick={() => setShowPreview(true)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Aperçu
                </Button>
                <Button
                  variant="default"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={selectedProducts.length === 0 || !clientName.trim() || generating}
                  onClick={handleDownloadPDF}
                >
                  {generating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  PDF
                </Button>
                <Button
                  variant="outline"
                  disabled={selectedProducts.length === 0 || !clientName.trim()}
                  onClick={handlePrint}
                >
                  <Printer className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Print Preview (Hidden) */}
        <div className="hidden">
          <div ref={printRef}>
            <div className="header">
              <div className="company-info">
                <div className="company-name">{companyInfo?.nomentreprise}</div>
                <div>{companyInfo?.siege}</div>
                <div>BP: {companyInfo?.boitepostate}</div>
                <div>Tél: {companyInfo?.Telephone}</div>
                <div>{companyInfo?.email}</div>
                <div>{companyInfo?.siteweb}</div>
              </div>
              <div className="client-info">
                <strong>CLIENT:</strong><br />
                {clientName}<br />
                {clientAddress && <>{clientAddress}<br /></>}
                {clientPhone && <>Tél: {clientPhone}<br /></>}
                {clientEmail && <>{clientEmail}<br /></>}
                <br />
                <strong>N° {getDocPrefix()}:</strong> {documentNumber}<br />
                <strong>Date:</strong> {currentDate}
              </div>
            </div>

            <div className="title">{getDocTitle()}</div>

            <table>
              <thead>
                <tr>
                  <th>Réf.</th>
                  <th>Désignation</th>
                  <th style={{ textAlign: 'center' }}>Qté</th>
                  <th style={{ textAlign: 'right' }}>Prix Unit.</th>
                  <th style={{ textAlign: 'center' }}>Remise</th>
                  <th style={{ textAlign: 'right' }}>Montant</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product, index) => {
                  const lineTotal = product.quantity * product.prix_unit;
                  const lineDiscount = lineTotal * (product.discount / 100);
                  const lineFinal = lineTotal - lineDiscount;
                  return (
                    <tr key={index}>
                      <td>{product.reference}</td>
                      <td>{product.produit}</td>
                      <td style={{ textAlign: 'center' }}>{product.quantity}</td>
                      <td style={{ textAlign: 'right' }}>{product.prix_unit.toLocaleString('fr-FR')} FCFA</td>
                      <td style={{ textAlign: 'center' }}>{product.discount}%</td>
                      <td style={{ textAlign: 'right' }}>{lineFinal.toLocaleString('fr-FR')} FCFA</td>
                    </tr>
                  );
                })}
                <tr className="subtotal-row">
                  <td colSpan={5} style={{ textAlign: 'right' }}>Sous-total</td>
                  <td style={{ textAlign: 'right' }}>{subtotal.toLocaleString('fr-FR')} FCFA</td>
                </tr>
                {totalDiscount > 0 && (
                  <tr className="discount-row">
                    <td colSpan={5} style={{ textAlign: 'right' }}>Remise globale ({totalDiscount}%)</td>
                    <td style={{ textAlign: 'right' }}>-{discountAmount.toLocaleString('fr-FR')} FCFA</td>
                  </tr>
                )}
                <tr className="total-row">
                  <td colSpan={5} style={{ textAlign: 'right' }}>TOTAL TTC</td>
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
                <CardTitle>Aperçu du {getDocTitle()} - {clientName}</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={handleDownloadPDF} disabled={generating} className="bg-green-600 hover:bg-green-700">
                    {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                    PDF
                  </Button>
                  <Button onClick={handlePrint} variant="outline">
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimer
                  </Button>
                  <Button variant="outline" onClick={() => setShowPreview(false)}>
                    Fermer
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-6 bg-white text-foreground">
                  {/* Header - Company left, Client right */}
                  <div className="flex justify-between items-start mb-8">
                    <div className="text-left">
                      <h2 className="font-heading text-2xl font-bold text-primary">{companyInfo?.nomentreprise}</h2>
                      <p className="text-sm text-muted-foreground">{companyInfo?.siege}</p>
                      <p className="text-sm text-muted-foreground">BP: {companyInfo?.boitepostate}</p>
                      <p className="text-sm text-muted-foreground">Tél: {companyInfo?.Telephone}</p>
                      <p className="text-sm text-muted-foreground">{companyInfo?.email}</p>
                      <p className="text-sm text-muted-foreground">{companyInfo?.siteweb}</p>
                    </div>
                    <div className="text-right bg-muted p-4 rounded-lg">
                      <div className="flex items-start gap-3 justify-end">
                        {clientLogo && (
                          <img src={clientLogo} alt="Logo client" className="w-12 h-12 object-contain rounded" />
                        )}
                        <div>
                          <strong className="text-foreground">CLIENT:</strong><br />
                          <span className="text-foreground">{clientName}</span><br />
                          {clientAddress && <span className="text-muted-foreground">{clientAddress}<br /></span>}
                          {clientPhone && <span className="text-muted-foreground">Tél: {clientPhone}<br /></span>}
                          {clientEmail && <span className="text-muted-foreground">{clientEmail}</span>}
                        </div>
                      </div>
                      <div className="mt-4 pt-2 border-t">
                        <strong>N° {getDocPrefix()}:</strong> {documentNumber}<br />
                        <strong>Date:</strong> {currentDate}
                      </div>
                    </div>
                  </div>

                  <h1 className="text-3xl font-bold text-center text-primary mb-6">{getDocTitle()}</h1>

                  <Table>
                    <TableHeader>
                      <TableRow className="bg-primary text-primary-foreground">
                        <TableHead className="text-primary-foreground">Réf.</TableHead>
                        <TableHead className="text-primary-foreground">Désignation</TableHead>
                        <TableHead className="text-primary-foreground text-center">Qté</TableHead>
                        <TableHead className="text-primary-foreground text-right">Prix Unit.</TableHead>
                        <TableHead className="text-primary-foreground text-center">Remise</TableHead>
                        <TableHead className="text-primary-foreground text-right">Montant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedProducts.map((product, index) => {
                        const lineTotal = product.quantity * product.prix_unit;
                        const lineDiscount = lineTotal * (product.discount / 100);
                        const lineFinal = lineTotal - lineDiscount;
                        return (
                          <TableRow key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/50'}>
                            <TableCell>{product.reference}</TableCell>
                            <TableCell>{product.produit}</TableCell>
                            <TableCell className="text-center">{product.quantity}</TableCell>
                            <TableCell className="text-right">{product.prix_unit.toLocaleString('fr-FR')} FCFA</TableCell>
                            <TableCell className="text-center">{product.discount}%</TableCell>
                            <TableCell className="text-right font-medium">
                              {lineFinal.toLocaleString('fr-FR')} FCFA
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow className="bg-primary/10 font-bold">
                        <TableCell colSpan={5} className="text-right">Sous-total</TableCell>
                        <TableCell className="text-right">
                          {subtotal.toLocaleString('fr-FR')} FCFA
                        </TableCell>
                      </TableRow>
                      {totalDiscount > 0 && (
                        <TableRow className="bg-yellow-100 font-bold">
                          <TableCell colSpan={5} className="text-right text-yellow-700">Remise globale ({totalDiscount}%)</TableCell>
                          <TableCell className="text-right text-yellow-700">
                            -{discountAmount.toLocaleString('fr-FR')} FCFA
                          </TableCell>
                        </TableRow>
                      )}
                      <TableRow className="bg-primary font-bold">
                        <TableCell colSpan={5} className="text-right text-lg text-primary-foreground">TOTAL TTC</TableCell>
                        <TableCell className="text-right text-lg text-primary-foreground">
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

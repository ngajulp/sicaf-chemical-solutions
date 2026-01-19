import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { uploadImageToGitHub, uploadPdfToGitHub } from '@/lib/github';

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

interface EditProductModalProps {
  product: ProductData;
  onClose: () => void;
  onSave: (updatedProduct: ProductData) => void;
}

export default function EditProductModal({ product, onClose, onSave }: EditProductModalProps) {
  const [formData, setFormData] = useState<ProductData>({ ...product });
  const [applicationsText, setApplicationsText] = useState(product.applications.join('\n'));
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Upload handlers
  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const timestamp = Date.now();
      const fileName = `product_${timestamp}_${file.name}`;
      const result = await uploadImageToGitHub(file, fileName);
      toast.success('Image uploadée avec succès');
      setFormData(prev => ({ ...prev, img: result.url }));
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePdfUpload = async (file: File) => {
    setUploadingPdf(true);
    try {
      const timestamp = Date.now();
      const fileName = `product_${timestamp}_${file.name}`;
      const result = await uploadPdfToGitHub(file, fileName);
      toast.success('PDF uploadé avec succès');
      setFormData(prev => ({ ...prev, pdf: result.url }));
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de l\'upload du PDF');
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleSave = () => {
    const updatedProduct: ProductData = {
      ...formData,
      applications: applicationsText.split('\n').filter(a => a.trim())
    };
    onSave(updatedProduct);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifier le produit</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Référence */}
          <div>
            <label className="block font-medium mb-1">Référence</label>
            <Input
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            />
          </div>

          {/* Nom du produit */}
          <div>
            <label className="block font-medium mb-1">Nom du produit</label>
            <Input
              value={formData.produit}
              onChange={(e) => setFormData({ ...formData, produit: e.target.value })}
            />
          </div>

          {/* Applications */}
          <div>
            <label className="block font-medium mb-1">Applications (une par ligne)</label>
            <Textarea
              value={applicationsText}
              onChange={(e) => setApplicationsText(e.target.value)}
              rows={3}
            />
          </div>

          {/* Spécifications */}
          <div>
            <label className="block font-medium mb-1">Spécifications</label>
            <Input
              value={formData.specifications}
              onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
            />
          </div>

          {/* Quantité & Prix */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Quantité</label>
              <Input
                type="number"
                value={formData.qty}
                onChange={(e) => setFormData({ ...formData, qty: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Prix unitaire (FCFA)</label>
              <Input
                type="number"
                value={formData.prix_unit}
                onChange={(e) => setFormData({ ...formData, prix_unit: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Image */}
          <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
            <label className="flex items-center gap-2 font-medium">
              <Upload className="h-4 w-4" />
              Image du produit
            </label>
            <div className="flex items-center gap-3">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => imageInputRef.current?.click()}
                disabled={uploadingImage}
              >
                {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                {formData.img ? 'Changer' : 'Sélectionner'}
              </Button>
              {formData.img && (
                <img src={formData.img} alt="Preview" className="h-10 w-10 object-cover rounded" />
              )}
            </div>
          </div>

          {/* PDF */}
          <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
            <label className="flex items-center gap-2 font-medium">
              <FileText className="h-4 w-4" />
              Fiche technique (PDF)
            </label>
            <div className="flex items-center gap-3">
              <input
                ref={pdfInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handlePdfUpload(e.target.files[0])}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => pdfInputRef.current?.click()}
                disabled={uploadingPdf}
              >
                {uploadingPdf ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                {formData.pdf ? 'Changer' : 'Sélectionner'}
              </Button>

              {formData.pdf && (
                <a
                  href={formData.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary underline flex items-center gap-1"
                >
                  <Download className="h-4 w-4" /> Télécharger PDF
                </a>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSave} disabled={uploadingImage || uploadingPdf}>
            {uploadingImage || uploadingPdf ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

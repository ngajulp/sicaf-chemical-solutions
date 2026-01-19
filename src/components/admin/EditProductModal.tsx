import { useState, useRef, DragEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { updateProductWithFile } from '@/lib/github';

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
  onUpdate: (updatedProduct: ProductData) => void;
}

export default function EditProductModal({ product, onClose, onUpdate }: EditProductModalProps) {
  const [formData, setFormData] = useState<ProductData>({ ...product });
  const [applicationsText, setApplicationsText] = useState(product.applications.join('\n'));
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [dragPdfActive, setDragPdfActive] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const droppedImageRef = useRef<File | null>(null);
  const droppedPdfRef = useRef<File | null>(null);

  // --- Drag & drop handlers ---
  const handleDrag = (e: DragEvent<HTMLDivElement>, type: 'image' | 'pdf') => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'image') setDragActive(e.type === 'dragover');
    else setDragPdfActive(e.type === 'dragover');
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, type: 'image' | 'pdf') => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'image') setDragActive(false);
    else setDragPdfActive(false);

    const files = e.dataTransfer.files;
    if (files.length) {
      const file = files[0];
      if (type === 'image') droppedImageRef.current = file;
      else droppedPdfRef.current = file;
    }
  };

  // --- Save / Update product ---
  const handleSave = async () => {
    try {
      const updatedProduct: ProductData = {
        ...formData,
        applications: applicationsText.split('\n').filter(a => a.trim()),
      };

      // Upload & update product, écrase les fichiers existants si nécessaire
      if (droppedImageRef.current) setUploadingImage(true);
      if (droppedPdfRef.current) setUploadingPdf(true);

      const finalProduct = await updateProductWithFile(
        product.reference,
        updatedProduct,
        droppedImageRef.current || undefined,
        droppedPdfRef.current || undefined
      );

      onUpdate(finalProduct);
      toast.success("Produit mis à jour avec succès");
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erreur lors de la mise à jour du produit");
    } finally {
      setUploadingImage(false);
      setUploadingPdf(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Modifier le produit</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Référence */}
          <div>
            <label className="block font-medium mb-1">Référence</label>
            <Input
              value={formData.reference}
              onChange={e => setFormData({ ...formData, reference: e.target.value })}
            />
          </div>

          {/* Nom du produit */}
          <div>
            <label className="block font-medium mb-1">Nom du produit</label>
            <Input
              value={formData.produit}
              onChange={e => setFormData({ ...formData, produit: e.target.value })}
            />
          </div>

          {/* Applications */}
          <div>
            <label className="block font-medium mb-1">Applications (une par ligne)</label>
            <Textarea
              value={applicationsText}
              onChange={e => setApplicationsText(e.target.value)}
              rows={3}
            />
          </div>

          {/* Spécifications */}
          <div>
            <label className="block font-medium mb-1">Spécifications</label>
            <Input
              value={formData.specifications}
              onChange={e => setFormData({ ...formData, specifications: e.target.value })}
            />
          </div>

          {/* Quantité & Prix */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Quantité</label>
              <Input
                type="number"
                value={formData.qty}
                onChange={e => setFormData({ ...formData, qty: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Prix unitaire (FCFA)</label>
              <Input
                type="number"
                value={formData.prix_unit}
                onChange={e => setFormData({ ...formData, prix_unit: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Image Drag & Drop */}
          <div
            className={`space-y-2 p-4 border rounded-lg bg-muted/20 ${dragActive ? 'border-dashed border-primary' : ''}`}
            onDragOver={e => handleDrag(e, 'image')}
            onDragLeave={e => handleDrag(e, 'image')}
            onDrop={e => handleDrop(e, 'image')}
          >
            <label className="flex items-center gap-2 font-medium">
              <Upload className="h-4 w-4" /> Image du produit
            </label>
            <div className="flex items-center gap-3">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => e.target.files?.[0] && (droppedImageRef.current = e.target.files[0])}
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
              {formData.img && <img src={formData.img} alt="Preview" className="h-16 w-16 object-cover rounded border" />}
            </div>
            <p className="text-sm text-muted-foreground">Ou glisser-déposer ici</p>
          </div>

          {/* PDF Drag & Drop */}
          <div
            className={`space-y-2 p-4 border rounded-lg bg-muted/20 ${dragPdfActive ? 'border-dashed border-primary' : ''}`}
            onDragOver={e => handleDrag(e, 'pdf')}
            onDragLeave={e => handleDrag(e, 'pdf')}
            onDrop={e => handleDrop(e, 'pdf')}
          >
            <label className="flex items-center gap-2 font-medium">
              <FileText className="h-4 w-4" /> Fiche technique (PDF)
            </label>
            <div className="flex items-center gap-3">
              <input
                ref={pdfInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={e => e.target.files?.[0] && (droppedPdfRef.current = e.target.files[0])}
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
            <p className="text-sm text-muted-foreground">Ou glisser-déposer ici</p>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSave} disabled={uploadingImage || uploadingPdf}>
            {(uploadingImage || uploadingPdf) && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

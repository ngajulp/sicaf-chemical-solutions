import { useState, useRef } from 'react';
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
  onSave: (updatedProduct: ProductData) => void;
}

export default function EditProductModal({ product, onClose, onSave }: EditProductModalProps) {
  const [formData, setFormData] = useState<ProductData>({ ...product });
  const [applicationsText, setApplicationsText] = useState(product.applications.join('\n'));
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setUploading(true);
    try {
      const updatedProduct = await updateProductWithFile(
        product.reference,
        {
          ...formData,
          applications: applicationsText.split('\n').filter(a => a.trim())
        },
        imageInputRef.current?.files?.[0],
        pdfInputRef.current?.files?.[0]
      );

      toast.success('Produit mis à jour avec succès !');
      onSave(updatedProduct);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la mise à jour du produit');
    } finally {
      setUploading(false);
    }
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
              <Upload className="h-4 w-4" /> Image du produit
            </label>
            <div className="flex items-center gap-3">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => imageInputRef.current?.click()}
              >
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
              <FileText className="h-4 w-4" /> Fiche technique (PDF)
            </label>
            <div className="flex items-center gap-3">
              <input
                ref={pdfInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => pdfInputRef.current?.click()}
              >
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
          <Button onClick={handleSave} disabled={uploading}>
            {uploading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

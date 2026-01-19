import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { updateProductWithFile } from '@/lib/github';
import { X, Upload, Download } from 'lucide-react';

interface EditProductModalProps {
  product: any;
  onClose: () => void;
  onUpdate?: (updatedProduct: any) => void;
}

const EditProductModal = ({ product, onClose, onUpdate }: EditProductModalProps) => {
  const [formData, setFormData] = useState({
    produit: product.produit,
    reference: product.reference,
    qty: product.qty,
    prix_unit: product.prix_unit,
    specifications: product.specifications,
    applications: product.applications.join('\n'),
  });
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newPdf, setNewPdf] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewPdf(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const updatedProduct = await updateProductWithFile(
        product.reference,
        {
          produit: formData.produit,
          reference: formData.reference,
          qty: formData.qty,
          prix_unit: formData.prix_unit,
          specifications: formData.specifications,
          applications: formData.applications.split('\n').map(a => a.trim()).filter(Boolean),
        },
        newImage || undefined,
        newPdf || undefined
      );
      if (onUpdate) onUpdate(updatedProduct);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-3xl p-6 relative shadow-lg">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
        <Dialog.Title className="text-2xl font-bold mb-4">Modifier le produit</Dialog.Title>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Produit"
            name="produit"
            value={formData.produit}
            onChange={handleChange}
            placeholder="Nom du produit"
          />
          <Input
            label="Référence"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            placeholder="Référence"
          />
          <Input
            label="Quantité"
            name="qty"
            type="number"
            value={formData.qty}
            onChange={handleChange}
          />
          <Input
            label="Prix unitaire"
            name="prix_unit"
            type="number"
            value={formData.prix_unit}
            onChange={handleChange}
          />
          <Textarea
            label="Spécifications"
            name="specifications"
            value={formData.specifications}
            onChange={handleChange}
            placeholder="Spécifications techniques"
            className="col-span-1 md:col-span-2"
          />
          <Textarea
            label="Applications (une par ligne)"
            name="applications"
            value={formData.applications}
            onChange={handleChange}
            placeholder="Applications du produit"
            className="col-span-1 md:col-span-2"
          />
        </div>

        <div className="mt-4 flex flex-col md:flex-row md:items-center md:gap-4">
          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Image du produit</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {newImage ? (
              <img
                src={URL.createObjectURL(newImage)}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md border"
              />
            ) : product.img ? (
              <img
                src={product.img}
                alt={product.produit}
                className="w-32 h-32 object-cover rounded-md border"
              />
            ) : null}
          </div>

          {/* PDF Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Fiche technique (PDF)</label>
            <input type="file" accept="application/pdf" onChange={handlePdfChange} />
            {product.pdf && !newPdf && (
              <a
                href={product.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary flex items-center gap-2 mt-1"
              >
                <Download className="w-4 h-4" /> Télécharger PDF actuel
              </a>
            )}
          </div>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default EditProductModal;

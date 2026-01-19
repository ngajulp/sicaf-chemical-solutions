import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import { useLanguage } from '@/contexts/LanguageContext';

interface EditProductModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

const EditProductModal = ({ product, isOpen, onClose }: EditProductModalProps) => {
  const { updateProduct } = useGitHubProducts();
  const { language } = useLanguage();

  const [name, setName] = useState(product.name[language] || '');
  const [applications, setApplications] = useState(product.applications[language] || '');
  const [specifications, setSpecifications] = useState(product.specifications || '');
  const [pdf, setPdf] = useState(product.pdf || '');
  const [img, setImg] = useState(product.img || '');

  if (!isOpen) return null;

  const handleSave = () => {
    updateProduct(product.reference, {
      name,
      applications,
      specifications,
      pdf,
      img
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose} // clic sur le fond ferme le modal
    >
      <Card 
        className="w-full max-w-lg mx-4"
        onClick={e => e.stopPropagation()} // empêche la fermeture si clic dans le Card
      >
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">
            {language === 'fr' ? 'Modifier le produit' : 'Edit Product'}
          </h3>

          {/* Nom */}
          <div className="space-y-2">
            <label className="font-medium">{language === 'fr' ? 'Nom' : 'Name'}</label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>

          {/* Applications */}
          <div className="space-y-2">
            <label className="font-medium">{language === 'fr' ? 'Applications' : 'Applications'}</label>
            <Input value={applications} onChange={e => setApplications(e.target.value)} />
          </div>

          {/* Spécifications */}
          <div className="space-y-2">
            <label className="font-medium">{language === 'fr' ? 'Spécifications' : 'Specifications'}</label>
            <Input value={specifications} onChange={e => setSpecifications(e.target.value)} />
          </div>

          {/* PDF */}
          <div className="space-y-2">
            <label className="font-medium">{language === 'fr' ? 'PDF' : 'PDF'}</label>
            <Input value={pdf} onChange={e => setPdf(e.target.value)} placeholder="Lien vers le PDF" />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <label className="font-medium">{language === 'fr' ? 'Image' : 'Image'}</label>
            <Input value={img} onChange={e => setImg(e.target.value)} placeholder="Lien vers l'image" />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="secondary" onClick={handleSave}>
              {language === 'fr' ? 'Enregistrer' : 'Save'}
            </Button>
            <Button variant="ghost" onClick={onClose}>
              {language === 'fr' ? 'Annuler' : 'Cancel'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProductModal;

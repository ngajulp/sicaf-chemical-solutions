import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import { useLanguage } from '@/contexts/LanguageContext';

interface EditProductModalProps {
  product: any;
  onClose: () => void;
}

const EditProductModal = ({ product, onClose }: EditProductModalProps) => {
  const { updateProduct } = useGitHubProducts();
  const { language } = useLanguage();

  const [name, setName] = useState(product.name[language]);
  const [applications, setApplications] = useState(product.applications[language]);
  const [specifications, setSpecifications] = useState(product.specifications);

  const handleSave = () => {
    updateProduct(product.reference, {
      name,
      applications,
      specifications
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-lg mx-4">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">{language === 'fr' ? 'Modifier le produit' : 'Edit Product'}</h3>

          <div className="space-y-2">
            <label className="font-medium">{language === 'fr' ? 'Nom' : 'Name'}</label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="font-medium">{language === 'fr' ? 'Applications' : 'Applications'}</label>
            <Input value={applications} onChange={e => setApplications(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="font-medium">{language === 'fr' ? 'Spécifications' : 'Specifications'}</label>
            <Input value={specifications} onChange={e => setSpecifications(e.target.value)} />
          </div>

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

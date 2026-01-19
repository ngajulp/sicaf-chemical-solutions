import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGitHubProducts } from '@/hooks/useGitHubProducts';
import { X, FileText, Package } from 'lucide-react';

interface EditProductModalProps {
  product: any;
  onClose: () => void;
}

const EditProductModal = ({ product, onClose }: EditProductModalProps) => {
  const { language } = useLanguage();
  const { updateProduct } = useGitHubProducts();

  const [name, setName] = useState(product.produit || product.name[language]);
  const [applications, setApplications] = useState(
    Array.isArray(product.applications) ? product.applications.join('\n') : product.applications
  );
  const [specifications, setSpecifications] = useState(product.specifications || '');
  const [img, setImg] = useState<string>(product.img || '');
  const [pdf, setPdf] = useState<string>(product.pdf || '');
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'img' | 'pdf') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'img') setImg(reader.result as string);
      if (type === 'pdf') setPdf(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedProduct = {
        ...product,
        produit: name,
        name: { ...product.name, [language]: name },
        applications: applications.split('\n').map(a => a.trim()).filter(a => a),
        specifications,
        img,
        pdf
      };
      await updateProduct(product.reference, updatedProduct);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-auto">
      <Card className="w-full max-w-2xl relative">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>{language === 'fr' ? 'Modifier le produit' : 'Edit Product'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Nom */}
          <div className="space-y-1">
            <label className="font-medium">{language === 'fr' ? 'Nom' : 'Name'}</label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>

          {/* Applications */}
          <div className="space-y-1">
            <label className="font-medium">{language === 'fr' ? 'Applications' : 'Applications'}</label>
            <Textarea
              value={applications}
              onChange={e => setApplications(e.target.value)}
              placeholder={language === 'fr' ? 'Une application par ligne' : 'One application per line'}
              rows={4}
            />
          </div>

          {/* Specifications */}
          <div className="space-y-1">
            <label className="font-medium">{language === 'fr' ? 'Spécifications' : 'Specifications'}</label>
            <Textarea value={specifications} onChange={e => setSpecifications(e.target.value)} rows={3} />
          </div>

          {/* Image file input + Preview */}
          <div className="space-y-1">
            <label className="font-medium">{language === 'fr' ? 'Image' : 'Image'}</label>
            <Input type="file" accept="image/*" onChange={e => handleFileChange(e, 'img')} />
            {img ? (
              <div className="mt-2 w-full h-48 bg-muted flex items-center justify-center overflow-hidden rounded">
                <img src={img} alt="Prévisualisation" className="object-contain w-full h-full" />
              </div>
            ) : (
              <div className="mt-2 w-full h-48 bg-muted flex items-center justify-center rounded text-muted-foreground">
                <Package className="h-10 w-10" />
                <span className="ml-2">{language === 'fr' ? 'Aucune image' : 'No image'}</span>
              </div>
            )}
          </div>

          {/* PDF file input + Preview */}
          <div className="space-y-1">
            <label className="font-medium">{language === 'fr' ? 'Fichier PDF' : 'PDF File'}</label>
            <Input type="file" accept="application/pdf" onChange={e => handleFileChange(e, 'pdf')} />
            {pdf && (
              <p className="mt-2 inline-flex items-center gap-2 text-primary font-medium truncate">
                <FileText className="h-5 w-5" />
                {language === 'fr' ? 'PDF sélectionné' : 'PDF selected'}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="secondary" onClick={handleSave} disabled={saving}>
              {saving ? (language === 'fr' ? 'Enregistrement...' : 'Saving...') : (language === 'fr' ? 'Enregistrer' : 'Save')}
            </Button>
            <Button variant="ghost" onClick={onClose} disabled={saving}>
              {language === 'fr' ? 'Annuler' : 'Cancel'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProductModal;

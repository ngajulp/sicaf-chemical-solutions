import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { updateProductWithFile } from '@/lib/github'; // ⚡ fonction à créer pour envoyer PDF sur GitHub

interface EditProductModalProps {
  product: any;
  onClose: () => void;
}

const EditProductModal = ({ product, onClose }: EditProductModalProps) => {
  const { language } = useLanguage();

  const [name, setName] = useState(product.produit);
  const [applications, setApplications] = useState(product.applications.join('\n'));
  const [specifications, setSpecifications] = useState(product.specifications);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setUploading(true);
    try {
      await updateProductWithFile(product.reference, {
        produit: name,
        applications: applications.split('\n'),
        specifications,
        pdfFile, // peut être null si aucun fichier sélectionné
      });
      onClose();
    } catch (err) {
      console.error('Erreur lors de la mise à jour du produit:', err);
      alert('Erreur lors de la mise à jour du produit');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-xl mx-4">
        <CardHeader>
          <CardTitle className="text-lg font-bold">
            {language === 'fr' ? 'Modifier le produit' : 'Edit Product'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Nom */}
          <div className="space-y-2">
            <label className="font-medium">{language === 'fr' ? 'Nom' : 'Name'}</label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>

          {/* Applications */}
          <div className="space-y-2">
            <label className="font-medium">{language === 'fr' ? 'Applications' : 'Applications'}</label>
            <Input
              value={applications}
              onChange={e => setApplications(e.target.value)}
              placeholder="Une application par ligne"
            />
          </div>

          {/* Specifications */}
          <div className="space-y-2">
            <label className="font-medium">{language === 'fr' ? 'Spécifications' : 'Specifications'}</label>
            <Input value={specifications} onChange={e => setSpecifications(e.target.value)} />
          </div>

          {/* PDF */}
          <div className="space-y-2">
            <label className="font-medium">{language === 'fr' ? 'Fichier PDF' : 'PDF File'}</label>
            {product.pdf && !pdfFile && (
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <a
                  href={product.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-primary"
                >
                  Télécharger PDF existant
                </a>
              </div>
            )}
            <Input type="file" accept="application/pdf" onChange={handleFileChange} />
            {pdfFile && <Badge variant="secondary">{pdfFile.name}</Badge>}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="secondary" onClick={handleSave} disabled={uploading}>
              {uploading ? 'Enregistrement...' : language === 'fr' ? 'Enregistrer' : 'Save'}
            </Button>
            <Button variant="ghost" onClick={onClose} disabled={uploading}>
              {language === 'fr' ? 'Annuler' : 'Cancel'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProductModal;

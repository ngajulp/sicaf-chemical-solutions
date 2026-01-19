import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Upload, X } from 'lucide-react';

interface EditProductModalProps {
  product: any;
  onClose: () => void;
  onSave: (updatedProduct: any) => void; // callback pour mise à jour immédiate
}

const EditProductModal = ({ product, onClose, onSave }: EditProductModalProps) => {
  const { language } = useLanguage();

  const [name, setName] = useState(product.produit);
  const [applications, setApplications] = useState(product.applications.join('\n'));
  const [specifications, setSpecifications] = useState(product.specifications);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [previewImg, setPreviewImg] = useState<string | undefined>(product.img);
  const [previewPdf, setPreviewPdf] = useState<string | undefined>(product.pdf);

  // Prévisualisation image
  useEffect(() => {
    if (!imgFile) return;
    const reader = new FileReader();
    reader.onload = () => setPreviewImg(reader.result as string);
    reader.readAsDataURL(imgFile);
  }, [imgFile]);

  // Prévisualisation PDF (nom de fichier)
  useEffect(() => {
    if (pdfFile) {
      setPreviewPdf(pdfFile.name);
    }
  }, [pdfFile]);

  const handleSave = () => {
    // Création objet produit mis à jour
    const updatedProduct = {
      ...product,
      produit: name,
      applications: applications.split('\n'),
      specifications,
      img: previewImg,
      pdf: previewPdf,
      _imgFile: imgFile,   // peut être utilisé côté serveur si upload réel
      _pdfFile: pdfFile,
    };

    onSave(updatedProduct); // callback pour mettre à jour la page
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">
            {language === 'fr' ? 'Modifier le produit' : 'Edit Product'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="font-medium">{language === 'fr' ? 'Nom' : 'Name'}</label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="font-medium">{language === 'fr' ? 'Applications (une par ligne)' : 'Applications (one per line)'}</label>
            <textarea
              className="w-full p-2 border rounded"
              rows={4}
              value={applications}
              onChange={e => setApplications(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="font-medium">{language === 'fr' ? 'Spécifications' : 'Specifications'}</label>
            <Input value={specifications} onChange={e => setSpecifications(e.target.value)} />
          </div>

          {/* Upload Image */}
          <div className="space-y-2">
            <label className="font-medium">{language === 'fr' ? 'Image du produit' : 'Product Image'}</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setImgFile(e.target.files?.[0] || null)}
            />
            {previewImg && (
              <img src={previewImg} alt="Preview" className="w-32 h-32 object-cover mt-2 border rounded" />
            )}
          </div>

          {/* Upload PDF */}
          <div className="space-y-2">
            <label className="font-medium">{language === 'fr' ? 'Fiche technique (PDF)' : 'Technical sheet (PDF)'}</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={e => setPdfFile(e.target.files?.[0] || null)}
            />
            {previewPdf && <p className="text-sm mt-1">{previewPdf}</p>}
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

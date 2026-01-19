import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { X } from 'lucide-react';

interface EditProductModalProps {
  product: any;
  onClose: () => void;
  onSave: (updatedProduct: any) => void;
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

  useEffect(() => {
    if (!imgFile) return;
    const reader = new FileReader();
    reader.onload = () => setPreviewImg(reader.result as string);
    reader.readAsDataURL(imgFile);
  }, [imgFile]);

  useEffect(() => {
    if (pdfFile) setPreviewPdf(pdfFile.name);
  }, [pdfFile]);

  const handleSave = () => {
    const updatedProduct = {
      ...product,
      produit: name,
      applications: applications.split('\n'),
      specifications,
      img: previewImg,
      pdf: previewPdf,
      _imgFile: imgFile,
      _pdfFile: pdfFile,
    };
    onSave(updatedProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <Card className="w-full max-w-xl rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <CardHeader className="flex justify-between items-center bg-primary/10 p-4">
          <CardTitle className="text-lg font-bold">
            {language === 'fr' ? 'Modifier le produit' : 'Edit Product'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5 text-muted-foreground" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <label className="font-medium">{language === 'fr' ? 'Nom' : 'Name'}</label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className="font-medium">{language === 'fr' ? 'Applications (une par ligne)' : 'Applications (one per line)'}</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 resize-none"
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
              className="w-full text-sm text-gray-600"
            />
            {previewImg && (
              <img
                src={previewImg}
                alt="Preview"
                className="w-32 h-32 object-cover mt-2 border rounded-lg shadow-sm"
              />
            )}
          </div>

          {/* Upload PDF */}
          <div className="space-y-2">
            <label className="font-medium">{language === 'fr' ? 'Fiche technique (PDF)' : 'Technical sheet (PDF)'}</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={e => setPdfFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-600"
            />
            {previewPdf && <p className="text-sm mt-1 text-primary font-medium">{previewPdf}</p>}
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <Button variant="secondary" onClick={handleSave} className="bg-primary text-white hover:bg-primary/90">
              {language === 'fr' ? 'Enregistrer' : 'Save'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              {language === 'fr' ? 'Annuler' : 'Cancel'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProductModal;

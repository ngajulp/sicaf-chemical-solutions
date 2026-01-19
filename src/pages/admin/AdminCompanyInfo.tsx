import { useEffect, useState, useRef } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Save, Loader2, Building2, Phone, Mail, Globe, MapPin, FileText, Upload, Image } from 'lucide-react';
import { getCompanyInfo, getCompanyInfoSha, updateCompanyInfo, uploadImageToGitHub } from '@/lib/github';

interface CompanyInfo {
  nomentreprise: string;
  boitepostate: string;
  siege: string;
  Telephone: string;
  email: string;
  siteweb: string;
  niu: string;
  rc: string;
  logo?: string;
}

const AdminCompanyInfo = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    nomentreprise: '',
    boitepostate: '',
    siege: '',
    Telephone: '',
    email: '',
    siteweb: '',
    niu: '',
    rc: '',
    logo: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sha, setSha] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const data = await getCompanyInfo();
      setCompanyInfo(data);
    } catch (error) {
      console.error('Error fetching company info:', error);
      toast.error('Erreur lors du chargement des informations');
    } finally {
      setLoading(false);
    }
  };

  const getShaForWrite = async (): Promise<string> => {
    if (sha) return sha;
    const fileSha = await getCompanyInfoSha();
    setSha(fileSha);
    return fileSha;
  };

  const handleLogoUpload = async (): Promise<string | null> => {
    if (!logoFile) return null;
    
    setUploadingLogo(true);
    try {
      const timestamp = Date.now();
      const fileName = `company_logo_${timestamp}_${logoFile.name}`;
      const result = await uploadImageToGitHub(logoFile, fileName);
      toast.success('Logo uploadé avec succès');
      return result.url;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Erreur lors de l\'upload du logo');
      return null;
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const currentSha = await getShaForWrite();
      
      let logoUrl = companyInfo.logo;
      if (logoFile) {
        const uploadedUrl = await handleLogoUpload();
        if (uploadedUrl) {
          logoUrl = uploadedUrl;
        }
      }

      const updatedInfo = { ...companyInfo, logo: logoUrl };
      const result = await updateCompanyInfo(updatedInfo, currentSha, 'Mise à jour des informations de l\'entreprise');
      setSha(result.newSha);
      setCompanyInfo(updatedInfo);
      setLogoFile(null);
      toast.success('Informations sauvegardées avec succès');
    } catch (error) {
      console.error('Error saving company info:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Informations de l'entreprise</h1>
            <p className="text-muted-foreground">Gérez les informations qui apparaissent sur les documents</p>
          </div>
          <Button onClick={handleSave} disabled={saving || uploadingLogo}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Enregistrer
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Main Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informations principales
              </CardTitle>
              <CardDescription>Nom et adresse de l'entreprise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nom de l'entreprise</Label>
                <Input
                  value={companyInfo.nomentreprise}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, nomentreprise: e.target.value })}
                  placeholder="Nom de l'entreprise"
                />
              </div>
              <div>
                <Label>Siège social</Label>
                <Input
                  value={companyInfo.siege}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, siege: e.target.value })}
                  placeholder="Ville"
                />
              </div>
              <div>
                <Label>Boîte postale</Label>
                <Input
                  value={companyInfo.boitepostate}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, boitepostate: e.target.value })}
                  placeholder="BP 12345"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Coordonnées
              </CardTitle>
              <CardDescription>Téléphone, email et site web</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Téléphone
                </Label>
                <Input
                  value={companyInfo.Telephone}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, Telephone: e.target.value })}
                  placeholder="+237 600 000 000"
                />
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  type="email"
                  value={companyInfo.email}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                  placeholder="contact@exemple.com"
                />
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Site web
                </Label>
                <Input
                  value={companyInfo.siteweb}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, siteweb: e.target.value })}
                  placeholder="www.exemple.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Legal Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informations légales
              </CardTitle>
              <CardDescription>NIU et Registre de commerce</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>NIU (Numéro d'Identification Unique)</Label>
                <Input
                  value={companyInfo.niu}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, niu: e.target.value })}
                  placeholder="NIU"
                />
              </div>
              <div>
                <Label>Registre de Commerce</Label>
                <Input
                  value={companyInfo.rc}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, rc: e.target.value })}
                  placeholder="RC"
                />
              </div>
            </CardContent>
          </Card>

          {/* Logo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Logo de l'entreprise
              </CardTitle>
              <CardDescription>Logo affiché sur les documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {companyInfo.logo && !logoFile && (
                  <img 
                    src={companyInfo.logo} 
                    alt="Logo actuel" 
                    className="h-20 w-20 object-contain border rounded-lg p-2"
                  />
                )}
                {logoFile && (
                  <div className="h-20 w-20 border rounded-lg p-2 flex items-center justify-center bg-muted">
                    <span className="text-xs text-center text-muted-foreground">{logoFile.name}</span>
                  </div>
                )}
                <div className="flex-1">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="w-full"
                  >
                    {uploadingLogo ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    {logoFile ? 'Changer le logo' : 'Sélectionner un logo'}
                  </Button>
                </div>
              </div>
              {logoFile && (
                <p className="text-sm text-muted-foreground">
                  Nouveau logo sélectionné. Cliquez sur "Enregistrer" pour appliquer.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCompanyInfo;

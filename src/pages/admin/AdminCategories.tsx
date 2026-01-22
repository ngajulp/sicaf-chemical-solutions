import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Save, X, Image as ImageIcon, Search, Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
// Import des services GitHub
import { 
  getIndustries, 
  updateIndustriesAndProducts, 
  deleteCategoryAndSyncProducts,
  uploadImageToGitHub 
} from '@/lib/github';

interface Category {
  ID: number;
  categorie: string;
  products: string[];
  expertise: string;
  description: string;
  img: string;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Category | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getIndustries();
      setCategories(data);
    } catch (error) {
      toast({ 
        title: "Erreur", 
        description: "Impossible de charger les catégories depuis GitHub.",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.ID);
    setFormData({ ...cat });
  };

  const handleAddNew = () => {
    const newCat: Category = {
      ID: 0, // ID à 0 pour indiquer une création au service
      categorie: "",
      products: [],
      expertise: "",
      description: "",
      img: ""
    };
    setEditingId(0);
    setFormData(newCat);
  };

  // Gestion de l'upload d'image spécifique à la catégorie
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !formData) return;
    
    setIsSaving(true);
    try {
      const file = e.target.files[0];
      // On utilise le nom de la catégorie (nettoyé) comme référence pour l'image
      const ref = formData.categorie.toLowerCase().replace(/\s+/g, '-');
      const { url } = await uploadImageToGitHub(file, `cat-${ref || 'new'}`);
      
      setFormData({ ...formData, img: url });
      toast({ title: "Image prête", description: "L'image a été uploadée avec succès." });
    } catch (error) {
      toast({ title: "Erreur Upload", description: "Impossible d'envoyer l'image.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const saveChanges = async () => {
    if (!formData || !formData.categorie) {
      toast({ title: "Attention", description: "Le nom de la catégorie est requis.", variant: "destructive" });
      return;
    }
    
    setIsSaving(true);
    try {
      // Le service gère l'ID (Max + 1) et la synchro avec products.json
      const result = await updateIndustriesAndProducts(formData);
      
      toast({
        title: "Succès",
        description: `Catégorie ${result.ID === formData.ID ? 'mise à jour' : 'créée'} et produits synchronisés.`,
      });
      
      setEditingId(null);
      await fetchCategories(); // Rechargement complet pour être à jour avec le SHA
    } catch (error) {
      toast({ 
        title: "Erreur de sauvegarde", 
        description: "Échec de la mise à jour sur GitHub.", 
        variant: "destructive" 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce secteur ? Les produits liés seront marqués 'Non classés'.")) return;
    
    setIsSaving(true);
    try {
      await deleteCategoryAndSyncProducts(id);
      toast({ title: "Supprimé", description: "Secteur retiré avec succès." });
      await fetchCategories();
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de la suppression.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.categorie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black uppercase italic tracking-tight text-slate-900">
              Manager les <span className="text-primary">Catégories</span>
            </h1>
            <p className="text-muted-foreground text-sm font-medium">Gestion des secteurs d'activité et expertise</p>
          </div>
          <Button 
            onClick={handleAddNew} 
            disabled={editingId !== null}
            className="bg-primary hover:bg-slate-900 gap-2 font-bold uppercase text-xs rounded-none shadow-lg h-11"
          >
            <Plus className="h-4 w-4" /> Ajouter un secteur
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher une catégorie industrielle..." 
            className="pl-10 bg-white rounded-none border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {(loading || isSaving) && (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Synchronisation GitHub...</p>
          </div>
        )}

        <div className="grid gap-4">
          {filteredCategories.map((cat) => (
            <Card key={cat.ID} className={`rounded-none border-y-0 border-r-0 border-l-[6px] transition-all ${editingId === cat.ID ? 'border-l-secondary shadow-md' : 'border-l-primary/20'}`}>
              <CardContent className="p-6">
                {editingId === cat.ID ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-primary tracking-wider">Nom de la Catégorie</label>
                        <Input 
                          value={formData?.categorie} 
                          className="rounded-none focus:border-secondary"
                          onChange={e => setFormData(prev => prev ? {...prev, categorie: e.target.value} : null)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-primary tracking-wider">Image (Upload ou URL)</label>
                        <div className="flex gap-2">
                          <Input 
                            value={formData?.img} 
                            className="rounded-none focus:border-secondary flex-1"
                            onChange={e => setFormData(prev => prev ? {...prev, img: e.target.value} : null)}
                            placeholder="URL de l'image"
                          />
                          <div className="relative">
                            <input 
                              type="file" 
                              className="absolute inset-0 opacity-0 cursor-pointer" 
                              onChange={handleImageUpload}
                              accept="image/*"
                            />
                            <Button variant="outline" className="rounded-none bg-slate-50"><Upload className="h-4 w-4" /></Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-primary tracking-wider">Expertise (Slogan court)</label>
                      <Input 
                        value={formData?.expertise} 
                        className="rounded-none focus:border-secondary"
                        onChange={e => setFormData(prev => prev ? {...prev, expertise: e.target.value} : null)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-primary tracking-wider">Description détaillée</label>
                      <Textarea 
                        value={formData?.description} 
                        className="rounded-none focus:border-secondary min-h-[100px]"
                        onChange={e => setFormData(prev => prev ? {...prev, description: e.target.value} : null)}
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button variant="ghost" onClick={() => {setEditingId(null); fetchCategories();}} className="font-bold uppercase text-[10px] rounded-none">Annuler</Button>
                      <Button onClick={saveChanges} disabled={isSaving} className="bg-secondary text-slate-900 hover:bg-slate-900 hover:text-white font-black uppercase text-[10px] gap-2 rounded-none px-6 shadow-lg">
                        <Save className="h-4 w-4" /> Enregistrer & Synchroniser
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 bg-slate-50 border rounded-none overflow-hidden flex-shrink-0">
                      {cat.img ? (
                        <img src={cat.img} alt={cat.categorie} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-200"><ImageIcon size={32} /></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-slate-900 text-white px-1.5 font-bold">ID: {cat.ID}</span>
                            <h3 className="text-lg font-black uppercase text-slate-900 leading-none">{cat.categorie}</h3>
                          </div>
                          <p className="text-primary font-bold italic text-xs mt-1">{cat.expertise}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)} className="h-8 w-8 hover:text-secondary"><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.ID)} className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                      <p className="text-slate-500 text-xs mt-2 line-clamp-2 italic">{cat.description || "Aucune description fournie."}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;

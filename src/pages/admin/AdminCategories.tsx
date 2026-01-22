import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Save, X, Image as ImageIcon, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout'; // Import du Layout

interface Category {
  ID: number;
  categorie: string;
  products: string[];
  expertise: string;
  description: string;
  img: string;
}

const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data/productsindustries.json';

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Category | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(GITHUB_RAW_URL);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast({ 
        title: "Erreur de chargement", 
        description: "Impossible de récupérer les données RAW.",
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
    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.ID)) + 1 : 1;
    const newCat: Category = {
      ID: newId,
      categorie: "Nouvelle Catégorie",
      products: [],
      expertise: "",
      description: "",
      img: ""
    };
    setEditingId(newId);
    setFormData(newCat);
    // On l'ajoute temporairement en haut de la liste pour l'édition
    setCategories([newCat, ...categories]);
  };

  const saveChanges = async () => {
    if (!formData) return;
    
    // TODO: Appel API GitHub pour mettre à jour productsindustries.json ET products.json
    console.log("Données à synchroniser :", formData);
    
    toast({
      title: "Mise à jour réussie",
      description: `La catégorie ${formData.categorie} est prête à être poussée sur GitHub.`,
    });
    
    setEditingId(null);
    setCategories(prev => prev.map(c => c.ID === formData.ID ? formData : c));
  };

  const filteredCategories = categories.filter(c => 
    c.categorie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header de la page */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black uppercase italic tracking-tight text-slate-900">
              Manager les <span className="text-primary">Catégories</span>
            </h1>
            <p className="text-muted-foreground text-sm font-medium">Gestion des secteurs d'activité et expertise</p>
          </div>
          <Button onClick={handleAddNew} className="bg-primary hover:bg-slate-900 gap-2 font-bold uppercase text-xs rounded-none shadow-lg h-11">
            <Plus className="h-4 w-4" /> Ajouter un secteur
          </Button>
        </div>

        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher une catégorie industrielle..." 
            className="pl-10 bg-white rounded-none border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lecture des données Raw...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredCategories.map((cat) => (
              <Card key={cat.ID} className={`rounded-none border-y-0 border-r-0 border-l-[6px] transition-all ${editingId === cat.ID ? 'border-l-secondary shadow-md' : 'border-l-primary/20'}`}>
                <CardContent className="p-6">
                  {editingId === cat.ID ? (
                    /* FORMULAIRE D'EDITION */
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
                          <label className="text-[10px] font-black uppercase text-primary tracking-wider">URL Image de fond</label>
                          <Input 
                            value={formData?.img} 
                            className="rounded-none focus:border-secondary"
                            onChange={e => setFormData(prev => prev ? {...prev, img: e.target.value} : null)}
                            placeholder="https://raw.githubusercontent.com/..."
                          />
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
                        <label className="text-[10px] font-black uppercase text-primary tracking-wider">Description détaillée du secteur</label>
                        <Textarea 
                          value={formData?.description} 
                          className="rounded-none focus:border-secondary min-h-[100px]"
                          onChange={e => setFormData(prev => prev ? {...prev, description: e.target.value} : null)}
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button variant="ghost" onClick={() => setEditingId(null)} className="font-bold uppercase text-[10px] rounded-none">Annuler</Button>
                        <Button onClick={saveChanges} className="bg-secondary text-slate-900 hover:bg-slate-900 hover:text-white font-black uppercase text-[10px] gap-2 rounded-none px-6">
                          <Save className="h-4 w-4" /> Enregistrer & Sync
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* AFFICHAGE SIMPLE */
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
                            <h3 className="text-lg font-black uppercase text-slate-900 leading-none">{cat.categorie}</h3>
                            <p className="text-primary font-bold italic text-xs mt-1">{cat.expertise}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)} className="h-8 w-8 hover:text-secondary"><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </div>
                        <p className="text-slate-500 text-xs mt-2 line-clamp-2 italic">{cat.description || "Aucune description fournie."}</p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {cat.products?.map((p, i) => (
                            <span key={i} className="text-[9px] bg-slate-100 border border-slate-200 px-2 py-0.5 font-bold text-slate-500 uppercase">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;

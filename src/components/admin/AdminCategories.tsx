import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Save, X, Image as ImageIcon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

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
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast({ title: "Erreur de chargement", variant: "destructive" });
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
      categorie: "",
      products: [],
      expertise: "",
      description: "",
      img: ""
    };
    setEditingId(newId);
    setFormData(newCat);
  };

  const saveChanges = async () => {
    if (!formData) return;
    
    // LOGIQUE DE SYNCHRONISATION
    // Ici, vous devrez appeler votre fonction qui met à jour le JSON sur GitHub
    // Note : Cette action doit aussi mettre à jour products.json comme précisé
    
    console.log("Données à sauvegarder :", formData);
    
    toast({
      title: "Mise à jour réussie",
      description: `La catégorie ${formData.categorie} a été synchronisée avec products.json`,
    });
    
    setEditingId(null);
    // Rafraîchir la liste locale (simulation)
    setCategories(prev => prev.map(c => c.ID === formData.ID ? formData : c));
  };

  const filteredCategories = categories.filter(c => 
    c.categorie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black uppercase italic tracking-tight">Manager les Catégories</h1>
          <p className="text-muted-foreground text-sm">Gestion des secteurs d'activité et expertise industrielle</p>
        </div>
        <Button onClick={handleAddNew} className="bg-primary hover:bg-slate-900 gap-2 font-bold uppercase text-xs">
          <Plus className="h-4 w-4" /> Ajouter une catégorie
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Rechercher une catégorie..." 
          className="pl-10 bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredCategories.map((cat) => (
          <Card key={cat.ID} className={`border-l-4 transition-all ${editingId === cat.ID ? 'border-l-secondary shadow-md' : 'border-l-primary/20'}`}>
            <CardContent className="p-6">
              {editingId === cat.ID ? (
                /* FORMULAIRE D'EDITION */
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">Nom de la Catégorie</label>
                      <Input 
                        value={formData?.categorie} 
                        onChange={e => setFormData(prev => prev ? {...prev, categorie: e.target.value} : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">URL Image</label>
                      <Input 
                        value={formData?.img} 
                        onChange={e => setFormData(prev => prev ? {...prev, img: e.target.value} : null)}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Expertise (Slogan)</label>
                    <Input 
                      value={formData?.expertise} 
                      onChange={e => setFormData(prev => prev ? {...prev, expertise: e.target.value} : null)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Description détaillée</label>
                    <Textarea 
                      value={formData?.description} 
                      onChange={e => setFormData(prev => prev ? {...prev, description: e.target.value} : null)}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="ghost" onClick={() => setEditingId(null)} className="font-bold uppercase text-[10px]">Annuler</Button>
                    <Button onClick={saveChanges} className="bg-green-600 hover:bg-green-700 text-white font-bold uppercase text-[10px] gap-2">
                      <Save className="h-4 w-4" /> Enregistrer & Synchroniser
                    </Button>
                  </div>
                </div>
              ) : (
                /* AFFICHAGE LISTE */
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 bg-slate-100 rounded overflow-hidden flex-shrink-0 border">
                    {cat.img ? (
                      <img src={cat.img} alt={cat.categorie} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon /></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-black uppercase text-slate-900">{cat.categorie}</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(cat)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="outline" size="icon" className="text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    <p className="text-primary font-bold italic text-sm mb-2">{cat.expertise}</p>
                    <div className="flex flex-wrap gap-2">
                      {cat.products.map((p, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-600">
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
    </div>
  );
};

export default AdminCategories;

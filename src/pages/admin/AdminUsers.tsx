import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Shield, User, Loader2, Plus, Edit, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { getUsers, getUsersSha, updateUsers } from '@/lib/github';
import { md5 } from 'js-md5';

interface UserData {
  id: number;
  login: string;
  pawd: string;
  isadmin: number;
}

const AdminUsers = () => {
  const { isAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sha, setSha] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Form states
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    isadmin: 0
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/dashboard');
      return;
    }

    fetchUsers();
  }, [isAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      const content = await getUsers();
      setUsers(content || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  // Get SHA only when needed for write operations
  const getShaForWrite = async (): Promise<string> => {
    if (sha) return sha;
    const fileSha = await getUsersSha();
    setSha(fileSha);
    return fileSha;
  };

  const resetForm = () => {
    setFormData({ login: '', password: '', isadmin: 0 });
    setEditingUser(null);
  };

  const handleAddUser = async () => {
    if (!formData.login || !formData.password) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Check if login already exists
    if (users.some(u => u.login === formData.login)) {
      toast.error('Ce nom d\'utilisateur existe déjà');
      return;
    }

    setSaving(true);
    try {
      const currentSha = await getShaForWrite();
      const newUser: UserData = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        login: formData.login,
        pawd: md5(formData.password),
        isadmin: formData.isadmin
      };

      const updatedUsers = [...users, newUser];
      const result = await updateUsers(updatedUsers, currentSha, `Ajout utilisateur: ${formData.login}`);
      setSha(result.newSha);
      toast.success('Utilisateur ajouté avec succès');
      setShowAddModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Erreur lors de l\'ajout de l\'utilisateur');
    } finally {
      setSaving(false);
    }
  };

  const handleEditUser = async () => {
    if (!formData.login) {
      toast.error('Le nom d\'utilisateur est obligatoire');
      return;
    }

    if (!editingUser) return;

    setSaving(true);
    try {
      const currentSha = await getShaForWrite();
      const updatedUser: UserData = {
        ...editingUser,
        login: formData.login,
        pawd: formData.password ? md5(formData.password) : editingUser.pawd,
        isadmin: formData.isadmin
      };

      const updatedUsers = users.map(u => 
        u.id === editingUser.id ? updatedUser : u
      );

      const result = await updateUsers(updatedUsers, currentSha, `Modification utilisateur: ${formData.login}`);
      setSha(result.newSha);
      toast.success('Utilisateur modifié avec succès');
      setShowEditModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Erreur lors de la modification de l\'utilisateur');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!editingUser) return;

    // Prevent deleting the last admin
    const adminCount = users.filter(u => u.isadmin === 1).length;
    if (editingUser.isadmin === 1 && adminCount <= 1) {
      toast.error('Impossible de supprimer le dernier administrateur');
      return;
    }

    setSaving(true);
    try {
      const currentSha = await getShaForWrite();
      const updatedUsers = users.filter(u => u.id !== editingUser.id);
      const result = await updateUsers(updatedUsers, currentSha, `Suppression utilisateur: ${editingUser.login}`);
      setSha(result.newSha);
      toast.success('Utilisateur supprimé avec succès');
      setShowDeleteModal(false);
      resetForm();
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Erreur lors de la suppression de l\'utilisateur');
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (user: UserData) => {
    setEditingUser(user);
    setFormData({
      login: user.login,
      password: '',
      isadmin: user.isadmin
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user: UserData) => {
    setEditingUser(user);
    setShowDeleteModal(true);
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Utilisateurs</h1>
            <p className="text-muted-foreground mt-1">
              Gestion des comptes utilisateurs ({users.length})
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un utilisateur
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Liste des utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">ID</TableHead>
                      <TableHead className="font-semibold">Login</TableHead>
                      <TableHead className="font-semibold">Rôle</TableHead>
                      <TableHead className="font-semibold">Mot de passe (Hash)</TableHead>
                      <TableHead className="font-semibold text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Badge variant="outline">{user.id}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {user.isadmin === 1 ? (
                              <Shield className="h-4 w-4 text-primary" />
                            ) : (
                              <User className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="font-medium">{user.login}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.isadmin === 1 ? "default" : "secondary"}
                          >
                            {user.isadmin === 1 ? 'Administrateur' : 'Utilisateur'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {user.pawd ? `${user.pawd.substring(0, 16)}...` : '(non défini)'}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => openEditModal(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => openDeleteModal(user)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add User Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un utilisateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nom d'utilisateur *</Label>
              <Input
                value={formData.login}
                onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                placeholder="Nom d'utilisateur"
              />
            </div>
            <div>
              <Label>Mot de passe *</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Mot de passe"
              />
            </div>
            <div>
              <Label>Rôle</Label>
              <Select 
                value={formData.isadmin.toString()} 
                onValueChange={(v) => setFormData({ ...formData, isadmin: parseInt(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Utilisateur</SelectItem>
                  <SelectItem value="1">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddModal(false); resetForm(); }}>
              Annuler
            </Button>
            <Button onClick={handleAddUser} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nom d'utilisateur *</Label>
              <Input
                value={formData.login}
                onChange={(e) => setFormData({ ...formData, login: e.target.value })}
              />
            </div>
            <div>
              <Label>Nouveau mot de passe (laisser vide pour ne pas changer)</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Nouveau mot de passe"
              />
            </div>
            <div>
              <Label>Rôle</Label>
              <Select 
                value={formData.isadmin.toString()} 
                onValueChange={(v) => setFormData({ ...formData, isadmin: parseInt(v) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Utilisateur</SelectItem>
                  <SelectItem value="1">Administrateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowEditModal(false); resetForm(); }}>
              Annuler
            </Button>
            <Button onClick={handleEditUser} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{editingUser?.login}</strong> ?
            Cette action est irréversible.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminUsers;

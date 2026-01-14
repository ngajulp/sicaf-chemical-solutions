import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { History, AlertTriangle, User, Calendar, Clock } from 'lucide-react';

interface HistoryEntry {
  id: number;
  date: string;
  action?: string;
}

interface UserData {
  id: number;
  login: string;
  isadmin: number;
}

const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data';

const AdminHistory = () => {
  const { isAdmin, isAuthenticated, loading } = useAdminAuth();
  const navigate = useNavigate();
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin');
    } else if (!loading && !isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, isAdmin, loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyRes, usersRes] = await Promise.all([
          fetch(`${GITHUB_BASE_URL}/history.json`),
          fetch(`${GITHUB_BASE_URL}/users.json`)
        ]);

        if (historyRes.ok) {
          const historyData = await historyRes.json();
          // Handle both single object and array format
          const entries = Array.isArray(historyData) ? historyData : [historyData];
          setHistoryEntries(entries);
        }

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setDataLoading(false);
      }
    };

    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const getUserById = (id: number): UserData | undefined => {
    return users.find(u => u.id === id);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return '';
    }
  };

  if (loading || !isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <History className="h-8 w-8 text-primary" />
            Historique des Connexions
          </h1>
          <p className="text-muted-foreground mt-2">
            Rapport détaillé des connexions administrateur
          </p>
        </div>
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Connexions</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{historyEntries.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(historyEntries.map(e => e.id)).size}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dernière Connexion</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {historyEntries.length > 0 
                  ? formatDate(historyEntries[historyEntries.length - 1].date)
                  : 'N/A'
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* History Table */}
        <Card>
          <CardHeader>
            <CardTitle>Journal des Connexions</CardTitle>
            <CardDescription>
              Liste détaillée de toutes les connexions administrateur avec identifiants utilisateurs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dataLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : historyEntries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun historique de connexion disponible
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">#</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyEntries.map((entry, index) => {
                    const user = getUserById(entry.id);
                    return (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {user?.login || `ID: ${entry.id}`}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user?.isadmin === 1 ? (
                            <Badge className="bg-primary">Administrateur</Badge>
                          ) : (
                            <Badge variant="secondary">Utilisateur</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {formatDate(entry.date)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {formatTime(entry.date)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            {entry.action || 'Connexion'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminHistory;

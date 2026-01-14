import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Users, 
  LogOut, 
  Menu, 
  X,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompanyInfo {
  nomentreprise: string;
  siege: string;
  Telephone: string;
  email: string;
}

interface AdminLayoutProps {
  children: ReactNode;
}

const GITHUB_BASE_URL = 'https://raw.githubusercontent.com/ngajulp/sicaf-chemical-solutions/main/public-data';

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout, loading, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin');
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const response = await fetch(`${GITHUB_BASE_URL}/infospersonnelles.json`);
        if (response.ok) {
          const data = await response.json();
          setCompanyInfo(data);
        }
      } catch (error) {
        console.error('Error fetching company info:', error);
      }
    };
    fetchCompanyInfo();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Produits', icon: Package },
    { path: '/admin/proforma', label: 'Proforma / Devis', icon: FileText },
    { path: '/admin/users', label: 'Utilisateurs', icon: Users, adminOnly: true },
  ];

  const filteredMenuItems = menuItems.filter(
    item => !item.adminOnly || user?.isadmin === 1
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="lg:hidden gradient-primary text-primary-foreground p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-primary-foreground hover:bg-primary-foreground/10"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        <span className="font-heading font-bold">SICAF Admin</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-primary-foreground hover:bg-primary-foreground/10"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 gradient-primary text-primary-foreground transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-primary-foreground/20">
              <div className="flex items-center gap-3">
                <img 
                  src={`${GITHUB_BASE_URL}/logo.png`} 
                  alt="SICAF Logo" 
                  className="w-10 h-10 object-contain bg-white rounded p-1"
                />
                <div>
                  <h1 className="font-heading font-bold text-lg">SICAF</h1>
                  <p className="text-xs text-primary-foreground/70">Administration</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {filteredMenuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                    {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                  </Link>
                );
              })}
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-primary-foreground/20">
              <div className="mb-4 px-4">
                <p className="text-sm text-primary-foreground/70">Connecté en tant que</p>
                <p className="font-medium">{user?.login}</p>
                <p className="text-xs text-primary-foreground/50">
                  {user?.isadmin === 1 ? 'Administrateur' : 'Utilisateur'}
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Déconnexion
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen lg:min-h-[calc(100vh)]">
          <div className="p-6">
            {/* Company Header */}
            {companyInfo && (
              <div className="mb-6 p-4 bg-card rounded-lg shadow-sm border">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="font-heading font-bold text-lg text-foreground">
                      {companyInfo.nomentreprise}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {companyInfo.siege} | {companyInfo.Telephone} | {companyInfo.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

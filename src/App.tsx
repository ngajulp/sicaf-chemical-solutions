import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Quote from "./pages/Quote";
import Catalog from "./pages/Catalog";
import ProductCategory from "./pages/ProductCategory";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCategories from "./pages/admin/AdminCategories"; // NOUVEL IMPORT
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductDetail from "./pages/admin/AdminProductDetail";
import AdminCompanyInfo from "./pages/admin/AdminCompanyInfo";
import AdminProforma from "./pages/admin/AdminProforma";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminHistory from "./pages/admin/AdminHistory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AdminAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/quote" element={<Quote />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/products/:categoryId" element={<ProductCategory />} />
              <Route path="/products/:categoryId/:reference" element={<ProductDetail />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              
              {/* GESTION DES CATÉGORIES (Insérée ici) */}
              <Route path="/admin/categories" element={<AdminCategories />} />
              
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/products/:categoryName/:reference" element={<AdminProductDetail />} />
              <Route path="/admin/company" element={<AdminCompanyInfo />} />
              <Route path="/admin/proforma" element={<AdminProforma />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/history" element={<AdminHistory />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AdminAuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

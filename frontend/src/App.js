import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/lib/auth";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

// Public Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProductsPage from "./pages/ProductsPage";
import ServicesPage from "./pages/ServicesPage";
import MachinesPage from "./pages/MachinesPage";
import InspectionPage from "./pages/InspectionPage";
import ContactPage from "./pages/ContactPage";

// Admin Pages
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHomePage from "./pages/admin/AdminHomePage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminServicesPage from "./pages/admin/AdminServicesPage";
import AdminMachinesPage from "./pages/admin/AdminMachinesPage";
import AdminInspectionPage from "./pages/admin/AdminInspectionPage";
import AdminClientLogosPage from "./pages/admin/AdminClientLogosPage";
import AdminMessagesPage from "./pages/admin/AdminMessagesPage";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

// Layout wrapper for public pages
const PublicLayout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return children;
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
      <Route path="/products" element={<PublicLayout><ProductsPage /></PublicLayout>} />
      <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
      <Route path="/machines" element={<PublicLayout><MachinesPage /></PublicLayout>} />
      <Route path="/inspections" element={<PublicLayout><InspectionPage /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="home" element={<AdminHomePage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="services" element={<AdminServicesPage />} />
        <Route path="machines" element={<AdminMachinesPage />} />
        <Route path="inspections" element={<AdminInspectionPage />} />
        <Route path="clients" element={<AdminClientLogosPage />} />
        <Route path="messages" element={<AdminMessagesPage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1E1E1E',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)'
              }
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;

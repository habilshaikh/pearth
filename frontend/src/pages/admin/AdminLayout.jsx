import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, Package, Wrench, Settings, ClipboardCheck, MessageSquare, Building2,
  LogOut, Menu, X, Image, Users
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: Home },
  { name: 'Home Content', path: '/admin/home', icon: Image },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Services', path: '/admin/services', icon: Wrench },
  { name: 'Machines', path: '/admin/machines', icon: Settings },
  { name: 'Inspection', path: '/admin/inspections', icon: ClipboardCheck },
  { name: 'Clients', path: '/admin/clients', icon: Building2 },
  { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#121212] flex" data-testid="admin-layout">
      {/* Sidebar */}
      <aside
        className={`admin-sidebar fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/5">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF6B00] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg font-['Poppins']">ST</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white font-['Poppins']">SAI TECH</h1>
                <p className="text-xs text-[#6E7A85]">Admin Panel</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === link.path
                    ? 'bg-[#FF6B00]/20 text-[#FF6B00]'
                    : 'text-[#A0AAB2] hover:bg-white/5 hover:text-white'
                }`}
                data-testid={`admin-nav-${link.name.toLowerCase().replace(' ', '-')}`}
              >
                <link.icon size={20} />
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
          </nav>

          {/* User & Logout */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-8 h-8 bg-[#2E2E2E] rounded-full flex items-center justify-center">
                <Users size={16} className="text-[#A0AAB2]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{user?.email || 'Admin'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              data-testid="admin-logout-btn"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-16 bg-[#1A1A1A] border-b border-white/5 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-white"
            data-testid="mobile-sidebar-toggle"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#A0AAB2] hover:text-white transition-colors"
            >
              View Website →
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

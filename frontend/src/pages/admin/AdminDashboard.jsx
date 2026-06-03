import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Wrench, Settings, ClipboardCheck, MessageSquare, Building2 } from 'lucide-react';
import { productsAPI, servicesAPI, machinesAPI, inspectionsAPI, contactAPI, logosAPI } from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    services: 0,
    machines: 0,
    inspections: 0,
    clients: 0,
    messages: 0,
    unreadMessages: 0
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [products, services, machines, inspections, logos, messages] = await Promise.all([
        productsAPI.getAll(),
        servicesAPI.getAll(),
        machinesAPI.getAll(),
        inspectionsAPI.getAll(),
        logosAPI.getAll(),
        contactAPI.getAll()
      ]);

      setStats({
        products: products.data.length,
        services: services.data.length,
        machines: machines.data.length,
        inspections: inspections.data.length,
        clients: logos.data.length,
        messages: messages.data.length,
        unreadMessages: messages.data.filter(m => !m.is_read).length
      });

      setRecentMessages(messages.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Products', value: stats.products, icon: Package, color: 'bg-blue-500/20 text-blue-400' },
    { title: 'Services', value: stats.services, icon: Wrench, color: 'bg-green-500/20 text-green-400' },
    { title: 'Machines', value: stats.machines, icon: Settings, color: 'bg-purple-500/20 text-purple-400' },
    { title: 'Inspection', value: stats.inspections, icon: ClipboardCheck, color: 'bg-cyan-500/20 text-cyan-400' },
    { title: 'Clients', value: stats.clients, icon: Building2, color: 'bg-emerald-500/20 text-emerald-400' },
    { title: 'Messages', value: stats.messages, icon: MessageSquare, color: 'bg-orange-500/20 text-orange-400', badge: stats.unreadMessages }
  ];

  return (
    <div data-testid="admin-dashboard">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white font-['Poppins']">Dashboard</h1>
        <p className="text-[#6E7A85] mt-1">Welcome back! Here's what's happening with your website.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="admin-card p-6"
            data-testid={`stat-card-${stat.title.toLowerCase()}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[#6E7A85] text-sm">{stat.title}</p>
                <p className="text-3xl font-bold text-white font-['Poppins'] mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center relative`}>
                <stat.icon size={24} />
                {stat.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {stat.badge}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Messages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="admin-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white font-['Poppins']">Recent Messages</h2>
          <a href="/admin/messages" className="text-[#FF6B00] text-sm hover:underline">
            View All →
          </a>
        </div>

        {recentMessages.length === 0 ? (
          <p className="text-[#6E7A85] text-center py-8">No messages yet</p>
        ) : (
          <div className="space-y-4">
            {recentMessages.map((message, index) => (
              <div
                key={message.id}
                className={`p-4 rounded-lg border ${
                  message.is_read ? 'border-white/5 bg-white/5' : 'border-[#FF6B00]/30 bg-[#FF6B00]/5'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-medium">{message.name}</p>
                    <p className="text-[#6E7A85] text-sm">{message.email}</p>
                  </div>
                  <span className="text-[#6E7A85] text-xs">
                    {new Date(message.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-[#A0AAB2] text-sm mt-2 line-clamp-2">{message.message}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

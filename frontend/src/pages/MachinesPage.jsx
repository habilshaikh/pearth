import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import { machinesAPI } from '@/lib/api';
import { PageHeader, LoadingSpinner, SectionTitle } from '@/components/ui-custom';

export default function MachinesPage() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      const response = await machinesAPI.getAll();
      const data = Array.isArray(response.data) ? response.data : [];
      setMachines(data.sort((a, b) => (a.sort_order ?? 9999) - (b.sort_order ?? 9999)));
    } catch (error) {
      console.error('Error fetching machines:', error);
      setMachines([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#121212]" data-testid="machines-page">
      <PageHeader
        title="Our Machines"
        subtitle="State-of-the-art CNC equipment for precision manufacturing"
        backgroundImage="https://images.unsplash.com/photo-1720036236694-d0a231c52563?w=1920&q=80"
      />

      {/* Machines Table */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <SectionTitle subtitle="Equipment List">
            Our CNC Fleet
          </SectionTitle>

          {machines.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#A0AAB2] text-lg">No machines listed at the moment.</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-x-auto rounded-xl border border-white/10"
            >
              <table className="machines-table" data-testid="machines-table">
                <thead>
                  <tr>
                    <th className="rounded-tl-xl">Machine</th>
                    <th>Capacity</th>
                    <th className="rounded-tr-xl">Specifications</th>
                  </tr>
                </thead>
                <tbody>
                  {machines.map((machine, index) => (
                    <motion.tr
                      key={machine.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      data-testid={`machine-row-${index}`}
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#FF6B00]/20 flex items-center justify-center">
                            <Settings size={18} className="text-[#FF6B00]" />
                          </div>
                          <span className="font-semibold text-white">{machine.name}</span>
                        </div>
                      </td>
                      <td className="text-[#A0AAB2]">{machine.capacity}</td>
                      <td className="text-[#6E7A85]">{machine.specs || '-'}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </div>
      </section>

      
    </div>
  );
}

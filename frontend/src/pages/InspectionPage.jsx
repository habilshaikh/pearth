import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, CheckCircle2, FileText, Gauge, Shield } from 'lucide-react';
import { inspectionsAPI } from '@/lib/api';
import { PageHeader, LoadingSpinner, SectionTitle } from '@/components/ui-custom';

const inspectionHighlights = [
  { title: 'Inspection Reports', desc: 'Full dimensional layouts for critical and first-off parts', icon: FileText },
  { title: 'In-Process Control', desc: 'Stage-wise checks during turning, milling', icon: Gauge },
  { title: 'Final Release', desc: 'Dispatch approval with signed verification records', icon: CheckCircle2 },
  { title: 'Traceability', desc: 'Material, process, and inspection records linked together', icon: Shield },
];

export default function InspectionPage() {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    try {
      const response = await inspectionsAPI.getAll();
      setInspections(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching inspections:', error);
      setInspections([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#121212]" data-testid="inspection-page">
      <PageHeader
        title="Inspection & Quality"
        subtitle="Structured inspection workflows, traceable reports, and reliable verification for every precision component."
        backgroundImage="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1920&q=80"
      />

      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <SectionTitle subtitle="Quality Control Matrix">
            Inspection Capabilities
          </SectionTitle>

          {inspections.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#A0AAB2] text-lg">No inspection capabilities listed at the moment.</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-x-auto rounded-xl border border-white/10"
            >
              <table className="machines-table" data-testid="inspection-table">
                <thead>
                  <tr>
                    <th className="rounded-tl-xl">Sr. No.</th>
                    <th>Description</th>
                    <th className="rounded-tr-xl">Range</th>
                  </tr>
                </thead>
                <tbody>
                  {inspections.map((inspection, index) => (
                    <motion.tr
                      key={inspection.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      data-testid={`inspection-row-${index}`}
                    >
                      <td className="text-[#6E7A85] text-center">{index + 1}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#FF6B00]/20 flex items-center justify-center">
                            <ClipboardCheck size={18} className="text-[#FF6B00]" />
                          </div>
                          <span className="font-semibold text-white">{inspection.name}</span>
                        </div>
                      </td>
                      <td className="text-[#A0AAB2]">{inspection.equipment}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-24 px-6 lg:px-12 bg-[#0B1F3A]/30">
        <div className="max-w-7xl mx-auto">
          <SectionTitle subtitle="Assurance Process" center>
            Inspection Workflow
          </SectionTitle>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {inspectionHighlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-glass p-6 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#FF6B00]/15 flex items-center justify-center mx-auto mb-4">
                  <item.icon size={24} className="text-[#FF6B00]" />
                </div>
                <h3 className="text-xl font-bold text-white font-['Poppins'] mb-2">{item.title}</h3>
                <p className="text-[#A0AAB2]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, ClipboardCheck } from 'lucide-react';
import { inspectionsAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function AdminInspectionPage() {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingInspection, setEditingInspection] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    equipment: '',
  });

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

  const openModal = (inspection = null) => {
    if (inspection) {
      setEditingInspection(inspection);
      setFormData({
        name: inspection.name,
        equipment: inspection.equipment,
      });
    } else {
      setEditingInspection(null);
      setFormData({ name: '', equipment: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingInspection(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.equipment) {
      toast.error('Description and Range are required');
      return;
    }

    setSaving(true);
    try {
      if (editingInspection) {
        await inspectionsAPI.update(editingInspection.id, formData);
        toast.success('Inspection updated successfully!');
      } else {
        await inspectionsAPI.create(formData);
        toast.success('Inspection created successfully!');
      }
      closeModal();
      fetchInspections();
    } catch (error) {
      toast.error('Failed to save inspection');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this inspection item?')) {
      try {
        await inspectionsAPI.delete(id);
        toast.success('Inspection deleted successfully!');
        fetchInspections();
      } catch (error) {
        toast.error('Failed to delete inspection');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div data-testid="admin-inspection-page">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white font-['Poppins']">Inspection</h1>
          <p className="text-[#6E7A85] mt-1">Manage your quality control and inspection list</p>
        </div>
        <Button
          onClick={() => openModal()}
          className="bg-[#FF6B00] hover:bg-[#e55f00] flex items-center gap-2"
          data-testid="add-inspection-btn"
        >
          <Plus size={18} />
          Add Inspection
        </Button>
      </div>

      {inspections.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <p className="text-[#6E7A85]">No inspection items yet. Add your first one!</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-card overflow-hidden"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-[#FF6B00] font-semibold">Description</th>
                <th className="text-left p-4 text-[#FF6B00] font-semibold">Range</th>
                <th className="text-right p-4 text-[#FF6B00] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inspections.map((inspection, index) => (
                <tr
                  key={inspection.id}
                  className="border-b border-white/5 hover:bg-white/5"
                  data-testid={`inspection-row-${index}`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#FF6B00]/20 flex items-center justify-center">
                        <ClipboardCheck size={18} className="text-[#FF6B00]" />
                      </div>
                      <span className="text-white font-medium">{inspection.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[#A0AAB2]">{inspection.equipment}</td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-end">
                      <Button
                        onClick={() => openModal(inspection)}
                        variant="outline"
                        size="sm"
                        className="border-white/10 hover:bg-white/5"
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        onClick={() => handleDelete(inspection.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#1E1E1E] rounded-xl w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white font-['Poppins']">
                  {editingInspection ? 'Edit Inspection' : 'Add Inspection'}
                </h2>
                <button onClick={closeModal} className="text-[#6E7A85] hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-[#A0AAB2] mb-2">Description *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Digital Vernier"
                    className="bg-[#2E2E2E]/60 border-white/10"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#A0AAB2] mb-2">Range *</label>
                  <Input
                    name="equipment"
                    value={formData.equipment}
                    onChange={handleChange}
                    placeholder="e.g. 0-500mm"
                    className="bg-[#2E2E2E]/60 border-white/10"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-white/10 flex gap-3 justify-end">
                <Button onClick={closeModal} variant="outline" className="border-white/10">
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#FF6B00] hover:bg-[#e55f00]"
                >
                  {saving ? 'Saving...' : 'Save Inspection'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

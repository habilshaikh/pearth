import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Settings, ChevronUp, ChevronDown } from 'lucide-react';
import { machinesAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function AdminMachinesPage() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMachine, setEditingMachine] = useState(null);
  const [saving, setSaving] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    specs: ''
  });

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
    } finally {
      setLoading(false);
    }
  };

  const saveBackendReorder = async (orderedMachines) => {
    setReordering(true);
    try {
      await machinesAPI.reorder(orderedMachines.map((machine, index) => ({
        id: machine.id,
        sort_order: index,
      })));
    } catch (error) {
      console.error('Machine reorder failed:', error);
      toast.error('Machine order save nahi hua, dobara try karo');
      fetchMachines();
    } finally {
      setReordering(false);
    }
  };

  const moveMachine = async (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= machines.length || reordering) return;

    const nextMachines = [...machines];
    [nextMachines[index], nextMachines[nextIndex]] = [nextMachines[nextIndex], nextMachines[index]];
    setMachines(nextMachines);
    await saveBackendReorder(nextMachines);
  };

  const openModal = (machine = null) => {
    if (machine) {
      setEditingMachine(machine);
      setFormData({
        name: machine.name,
        capacity: machine.capacity,
        specs: machine.specs || ''
      });
    } else {
      setEditingMachine(null);
      setFormData({ name: '', capacity: '', specs: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMachine(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.capacity) {
      toast.error('Name and capacity are required');
      return;
    }

    setSaving(true);
    try {
      if (editingMachine) {
        await machinesAPI.update(editingMachine.id, formData);
        toast.success('Machine updated successfully!');
      } else {
        await machinesAPI.create(formData);
        toast.success('Machine created successfully!');
      }
      closeModal();
      fetchMachines();
    } catch (error) {
      toast.error('Failed to save machine');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this machine?')) {
      try {
        await machinesAPI.delete(id);
        toast.success('Machine deleted successfully!');
        fetchMachines();
      } catch (error) {
        toast.error('Failed to delete machine');
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
    <div data-testid="admin-machines-page">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white font-['Poppins']">Machines</h1>
          <p className="text-[#6E7A85] mt-1">Manage your equipment list</p>
          {reordering && <p className="text-[#FF6B00] text-sm mt-2">Saving priority...</p>}
        </div>
        <Button
          onClick={() => openModal()}
          className="bg-[#FF6B00] hover:bg-[#e55f00] flex items-center gap-2"
          data-testid="add-machine-btn"
        >
          <Plus size={18} />
          Add Machine
        </Button>
      </div>

      {/* Machines Table */}
      {machines.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <p className="text-[#6E7A85]">No machines yet. Add your first machine!</p>
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
                <th className="text-left p-4 text-[#FF6B00] font-semibold">Priority</th>
                <th className="text-left p-4 text-[#FF6B00] font-semibold">Machine</th>
                <th className="text-left p-4 text-[#FF6B00] font-semibold">Capacity</th>
                <th className="text-left p-4 text-[#FF6B00] font-semibold">Specs</th>
                <th className="text-right p-4 text-[#FF6B00] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {machines.map((machine, index) => (
                <tr
                  key={machine.id}
                  className="border-b border-white/5 hover:bg-white/5"
                  data-testid={`machine-row-${index}`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-white/70 text-sm w-7">#{index + 1}</span>
                      <button
                        onClick={() => moveMachine(index, -1)}
                        disabled={index === 0 || reordering}
                        className="w-8 h-8 rounded-lg bg-white/5 text-white disabled:text-white/20 disabled:cursor-not-allowed hover:bg-[#FF6B00] transition-colors"
                        title="Move up"
                      >
                        <ChevronUp size={16} className="mx-auto" />
                      </button>
                      <button
                        onClick={() => moveMachine(index, 1)}
                        disabled={index === machines.length - 1 || reordering}
                        className="w-8 h-8 rounded-lg bg-white/5 text-white disabled:text-white/20 disabled:cursor-not-allowed hover:bg-[#FF6B00] transition-colors"
                        title="Move down"
                      >
                        <ChevronDown size={16} className="mx-auto" />
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#FF6B00]/20 flex items-center justify-center">
                        <Settings size={18} className="text-[#FF6B00]" />
                      </div>
                      <span className="text-white font-medium">{machine.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[#A0AAB2]">{machine.capacity}</td>
                  <td className="p-4 text-[#6E7A85]">{machine.specs || '-'}</td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-end">
                      <Button
                        onClick={() => openModal(machine)}
                        variant="outline"
                        size="sm"
                        className="border-white/10 hover:bg-white/5"
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        onClick={() => handleDelete(machine.id)}
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

      {/* Modal */}
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
                  {editingMachine ? 'Edit Machine' : 'Add Machine'}
                </h2>
                <button onClick={closeModal} className="text-[#6E7A85] hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-[#A0AAB2] mb-2">Machine Name *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Mazak Integrex i-200"
                    className="bg-[#2E2E2E]/60 border-white/10"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#A0AAB2] mb-2">Capacity *</label>
                  <Input
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="Max turning dia: 658mm"
                    className="bg-[#2E2E2E]/60 border-white/10"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#A0AAB2] mb-2">Specifications</label>
                  <Textarea
                    name="specs"
                    value={formData.specs}
                    onChange={handleChange}
                    rows={2}
                    placeholder="5-axis, Live tooling, Y-axis"
                    className="bg-[#2E2E2E]/60 border-white/10 resize-none"
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
                  {saving ? 'Saving...' : 'Save Machine'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

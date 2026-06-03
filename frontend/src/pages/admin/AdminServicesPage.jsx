import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Image, Upload, CheckCircle } from 'lucide-react';
import { servicesAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// ── Drag & Drop Image Upload Component ──────────────────────────────────────
function ImageDropZone({ value, onChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(value || null); // value = existing URL string or null
  const inputRef = useRef(null);

  // Keep preview in sync if parent resets formData
  useEffect(() => {
    if (!value) setPreview(null);
  }, [value]);

  const processFile = useCallback((file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed (jpg, png, gif, webp)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setPreview(dataUrl);
      onChange(dataUrl); // pass base64 dataURL up to parent
    };
    reader.onerror = () => toast.error('Could not read file, please try again');
    reader.readAsDataURL(file);
  }, [onChange]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  }, [processFile]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e) => {
    processFile(e.target.files?.[0]);
    // reset input so same file can be re-selected
    e.target.value = '';
  };

  const clearImage = (e) => {
    e.stopPropagation();
    setPreview(null);
    onChange('');
  };

  return (
    <div>
      <label className="block text-sm text-[#A0AAB2] mb-2">
        Service Image
      </label>

      {preview ? (
        // ── Preview State ──
        <div className="relative rounded-xl overflow-hidden border border-white/10 group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-44 object-cover"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-[#FF6B00] hover:bg-[#e55f00] text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Upload size={14} />
              Change Image
            </button>
            <button
              type="button"
              onClick={clearImage}
              className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 transition-colors"
            >
              <X size={14} />
              Remove
            </button>
          </div>
          {/* Success badge */}
          <div className="absolute top-2 right-2 bg-green-500/90 rounded-full p-1">
            <CheckCircle size={14} className="text-white" />
          </div>
        </div>
      ) : (
        // ── Drop Zone State ──
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`
            relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200
            flex flex-col items-center justify-center gap-3 py-10 px-6 text-center
            ${isDragging
              ? 'border-[#FF6B00] bg-[#FF6B00]/10 scale-[1.02]'
              : 'border-white/15 bg-[#2E2E2E]/40 hover:border-[#FF6B00]/50 hover:bg-[#2E2E2E]/70'
            }
          `}
        >
          {/* Animated upload icon */}
          <div className={`
            w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200
            ${isDragging ? 'bg-[#FF6B00]/20 scale-110' : 'bg-white/5'}
          `}>
            <Upload
              size={24}
              className={isDragging ? 'text-[#FF6B00]' : 'text-[#6E7A85]'}
            />
          </div>

          <div>
            <p className={`text-sm font-medium transition-colors ${isDragging ? 'text-[#FF6B00]' : 'text-[#A0AAB2]'}`}>
              {isDragging ? 'Drop it here!' : 'Drag & drop your image here'}
            </p>
            <p className="text-xs text-[#6E7A85] mt-1">
              or{' '}
              <span className="text-[#FF6B00] underline underline-offset-2">
                browse files
              </span>
              {' '}· JPG, PNG, GIF, WEBP · Max 5MB
            </p>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: ''
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description,
        image_url: service.image_url || ''
      });
    } else {
      setEditingService(null);
      setFormData({ name: '', description: '', image_url: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingService(null);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Called by ImageDropZone with base64 string or ''
  const handleImageChange = (dataUrl) => {
    setFormData((prev) => ({ ...prev, image_url: dataUrl }));
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Name and description are required');
      return;
    }

    setSaving(true);
    try {
      if (editingService) {
        await servicesAPI.update(editingService.id, formData);
        toast.success('Service updated successfully!');
      } else {
        await servicesAPI.create(formData);
        toast.success('Service created successfully!');
      }
      closeModal();
      fetchServices();
    } catch (error) {
      toast.error('Failed to save service, please try again');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await servicesAPI.delete(id);
      toast.success('Service deleted successfully!');
      fetchServices();
    } catch (error) {
      toast.error('Failed to delete service');
      console.error('Delete error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div data-testid="admin-services-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white font-['Poppins']">Services</h1>
          <p className="text-[#6E7A85] mt-1">Manage your service offerings</p>
        </div>
        <Button
          onClick={() => openModal()}
          className="bg-[#FF6B00] hover:bg-[#e55f00] flex items-center gap-2"
          data-testid="add-service-btn"
        >
          <Plus size={18} />
          Add Service
        </Button>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <p className="text-[#6E7A85]">No services yet. Add your first service!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="admin-card overflow-hidden"
              data-testid={`service-item-${index}`}
            >
              <div className="aspect-video bg-[#2E2E2E] relative">
                {service.image_url ? (
                  <img
                    src={service.image_url}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image size={40} className="text-[#6E7A85]" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-white font-['Poppins'] mb-2">
                  {service.name}
                </h3>
                <p className="text-[#6E7A85] text-sm line-clamp-2 mb-4">
                  {service.description}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => openModal(service)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-white/10 hover:bg-white/5"
                  >
                    <Pencil size={14} className="mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(service.id)}
                    variant="outline"
                    size="sm"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
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
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white font-['Poppins']">
                  {editingService ? 'Edit Service' : 'Add Service'}
                </h2>
                <button onClick={closeModal} className="text-[#6E7A85] hover:text-white">
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body — scrollable */}
              <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
                {/* Name */}
                <div>
                  <label className="block text-sm text-[#A0AAB2] mb-2">Name *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Service name"
                    className="bg-[#2E2E2E]/60 border-white/10"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm text-[#A0AAB2] mb-2">Description *</label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Service description..."
                    className="bg-[#2E2E2E]/60 border-white/10 resize-none"
                  />
                </div>

                {/* ── Drag & Drop Upload (Image URL replace) ── */}
                <ImageDropZone
                  value={formData.image_url}
                  onChange={handleImageChange}
                />
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/10 flex gap-3 justify-end">
                <Button
                  onClick={closeModal}
                  variant="outline"
                  className="border-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#FF6B00] hover:bg-[#e55f00]"
                >
                  {saving ? 'Saving...' : 'Save Service'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

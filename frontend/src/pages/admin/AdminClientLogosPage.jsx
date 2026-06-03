import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Building2, Image as ImageIcon, Upload } from 'lucide-react';
import { logosAPI, resolveMediaUrl, uploadAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function AdminClientLogosPage() {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLogo, setEditingLogo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    image_url: '',
  });

  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    try {
      const response = await logosAPI.getAll();
      setLogos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching client logos:', error);
      toast.error('Failed to load clients');
      setLogos([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (logo = null) => {
    if (logo) {
      setEditingLogo(logo);
      setFormData({
        name: logo.name || '',
        image_url: logo.image_url || logo.imageUrl || '',
      });
    } else {
      setEditingLogo(null);
      setFormData({
        name: '',
        image_url: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingLogo(null);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const setLogoImage = (imageUrl) => {
    setFormData((prev) => ({ ...prev, image_url: imageUrl }));
  };

  const handleLogoUpload = async (files) => {
    const [file] = Array.from(files || []).filter((item) => item.type?.startsWith('image/'));

    if (!file) {
      toast.error('Please choose an image file');
      return;
    }

    setUploadingLogo(true);
    try {
      const response = await uploadAPI.upload(file, 'logos');
      setLogoImage(response.data?.imageUrl || '');
      toast.success('Logo uploaded successfully!');
    } catch (error) {
      console.error('Logo upload error:', error);
      toast.error(error.response?.data?.error || 'Failed to upload logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    await handleLogoUpload(e.dataTransfer.files);
  };

  const handleFileInput = async (e) => {
    await handleLogoUpload(e.target.files);
    e.target.value = '';
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Client name is required');
      return;
    }

    setSaving(true);
    try {
      if (editingLogo) {
        await logosAPI.update(editingLogo.id, formData);
        toast.success('Client updated successfully!');
      } else {
        await logosAPI.create(formData);
        toast.success('Client added successfully!');
      }
      closeModal();
      fetchLogos();
    } catch (error) {
      console.error('Save client error:', error);
      toast.error('Failed to save client');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client?')) {
      return;
    }

    try {
      await logosAPI.delete(id);
      toast.success('Client deleted successfully!');
      fetchLogos();
    } catch (error) {
      console.error('Delete client error:', error);
      toast.error('Failed to delete client');
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
    <div data-testid="admin-client-logos-page">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white font-['Poppins']">Clients</h1>
          <p className="text-[#6E7A85] mt-1">Homepage trusted client section yahin se dynamic chalega</p>
        </div>
        <Button
          onClick={() => openModal()}
          className="bg-[#FF6B00] hover:bg-[#e55f00] flex items-center gap-2"
          data-testid="add-client-btn"
        >
          <Plus size={18} />
          Add Client
        </Button>
      </div>

      {logos.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <p className="text-[#6E7A85]">No clients added yet. Add your first client!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {logos.map((logo, index) => {
            const imageUrl = resolveMediaUrl(logo.image_url || logo.imageUrl);
            const hasImage = Boolean(imageUrl);

            return (
              <motion.div
                key={logo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="admin-card p-5"
                data-testid={`client-item-${index}`}
              >
                <div className="rounded-xl border border-white/10 bg-[#2E2E2E]/40 p-4 mb-4 min-h-[110px] flex items-center justify-center">
                  {hasImage ? (
                    <img
                      src={imageUrl}
                      alt={logo.name}
                      className="max-h-14 w-auto object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="w-12 h-12 rounded-xl bg-[#FF6B00]/15 flex items-center justify-center">
                        <Building2 size={22} className="text-[#FF6B00]" />
                      </div>
                      <p className="text-white font-semibold">{logo.name}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-white font-['Poppins'] truncate">{logo.name}</h3>
                    <p className="text-[#6E7A85] text-sm mt-1">
                      {hasImage ? 'Showing as logo image on homepage' : 'Showing as text badge on homepage'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => openModal(logo)}
                      variant="outline"
                      size="sm"
                      className="border-white/10 hover:bg-white/5"
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      onClick={() => handleDelete(logo.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#1E1E1E] rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
                <h2 className="text-xl font-bold text-white font-['Poppins']">
                  {editingLogo ? 'Edit Client' : 'Add Client'}
                </h2>
                <button onClick={closeModal} className="text-[#6E7A85] hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-sm text-[#A0AAB2] mb-2">Client Name *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Welspun Speciality Solution Ltd"
                    className="bg-[#2E2E2E]/60 border-white/10"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#A0AAB2] mb-2">Upload Logo</label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !uploadingLogo && fileInputRef.current?.click()}
                    className={`
                      border-2 border-dashed rounded-xl p-6 text-center cursor-pointer
                      transition-all duration-200 select-none
                      ${isDragging
                        ? 'border-[#FF6B00] bg-[#FF6B00]/10 scale-[1.01]'
                        : 'border-white/15 hover:border-[#FF6B00]/40 hover:bg-white/5'
                      }
                      ${uploadingLogo ? 'opacity-70 cursor-wait' : ''}
                    `}
                  >
                    <Upload
                      size={28}
                      className={`mx-auto mb-3 transition-colors ${isDragging ? 'text-[#FF6B00]' : 'text-[#6E7A85]'}`}
                    />
                    <p className="text-white font-medium text-sm mb-1">
                      {uploadingLogo ? 'Uploading logo...' : isDragging ? 'Drop logo here' : 'Drag & drop logo here'}
                    </p>
                    <p className="text-[#6E7A85] text-xs">
                      or <span className="text-[#FF6B00] underline">browse file</span> - PNG, JPG, JPEG, WEBP, SVG
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#A0AAB2] mb-2">Logo Image URL</label>
                  <Input
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                    className="bg-[#2E2E2E]/60 border-white/10"
                  />
                  <p className="text-xs text-[#6E7A85] mt-2">
                    Optional. Drag-and-drop upload karo ya direct URL paste karo. Empty chhodoge to homepage par text badge dikhega.
                  </p>
                </div>

                {formData.image_url ? (
                  <div className="rounded-xl border border-white/10 bg-[#2E2E2E]/40 p-4 min-h-[110px]">
                    <div className="flex items-center justify-center min-h-[72px]">
                      <img
                        src={resolveMediaUrl(formData.image_url)}
                        alt={formData.name || 'Client logo preview'}
                        className="max-h-16 w-auto object-contain"
                      />
                    </div>
                    <div className="flex justify-end mt-3">
                      <Button
                        type="button"
                        onClick={() => setLogoImage('')}
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        Remove Logo
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-white/10 bg-[#2E2E2E]/30 p-6 text-center">
                    <ImageIcon size={22} className="text-[#6E7A85] mx-auto mb-3" />
                    <p className="text-sm text-[#6E7A85]">Logo URL optional hai</p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-white/10 flex gap-3 justify-end shrink-0 bg-[#1E1E1E]">
                <Button onClick={closeModal} variant="outline" className="border-white/10">
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving || uploadingLogo}
                  className="bg-[#FF6B00] hover:bg-[#e55f00]"
                >
                  {uploadingLogo ? 'Uploading Logo...' : saving ? 'Saving...' : 'Save Client'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

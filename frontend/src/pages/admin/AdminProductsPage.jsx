import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Image, Upload, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { productsAPI, resolveMediaUrl } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [reordering, setReordering] = useState(false);
  const fileInputRef = useRef(null);

  // Drag state
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const dragNode = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    specs: '',
    applications: '',
    quality_note: '',
    images: []
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      const data = response.data;
      let arr = Array.isArray(data) ? data : data?.products || data?.data || [];
      arr = arr.sort((a, b) => (a.sort_order ?? 9999) - (b.sort_order ?? 9999));
      setProducts(arr);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // ─── Backend Save ───────────────────────────────────────────────
  const saveBackendReorder = async (orderedProducts) => {
    setReordering(true);
    try {
      const orderData = orderedProducts.map((p, i) => ({ id: p.id, sort_order: i }));
      await productsAPI.reorder(orderData);
    } catch (error) {
      console.error('Reorder failed:', error);
      toast.error('Order save nahi hua, dobara try karo');
      fetchProducts();
    } finally {
      setReordering(false);
    }
  };

  // ─── Arrow Buttons ───────────────────────────────────────────────
  const moveUp = async (index) => {
    if (index === 0 || reordering) return;
    const newProducts = [...products];
    [newProducts[index - 1], newProducts[index]] = [newProducts[index], newProducts[index - 1]];
    setProducts(newProducts);
    await saveBackendReorder(newProducts);
  };

  const moveDown = async (index) => {
    if (index === products.length - 1 || reordering) return;
    const newProducts = [...products];
    [newProducts[index], newProducts[index + 1]] = [newProducts[index + 1], newProducts[index]];
    setProducts(newProducts);
    await saveBackendReorder(newProducts);
  };

  // ─── Drag & Drop ────────────────────────────────────────────────
  const handleDragStart = (e, index) => {
    dragNode.current = e.currentTarget;
    setDraggedIndex(index);
    // Small delay so ghost image renders correctly
    setTimeout(() => {
      if (dragNode.current) dragNode.current.style.opacity = '0.4';
    }, 0);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    if (index === draggedIndex) return;
    setDragOverIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      handleDragEnd();
      return;
    }
    const newProducts = [...products];
    const [moved] = newProducts.splice(draggedIndex, 1);
    newProducts.splice(dropIndex, 0, moved);
    setProducts(newProducts);
    handleDragEnd();
    await saveBackendReorder(newProducts);
  };

  const handleDragEnd = () => {
    if (dragNode.current) dragNode.current.style.opacity = '1';
    dragNode.current = null;
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // ─── Modal ───────────────────────────────────────────────────────
  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        specs: product.specs || '',
        applications: product.applications || '',
        quality_note: product.quality_note || '',
        images: product.images?.map(img => img.image_url) || []
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', specs: '', applications: '', quality_note: '', images: [] });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const processFiles = (files) => {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 800;
          let { width, height } = img;
          if (width > height && width > MAX_SIZE) { height = (height * MAX_SIZE) / width; width = MAX_SIZE; }
          else if (height > MAX_SIZE) { width = (width * MAX_SIZE) / height; height = MAX_SIZE; }
          canvas.width = width; canvas.height = height;
          canvas.getContext('2d').drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setFormData(prev => ({ ...prev, images: [...prev.images, compressedBase64] }));
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleFileDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleFileDrop = (e) => { e.preventDefault(); setIsDragging(false); processFiles(e.dataTransfer.files); };
  const handleFileInput = (e) => { processFiles(e.target.files); e.target.value = ''; };
  const removeImage = (index) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description) {
      toast.error('Name and description are required');
      return;
    }
    setSaving(true);
    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, formData);
        toast.success('Product updated successfully!');
      } else {
        await productsAPI.create(formData);
        toast.success('Product created successfully!');
      }
      closeModal();
      fetchProducts();
    } catch (error) {
      toast.error('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(id);
        toast.success('Product deleted successfully!');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
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
    <div data-testid="admin-products-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white font-['Poppins']">Products</h1>
          <p className="text-[#6E7A85] mt-1">Manage your product catalog</p>
        </div>
        <Button
          onClick={() => openModal()}
          className="bg-[#FF6B00] hover:bg-[#e55f00] flex items-center gap-2"
          data-testid="add-product-btn"
        >
          <Plus size={18} /> Add Product
        </Button>
      </div>

      {/* Hint bar */}
      {products.length > 1 && (
        <div className="mb-4 flex items-center gap-3 text-[#6E7A85] text-sm bg-white/5 border border-white/10 rounded-lg px-4 py-2.5">
          <GripVertical size={16} className="text-[#FF6B00]" />
          <span>Card ko <strong className="text-white">drag</strong> karke reorder karo, ya arrows use karo</span>
          {reordering && (
            <span className="ml-auto text-[#FF6B00] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse inline-block" />
              Saving...
            </span>
          )}
        </div>
      )}

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <p className="text-[#6E7A85]">No products yet. Add your first product!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`admin-card overflow-hidden transition-all duration-200 select-none
                ${dragOverIndex === index && draggedIndex !== index
                  ? 'ring-2 ring-[#FF6B00] scale-[1.02] shadow-[0_0_20px_rgba(255,107,0,0.3)]'
                  : 'ring-0'
                }
                ${draggedIndex === index ? 'opacity-40' : 'opacity-100'}
              `}
              data-testid={`product-item-${index}`}
            >
              {/* Image area */}
              <div className="aspect-video bg-[#2E2E2E] relative group/card">
                {product.images?.[0]?.image_url ? (
                  <img
                    src={resolveMediaUrl(product.images[0].image_url || product.images[0].imageUrl)}
                    alt={product.name}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image size={40} className="text-[#6E7A85]" />
                  </div>
                )}

                {/* Drag handle overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group/card:opacity-0 hover:opacity-100 transition-opacity bg-black/20 cursor-grab active:cursor-grabbing">
                  <div className="bg-black/60 rounded-lg px-3 py-2 flex items-center gap-2 text-white text-xs font-medium">
                    <GripVertical size={14} />
                    Drag to reorder
                  </div>
                </div>

                {/* Position badge */}
                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full font-medium">
                  #{index + 1}
                </div>

                {/* Drag grip icon - always visible */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing">
                  <div className="bg-black/50 hover:bg-[#FF6B00] text-white rounded-lg px-2 py-1 flex items-center gap-1 transition-colors">
                    <GripVertical size={14} />
                  </div>
                </div>

                {/* Arrow buttons */}
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0 || reordering}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all shadow-md
                      ${index === 0 || reordering
                        ? 'bg-black/20 text-white/20 cursor-not-allowed'
                        : 'bg-black/60 text-white hover:bg-[#FF6B00] cursor-pointer'
                      }`}
                    title="Move Up"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === products.length - 1 || reordering}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all shadow-md
                      ${index === products.length - 1 || reordering
                        ? 'bg-black/20 text-white/20 cursor-not-allowed'
                        : 'bg-black/60 text-white hover:bg-[#FF6B00] cursor-pointer'
                      }`}
                    title="Move Down"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>

              {/* Card body */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-white font-['Poppins'] mb-2">{product.name}</h3>
                <p className="text-[#6E7A85] text-sm line-clamp-2 mb-4">{product.description}</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => openModal(product)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-white/10 hover:bg-white/5"
                    data-testid={`edit-product-${index}`}
                  >
                    <Pencil size={14} className="mr-2" /> Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(product.id)}
                    variant="outline"
                    size="sm"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    data-testid={`delete-product-${index}`}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
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
              className="bg-[#1E1E1E] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              data-testid="product-modal"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white font-['Poppins']">
                  {editingProduct ? 'Edit Product' : 'Add Product'}
                </h2>
                <button onClick={closeModal} className="text-[#6E7A85] hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-[#A0AAB2] mb-2">Name *</label>
                  <Input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" className="bg-[#2E2E2E]/60 border-white/10" />
                </div>
                <div>
                  <label className="block text-sm text-[#A0AAB2] mb-2">Description *</label>
                  <Textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Product description..." className="bg-[#2E2E2E]/60 border-white/10 resize-none" />
                </div>
                <div>
                  <label className="block text-sm text-[#A0AAB2] mb-2">Technical Specs</label>
                  <Textarea name="specs" value={formData.specs} onChange={handleChange} rows={2} placeholder="Material: Steel | Tolerance: ±0.005mm" className="bg-[#2E2E2E]/60 border-white/10 resize-none" />
                </div>
                <div>
                  <label className="block text-sm text-[#A0AAB2] mb-2">Applications</label>
                  <Input name="applications" value={formData.applications} onChange={handleChange} placeholder="Automotive, Aerospace, Industrial" className="bg-[#2E2E2E]/60 border-white/10" />
                </div>
                <div>
                  <label className="block text-sm text-[#A0AAB2] mb-2">Quality Note</label>
                  <Input name="quality_note" value={formData.quality_note} onChange={handleChange} placeholder="100% inspection with CMM verification" className="bg-[#2E2E2E]/60 border-white/10" />
                </div>
                <div>
                  <label className="block text-sm text-[#A0AAB2] mb-2">Images ({formData.images.length} added)</label>
                  <div
                    onDragOver={handleFileDragOver}
                    onDragLeave={handleFileDragLeave}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 select-none
                      ${isDragging ? 'border-[#FF6B00] bg-[#FF6B00]/10 scale-[1.01]' : 'border-white/20 hover:border-white/40 hover:bg-white/5'}`}
                  >
                    <Upload size={32} className={`mx-auto mb-3 transition-colors ${isDragging ? 'text-[#FF6B00]' : 'text-[#6E7A85]'}`} />
                    <p className="text-white font-medium text-sm mb-1">{isDragging ? 'Drop images here!' : 'Drag & drop images here'}</p>
                    <p className="text-[#6E7A85] text-xs">or <span className="text-[#FF6B00] underline">Browse files</span> • PNG, JPG, JPEG, WEBP</p>
                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" multiple onChange={handleFileInput} className="hidden" />
                  </div>
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {formData.images.map((url, index) => (
                        <div key={index} className="relative group rounded-lg overflow-hidden">
                          <img src={url} alt={`Image ${index + 1}`} className="w-full aspect-square object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <button
                            onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <X size={12} className="text-white" />
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-1 left-1 text-[10px] bg-[#FF6B00] text-white px-1.5 py-0.5 rounded font-medium">Main</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-white/10 flex gap-3 justify-end">
                <Button onClick={closeModal} variant="outline" className="border-white/10">Cancel</Button>
                <Button onClick={handleSave} disabled={saving} className="bg-[#FF6B00] hover:bg-[#e55f00]">
                  {saving ? 'Saving...' : 'Save Product'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

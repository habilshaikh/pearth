import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { productsAPI } from '@/lib/api';
import { PageHeader, GlassCard, LoadingSpinner } from '@/components/ui-custom';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      const data = response.data;
      let arr = Array.isArray(data) ? data : data?.products || data?.data || [];
      // ✅ sort_order se sort karo - admin ka order frontend pe reflect hoga
      arr = arr.sort((a, b) => (a.sort_order ?? 9999) - (b.sort_order ?? 9999));
      setProducts(arr);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProduct(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    if (selectedProduct?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProduct.images.length);
    }
  };

  const prevImage = () => {
    if (selectedProduct?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#121212]" data-testid="products-page">
      <PageHeader
        title="Our Products"
        subtitle="Precision-engineered components for various industries"
        backgroundImage="https://images.unsplash.com/photo-1531053326607-9d349096d887?w=1920&q=80"
      />

      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#A0AAB2] text-lg">No products available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard
                    className="h-full cursor-pointer group"
                    onClick={() => openModal(product)}
                    data-testid={`product-card-${index}`}
                  >
                    <div className="image-container aspect-[4/3] mb-4 rounded-xl">
                      <img
                        src={product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1531053326607-9d349096d887?w=600'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-white font-['Poppins'] mb-2 group-hover:text-[#FF6B00] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-[#A0AAB2] text-sm line-clamp-2 mb-4">{product.description}</p>
                    <span className="text-[#FF6B00] text-sm font-semibold">View Details →</span>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={closeModal}
            data-testid="product-modal"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="modal-content relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#2E2E2E] flex items-center justify-center text-white hover:bg-[#FF6B00] transition-colors"
                data-testid="modal-close-btn"
              >
                <X size={20} />
              </button>

              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative bg-[#0B1F3A] p-6">
                  <div className="aspect-square rounded-xl overflow-hidden">
                    <img
                      src={selectedProduct.images?.[currentImageIndex]?.image_url || 'https://images.unsplash.com/photo-1531053326607-9d349096d887?w=800'}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {selectedProduct.images?.length > 1 && (
                    <>
                      <button onClick={prevImage} className="absolute left-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-[#FF6B00] transition-colors">
                        <ChevronLeft size={24} />
                      </button>
                      <button onClick={nextImage} className="absolute right-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-[#FF6B00] transition-colors">
                        <ChevronRight size={24} />
                      </button>
                      <div className="flex justify-center gap-2 mt-4">
                        {selectedProduct.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? 'bg-[#FF6B00]' : 'bg-white/30'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="p-8">
                  <h2 className="text-3xl font-black text-white font-['Poppins'] mb-4">{selectedProduct.name}</h2>
                  <p className="text-[#A0AAB2] leading-relaxed mb-6">{selectedProduct.description}</p>
                  {selectedProduct.specs && (
                    <div className="mb-6">
                      <h4 className="text-[#FF6B00] font-semibold mb-3 uppercase text-sm tracking-wider">Technical Specifications</h4>
                      <div className="bg-[#0B1F3A]/50 rounded-lg p-4">
                        <p className="text-white text-sm whitespace-pre-line">{selectedProduct.specs}</p>
                      </div>
                    </div>
                  )}
                  {selectedProduct.applications && (
                    <div className="mb-6">
                      <h4 className="text-[#FF6B00] font-semibold mb-3 uppercase text-sm tracking-wider">Applications</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.applications.split(',').map((app, index) => (
                          <span key={index} className="px-3 py-1 bg-[#2E2E2E] rounded-full text-sm text-[#A0AAB2]">{app.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedProduct.quality_note && (
                    <div className="p-4 bg-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircle size={20} className="text-[#FF6B00] flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-[#A0AAB2]">{selectedProduct.quality_note}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

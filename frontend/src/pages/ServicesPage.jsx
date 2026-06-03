import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { servicesAPI } from '@/lib/api';
import { PageHeader, GlassCard, LoadingSpinner, SectionTitle } from '@/components/ui-custom';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-[#121212]" data-testid="services-page">
      <PageHeader
        title="Our Services"
        subtitle="Comprehensive precision machining solutions"
        backgroundImage="https://images.pexels.com/photos/8973680/pexels-photo-8973680.jpeg?w=1920&q=80"
      />

      {/* Services Grid */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {services.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#A0AAB2] text-lg">No services available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="service-card h-full" data-testid={`service-card-${index}`}>
                    <div className="image-container aspect-video mb-6 rounded-xl">
                      <img
                        src={service.image_url || 'https://images.pexels.com/photos/8973680/pexels-photo-8973680.jpeg?w=600'}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-white font-['Poppins'] mb-4">{service.name}</h3>
                    <p className="text-[#A0AAB2] leading-relaxed">{service.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-6 lg:px-12 bg-[#0B1F3A]/30">
        <div className="max-w-7xl mx-auto">
          <SectionTitle subtitle="Why Choose Us" center>
            Our Commitment to Excellence
          </SectionTitle>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-[#FF6B00]/20 flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl font-black text-[#FF6B00] font-['Poppins']">01</span>
              </div>
              <h3 className="text-xl font-bold text-white font-['Poppins'] mb-4">Precision Guaranteed</h3>
              <p className="text-[#A0AAB2]">
                Tolerances as tight as ±0.005mm with 100% inspection using advanced CMM equipment.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-[#FF6B00]/20 flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl font-black text-[#FF6B00] font-['Poppins']">02</span>
              </div>
              <h3 className="text-xl font-bold text-white font-['Poppins'] mb-4">Fast Turnaround</h3>
              <p className="text-[#A0AAB2]">
                Efficient production processes ensure quick delivery without compromising quality.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-[#FF6B00]/20 flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl font-black text-[#FF6B00] font-['Poppins']">03</span>
              </div>
              <h3 className="text-xl font-bold text-white font-['Poppins'] mb-4">Expert Support</h3>
              <p className="text-[#A0AAB2]">
                Dedicated engineering support from design optimization to final delivery.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

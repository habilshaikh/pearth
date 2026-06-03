import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Settings, Shield, Zap, Award, ClipboardCheck } from 'lucide-react';
import { homeAPI, servicesAPI, productsAPI, machinesAPI, inspectionsAPI, logosAPI } from '@/lib/api';
import { GlassCard, SectionTitle, LoadingSpinner } from '@/components/ui-custom';

const heroImages = [
  "/img/hero1.jpeg",
  "/img/hero2.jpeg",
  "/img/hero3.jpeg",
  "/img/hero4.jpeg"
];

export default function HomePage() {
  const [homeContent, setHomeContent] = useState(null);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [machines, setMachines] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [clientLogos, setClientLogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const handleImgLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setImgSize({ width: naturalWidth, height: naturalHeight });
  };

  const fetchData = async () => {
    try {
      const [homeRes, servicesRes, productsRes, machinesRes, inspectionsRes, logosRes] = await Promise.allSettled([
        homeAPI.get(),
        servicesAPI.getAll(),
        productsAPI.getAll(),
        machinesAPI.getAll(),
        inspectionsAPI.getAll(),
        logosAPI.getAll(),
      ]);

      if (homeRes.status === 'fulfilled') {
        setHomeContent(homeRes.value.data);
      } else {
        console.error('Error fetching home content:', homeRes.reason);
      }

      if (servicesRes.status === 'fulfilled') {
        setServices(Array.isArray(servicesRes.value.data) ? servicesRes.value.data.slice(0, 6) : []);
      } else {
        console.error('Error fetching services:', servicesRes.reason);
        setServices([]);
      }

      if (productsRes.status === 'fulfilled') {
        setProducts(Array.isArray(productsRes.value.data) ? productsRes.value.data.slice(0, 4) : []);
      } else {
        console.error('Error fetching products:', productsRes.reason);
        setProducts([]);
      }

      if (machinesRes.status === 'fulfilled') {
        setMachines(Array.isArray(machinesRes.value.data) ? machinesRes.value.data.slice(0, 4) : []);
      } else {
        console.error('Error fetching machines:', machinesRes.reason);
        setMachines([]);
      }

      if (inspectionsRes.status === 'fulfilled') {
        setInspections(Array.isArray(inspectionsRes.value.data) ? inspectionsRes.value.data : []);
      } else {
        console.error('Error fetching inspections:', inspectionsRes.reason);
        setInspections([]);
      }

      if (logosRes.status === 'fulfilled') {
        const nextLogos = Array.isArray(logosRes.value.data)
          ? logosRes.value.data.filter((logo) => logo?.name?.trim())
          : [];
        setClientLogos(nextLogos);
      } else {
        console.error('Error fetching client logos:', logosRes.reason);
        setClientLogos([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setInspections([]);
      setClientLogos([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const heroAspectRatio = imgSize.width > 0
    ? `${(imgSize.height / imgSize.width) * 100}vw`
    : '56.25vw';

  const stats = [
    { value: '25+', label: 'Years Experience' },
    { value: '99%', label: 'Quality Rate' },
  ];

  const featuredInspections = inspections.slice(0, 3);
  const visibleClientLogos = clientLogos.filter((logo) => logo?.name?.trim());

  return (
    <div className="min-h-screen" data-testid="home-page">

      {/* ───── Hero Section ───── */}
      <section
        className="hero-section relative"
        style={{ minHeight: heroAspectRatio }}
        data-testid="hero-section"
      >
        {/* Slideshow */}
        <div className="hero-slideshow">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            >
              <img
                src={img}
                alt={`SAI TECH CNC Machining ${index + 1}`}
                onLoad={index === 0 ? handleImgLoad : undefined}
              />
            </div>
          ))}
        </div>

        {/* Gradient overlay — bottom pe thada zyada dark taaki buttons dikh sakein */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            background: 'linear-gradient(to bottom, rgba(11,18,32,0.35) 0%, rgba(11,18,32,0.05) 40%, rgba(11,18,32,0.55) 80%, rgba(11,18,32,0.75) 100%)',
          }}
        />

        {/* Noise */}
        <div className="absolute inset-0 noise-overlay" style={{ zIndex: 2 }} />

        {/* ✅ Hero Buttons — bottom center, small & side-by-side */}
        <div
          style={{
            position: 'absolute',
            bottom: '14%',
            left: 0,
            right: 0,
            zIndex: 4,
            display: 'flex',
            justifyContent: 'center',
            padding: '0 1rem',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}
          >
            <Link
              to="/contact"
              data-testid="hero-get-quote-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#FF6B00',
                color: '#fff',
                fontWeight: 700,
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontSize: 'clamp(0.65rem, 2.8vw, 0.95rem)',
                padding: 'clamp(0.35rem, 1.2vw, 0.6rem) clamp(0.7rem, 3vw, 1.4rem)',
                textDecoration: 'none',
              }}
            >
              Get Quote <ArrowRight size={13} />
            </Link>

            <Link
              to="/products"
              data-testid="hero-view-products-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'transparent',
                color: '#fff',
                fontWeight: 700,
                borderRadius: '8px',
                border: '1.5px solid rgba(255,255,255,0.7)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontSize: 'clamp(0.65rem, 2.8vw, 0.95rem)',
                padding: 'clamp(0.35rem, 1.2vw, 0.6rem) clamp(0.7rem, 3vw, 1.4rem)',
                textDecoration: 'none',
              }}
            >
              View Products
            </Link>
          </motion.div>
        </div>

        {/* Slide indicators */}
        <div className="slide-indicators" style={{ zIndex: 4 }}>
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`slide-indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{
            position: 'absolute',
            bottom: '0.4rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 4,
          }}
        >
          <div style={{
            width: '18px', height: '30px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '999px',
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'center', padding: '4px',
          }}>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#FF6B00' }}
            />
          </div>
        </motion.div>
      </section>

      {/* ───── Stats ───── */}
      <section className="py-16 stats-section relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-black text-gradient font-['Poppins'] mb-2">{stat.value}</div>
                <div className="text-[#B8C4CE] text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── About Preview ───── */}
      <section className="py-24 px-6 lg:px-12 relative" data-testid="about-preview-section">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#0B1F3A]/30 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <SectionTitle subtitle="About SAI TECH">
                Engineering Excellence<br />Since 1998
              </SectionTitle>
              <p className="text-[#B8C4CE] leading-relaxed mb-8">
                {homeContent?.aboutText || homeContent?.about_text || 'SAI TECH is a leading precision CNC machining company specializing in high-quality components for automotive, engineering industries, and steel plant industrial applications. With over 25 years of experience and state-of-the-art machinery, we deliver excellence in every part we manufacture.'}
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                {[
                  { icon: <Shield size={22} />, title: 'ISO Certified', sub: 'Quality assured processes' },
                  { icon: <Zap size={22} />, title: 'Fast Delivery', sub: 'On-time every time' },
                  { icon: <Settings size={22} />, title: 'Modern Equipment', sub: 'State-of-the-art CNC' },
                  { icon: <Award size={22} />, title: 'Expert Team', sub: 'Skilled professionals' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6B00]/30 to-[#FF6B00]/10 flex items-center justify-center flex-shrink-0 border border-[#FF6B00]/20 text-[#FF6B00]">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                      <p className="text-[#8896A6] text-sm">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/about" className="inline-flex items-center gap-2 text-[#FF6B00] font-semibold hover:gap-4 transition-all" data-testid="about-learn-more-btn">
                Learn More About Us <ArrowRight size={18} />
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <video src="/img/about.mp4" autoPlay loop muted playsInline className="rounded-2xl w-full h-full object-cover" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 border-2 border-[#FF6B00]/30 rounded-2xl -z-10"></div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-[#FF6B00]/20 to-transparent rounded-xl -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───── Services ───── */}
      <section className="py-24 px-6 lg:px-12 bg-gradient-to-b from-[#151a22] via-[#0B1F3A]/40 to-[#151a22] relative" data-testid="services-section">
        <div className="absolute inset-0 noise-overlay"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <SectionTitle subtitle="What We Offer">Our Services</SectionTitle>
            <Link to="/services" className="inline-flex items-center gap-2 text-[#FF6B00] font-semibold hover:gap-4 transition-all mt-4 md:mt-0">
              View All Services <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div key={service.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <GlassCard className="service-card h-full" data-testid={`service-card-${index}`}>
                  <div className="image-container aspect-video mb-4 rounded-xl">
                    <img src={service.imageUrl || service.image_url || 'https://images.pexels.com/photos/8973680/pexels-photo-8973680.jpeg?w=400'} alt={service.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xl font-bold text-white font-['Poppins'] mb-3">{service.name}</h3>
                  <p className="text-[#B8C4CE] text-sm leading-relaxed line-clamp-3">{service.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Products ───── */}
      <section className="py-24 px-6 lg:px-12" data-testid="products-section">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <SectionTitle subtitle="Our Work">Featured Products</SectionTitle>
            <Link to="/products" className="inline-flex items-center gap-2 text-[#FF6B00] font-semibold hover:gap-4 transition-all mt-4 md:mt-0">
              View All Products <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <Link to="/products" data-testid={`product-card-${index}`}>
                  <GlassCard className="h-full group cursor-pointer">
                    <div className="image-container aspect-square mb-4 rounded-xl">
                      <img src={product.images?.[0]?.imageUrl || product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1531053326607-9d349096d887?w=400'} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-lg font-bold text-white font-['Poppins'] mb-2 group-hover:text-[#FF6B00] transition-colors">{product.name}</h3>
                    <p className="text-[#8896A6] text-sm line-clamp-2">{product.description}</p>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Machines ───── */}
      <section className="py-24 px-6 lg:px-12 bg-gradient-to-b from-[#151a22] to-[#0B1F3A]/60" data-testid="machines-section">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <SectionTitle subtitle="Our Equipment">Advanced Machinery</SectionTitle>
            <Link to="/machines" className="inline-flex items-center gap-2 text-[#FF6B00] font-semibold hover:gap-4 transition-all mt-4 md:mt-0">
              View All Machines <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {machines.map((machine, index) => (
              <motion.div key={machine.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                <GlassCard className="text-center" data-testid={`machine-card-${index}`}>
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#FF6B00]/30 to-[#FF6B00]/10 flex items-center justify-center mx-auto mb-4 border border-[#FF6B00]/20">
                    <Settings size={28} className="text-[#FF6B00]" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-['Poppins'] mb-2">{machine.name}</h3>
                  <p className="text-[#8896A6] text-sm mb-2">{machine.capacity}</p>
                  {machine.specs && <p className="text-[#B8C4CE] text-xs">{machine.specs}</p>}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Clients ───── */}
      {featuredInspections.length > 0 && (
        <section className="py-24 px-6 lg:px-12 bg-[#0B1F3A]/20" data-testid="home-inspections-section">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
              <SectionTitle subtitle="Quality Control Matrix" className="mb-0">
                Inspection Capabilities
              </SectionTitle>
              <Link to="/inspections" className="inline-flex items-center gap-2 text-[#FF6B00] font-semibold hover:gap-4 transition-all">
                View Inspection Details <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {featuredInspections.map((inspection, index) => (
                <motion.div
                  key={inspection.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <GlassCard className="h-full">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF6B00]/25 to-[#FF6B00]/10 flex items-center justify-center mb-5 border border-[#FF6B00]/20">
                      <ClipboardCheck size={24} className="text-[#FF6B00]" />
                    </div>
                    <h3 className="text-xl font-bold text-white font-['Poppins'] mb-3">{inspection.name}</h3>
                    <p className="text-[#FF6B00] text-sm font-semibold mb-3">{inspection.equipment}</p>
                    <p className="text-[#B8C4CE] text-sm leading-relaxed">{inspection.capability || 'Inspection capability details will be updated soon.'}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {visibleClientLogos.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-[#0B1F3A]/60 to-[#151a22] overflow-hidden" data-testid="clients-section">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <SectionTitle subtitle="Trusted By" center>Our Valued Clients</SectionTitle>
          </div>

          <div
            className="relative mt-12"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
            }}
          >
            <div
              style={{
                display: 'flex',
                width: 'max-content',
                gap: '2.5rem',
                animation: 'marquee-scroll 25s linear infinite',
              }}
            >
              {[...visibleClientLogos, ...visibleClientLogos].map((logo, index) => (
                <div
                  key={`${logo.id || logo.name || 'client'}-${index}`}
                  className="flex-shrink-0 rounded-xl border border-[#FF6B00]/20 bg-[#0B1F3A]/40 px-8 py-4 text-[#B8C4CE] font-bold font-['Poppins'] text-base md:text-lg whitespace-nowrap hover:text-[#FF6B00] hover:border-[#FF6B00]/50 transition-colors cursor-default"
                >
                  {logo.name}
                </div>
              ))}
            </div>
          </div>

          <style>{`
            @keyframes marquee-scroll {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @media (prefers-reduced-motion: reduce) {
              div[style*="marquee-scroll"] { animation: none; }
            }
          `}</style>
        </section>
      )}

      {/* ───── CTA ───── */}
      <section className="cta-section py-24 px-6 lg:px-12" data-testid="cta-section">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-black text-white font-['Poppins'] mb-6">
              {homeContent?.ctaText || homeContent?.cta_text || 'Get Your Custom Quote Today'}
            </h2>
            <p className="text-lg text-[#B8C4CE] mb-10 max-w-2xl mx-auto">
              Ready to bring your precision engineering projects to life? Contact our team of experts for a custom quote tailored to your specific requirements.
            </p>
           
          </motion.div>
        </div>
      </section>

    </div>
  );
}

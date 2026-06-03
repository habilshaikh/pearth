import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Zap, Settings, Award, Target, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import { PageHeader, GlassCard, ImageFrame, SectionTitle } from '@/components/ui-custom';

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Quality First',
      description: 'ISO certified processes ensuring every component meets the highest standards of precision and quality.'
    },
    {
      icon: Target,
      title: 'Precision Engineering',
      description: 'Tolerances as tight as ±0.005mm to 0.02mm achieved through advanced CNC technology and skilled craftsmanship.'
    },
    {
      icon: Clock,
      title: 'On-Time Delivery',
      description: 'Committed to meeting deadlines without compromising on quality, keeping your production on schedule.'
    },
    {
      icon: Award,
      title: 'Industry Expertise',
      description: '25+ years of experience serving automotive, steel industries, engineering parts, and industrial sectors worldwide.'
    }
  ];

  const capabilities = [
    'CNC Turning up to 12mm to 200mm diameter ',
    ' CNC Turning 1200mm Length Pilger Mandrel',
    'CNC Turning up to 12mm to 450mm diameter',
    'CNC Turning 2000mm Length',
    // 'CMM Quality Inspection',
    // 'Material Certifications'
  ];

  const timeline = [
    { year: '1998', title: 'Founded', description: 'Started with 4 Convectional machines' },
    { year: '2005', title: 'ISO Certified', description: 'Achieved ISO 9001 certification' },
    { year: '2014', title: 'Expansion', description: 'Moved to larger GIDC facility' },
    { year: '2018', title: 'Advance CNC Machines', description: '' },
    { year: '2024', title: 'Fleet expanded to Special ', description: 'Application CNC machines' }
  ];

  return (
    <div className="min-h-screen bg-[#121212]" data-testid="about-page">
      <PageHeader
        title="About SAI TECH"
        subtitle="Engineering excellence and precision manufacturing since 1998"
        backgroundImage="https://images.unsplash.com/photo-1720036237334-9263cd28c3d4?w=1920&q=80"
      />

      {/* Company Story */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <SectionTitle subtitle="Our Story">
                A Legacy of Precision
              </SectionTitle>
              
              <div className="space-y-6 text-[#A0AAB2] leading-relaxed">
                <p>
                      Founded in 1998 in the industrial heartland of Gujarat, SAI TECH began with a simple vision: to deliver precision-engineered components that exceed customer expectations. What started with just four Convectional machines has grown into one of the region's most trusted precision machining facilities.                </p>
                <p>
                      Over the past 25+ years, we've continuously invested in cutting-edge technology and skilled talent. Our state-of-the-art facility in GIDC POR houses Advanced CNC/VMC machines, multi-tasking lathes.                </p>
                <p>
                      Today, we serve customers across automotive, Engineering Industries, and Steel Industries, delivering components that meet the most demanding specifications. Our commitment to quality, precision, and customer satisfaction remains unchanged.                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
           <video 
                      src="/img/about.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="rounded-2xl w-full h-full object-cover"
                    /> 
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-[#FF6B00]/30 rounded-2xl -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6 lg:px-12 bg-[#0B1F3A]/30">
        <div className="max-w-7xl mx-auto">
          <SectionTitle subtitle="Our Journey" center>
            Milestones
          </SectionTitle>
          
          <div className="relative mt-16">
            {/* Timeline line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-[#FF6B00]/30 -translate-y-1/2"></div>
            
            <div className="grid md:grid-cols-5 gap-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative text-center"
                >
                  <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#FF6B00] rounded-full z-10"></div>
                  <div className="md:mt-12">
                    <span className="text-[#FF6B00] font-black text-2xl font-['Poppins']">{item.year}</span>
                    <h3 className="text-white font-semibold mt-2 mb-1">{item.title}</h3>
                    <p className="text-[#6E7A85] text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <SectionTitle subtitle="What Drives Us" center>
            Our Core Values
          </SectionTitle>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="h-full text-center" data-testid={`value-card-${index}`}>
                  <div className="w-16 h-16 rounded-xl bg-[#FF6B00]/20 flex items-center justify-center mx-auto mb-4">
                    <value.icon size={28} className="text-[#FF6B00]" />
                  </div>
                  <h3 className="text-xl font-bold text-white font-['Poppins'] mb-3">{value.title}</h3>
                  <p className="text-[#A0AAB2] text-sm leading-relaxed">{value.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-24 px-6 lg:px-12 bg-gradient-to-b from-[#121212] to-[#0B1F3A]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <ImageFrame
                src="img/aboutimg.jpeg"
                alt="CNC Machinery"
                className="rounded-2xl"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <SectionTitle subtitle="What We Offer">
                Our Capabilities
              </SectionTitle>
              
              <p className="text-[#A0AAB2] leading-relaxed mb-8">
                  With advanced CNC/VMC machines and a team of skilled engineers, we offer comprehensive precision machining services to meet your most demanding requirements.

                  <br></br><br></br>CNC Turning up to 12mm to 200mm diameter 1200mm Length Pilger Mandrel
                  CNC Turning up to 12mm to 450mm diameter 2000mm Length

                  CNC Milling
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {capabilities.map((cap, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle size={20} className="text-[#FF6B00] flex-shrink-0" />
                    <span className="text-white text-sm">{cap}</span>
                  </div>
                ))}
              </div>
              
              <Link
                to="/machines"
                className="inline-flex items-center gap-2 text-[#FF6B00] font-semibold hover:gap-4 transition-all mt-8"
              >
                View Our Equipment
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white font-['Poppins'] mb-6">
             Ready to Innovative journey With Us?
            </h2>
            <p className="text-lg text-[#A0AAB2] mb-10">
Let's discuss how SAI TECH can help bring your precision engineering projects.
                          </p>
            <Link
              to="/contact"
              className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
              data-testid="about-contact-btn"
            >
              Contact Us
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

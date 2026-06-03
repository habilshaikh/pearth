import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', hover = true, ...props }) => {
  return (
    <motion.div
      className={`card-glass p-6 ${hover ? 'hover:border-[#FF6B00]/30' : ''} ${className}`}
      whileHover={hover ? { y: -4 } : {}}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const ImageFrame = ({ src, alt, className = '', aspectRatio = 'aspect-video' }) => {
  return (
    <div className={`image-container ${aspectRatio} ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
};

export const SectionTitle = ({ children, subtitle, center = false, className = '' }) => {
  return (
    <div className={`mb-12 ${center ? 'text-center' : ''} ${className}`}>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[#FF6B00] text-sm font-semibold uppercase tracking-wider mb-2"
        >
          {subtitle}
        </motion.p>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="section-title text-white"
      >
        {children}
      </motion.h2>
    </div>
  );
};

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="spinner"></div>
    </div>
  );
};

export const PageHeader = ({ title, subtitle, backgroundImage }) => {
  return (
    <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
      {backgroundImage && (
        <>
          <img
            src={backgroundImage}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/60 via-[#121212]/80 to-[#121212]"></div>
        </>
      )}
      {!backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1F3A] to-[#121212]"></div>
      )}
      <div className="relative z-10 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-['Poppins'] mb-4"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[#A0AAB2] max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
};

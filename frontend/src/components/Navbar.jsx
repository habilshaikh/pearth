import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';

const LOGO_URL = "img/logo.png";

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Products', path: '/products' },
  { name: 'Services', path: '/services' },
  { name: 'Machines', path: '/machines' },
  { name: 'Inspection', path: '/inspections' },
  { name: 'Contact', path: '/contact' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav
      className={`navbar py-3 px-6 lg:px-12 transition-all duration-300 ${
        isScrolled ? 'navbar-scrolled py-2 bg-[#f7f5f5] shadow-lg' : 'bg-transparent'
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        <Link to="/" className="flex items-center" data-testid="navbar-logo">
          <img
            src={LOGO_URL}
            alt="SAI TECH Engineering"
            className="logo-img w-auto object-contain"
            style={{ height: '200px', marginTop: '-50px', marginBottom: '-50px' }}
          />
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors animated-underline ${
                location.pathname === link.path
                  ? 'text-[#FF6B00]'
                  : isScrolled ? 'text-black hover:text-black' : 'text-white hover:text-white'
              }`}
              data-testid={`nav-link-${link.name.toLowerCase()}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <a
              href="tel:+919574007081"
              className={`flex items-center gap-2 transition-colors whitespace-nowrap ${isScrolled ? 'text-black hover:text-[#FF6B00]' : 'text-white hover:text-white'}`}
            >
              <Phone size={15} />
              <span className="text-sm">+91 95740 07081</span>
            </a>
            <a
              href="tel:+919824395336"
              className={`flex items-center gap-2 transition-colors whitespace-nowrap ${isScrolled ? 'text-black hover:text-[#FF6B00]' : 'text-white hover:text-white'}`}
            >
              <Phone size={15} />
              <span className="text-sm">+91 98243 95336</span>
            </a>
          </div>

          <Link
            to="/contact"
            className="btn-primary text-sm px-6 py-3"
            data-testid="nav-get-quote-btn"
          >
            Get Quote
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-black"
          data-testid="mobile-menu-btn"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-4 glass rounded-xl overflow-hidden"
            data-testid="mobile-menu"
          >
            <div className="p-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'bg-[#FF6B00]/20 text-[#FF6B00]'
                      : 'text-[#B8C4CE] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                <a
                  href="tel:+919574007081"
                  className="flex items-center gap-2 py-2 px-4 text-[#B8C4CE] text-sm"
                >
                  <Phone size={16} />
                  +91 95740 07081
                </a>
                <a
                  href="tel:+919824395336"
                  className="flex items-center gap-2 py-2 px-4 text-[#B8C4CE] text-sm"
                >
                  <Phone size={16} />
                  +91 98243 95336
                </a>
                <Link
                  to="/contact"
                  className="btn-primary w-full text-center block text-sm mt-2"
                >
                  Get Quote
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

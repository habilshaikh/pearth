import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';

const LOGO_URL = "img/logo.png";

const footerLinks = {
  company: [
    { name: 'About Us', path: '/about' },
    { name: 'Our Services', path: '/services' },
    { name: 'Products', path: '/products' },
    { name: 'Machines', path: '/machines' },
    { name: 'Inspection', path: '/inspections' },
    { name: 'Contact', path: '/contact' },
  ],
  services: [
    { name: 'CNC Turning', path: '/services' },
    { name: 'CNC Milling', path: '/services' },
    { name: 'VMC Milling', path: '/services' },
    { name: 'Precision Machining', path: '/services' },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-white relative overflow-hidden border-t border-gray-200 font-bold" data-testid="footer">
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <img
                src={LOGO_URL}
                alt="SAI TECH Engineering"
                className="h-[200px] md:h-[140px] w-auto object-contain"
              />
            </div>
            <p className="text-black text-sm leading-relaxed mb-6">
              Engineering excellence since 1998. Delivering precision components for automotive, steel industries, engineering parts, and industrial applications.
            </p>
            <div className="flex gap-4">
              <a
                href="https://wa.me/919574007081"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-black hover:bg-[#25D366] hover:text-white transition-all border border-gray-300"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-black font-['Poppins'] mb-6 text-base">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-black text-sm hover:text-[#FF6B00] transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight size={14} className="opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-black font-['Poppins'] mb-6 text-base">Our Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-black text-sm hover:text-[#FF6B00] transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight size={14} className="opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-black font-['Poppins'] mb-6 text-base">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#FF6B00] flex-shrink-0 mt-0.5" />
                <span className="text-black text-sm">
                  SAI TECH<br />
                  Plot No. 28, POR GIDC, Ramangamdi,<br />
                  Vadodara - 391243
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#FF6B00] flex-shrink-0" />
                <a href="tel:+919574007081" className="text-black text-sm hover:text-[#FF6B00] transition-colors">
                  +91 95740 07081
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#FF6B00] flex-shrink-0" />
                <a href="tel:+919574007081" className="text-black text-sm hover:text-[#FF6B00] transition-colors">
                  +91 98243 95336
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#FF6B00] flex-shrink-0" />
                <a href="mailto:shreeji_engg7822@yahoo.co.in" className="text-black text-sm hover:text-[#FF6B00] transition-colors break-all">
                  shreeji_engg7822@yahoo.co.in
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={18} className="text-[#FF6B00] flex-shrink-0" />
                <span className="text-black text-sm">Mon - Sat: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-black text-sm">
            © {new Date().getFullYear()} SAI TECH. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/admin/login" className="text-black text-sm hover:text-[#FF6B00] transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

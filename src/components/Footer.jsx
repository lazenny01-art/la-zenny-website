import { Link } from 'react-router-dom';
import { MessageCircle, MapPin, Mail, Phone } from 'lucide-react';


export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white mt-16">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-4 mb-5">
            <img
              src="/logo.png"
              alt="LA ZENNY Logo"
              className="w-16 h-16 rounded-full object-cover border-2 border-[#F9C4D2]/30 shadow-lg"
            />
            <div>
              <span className="font-display text-3xl font-bold tracking-tight text-white block">LA ZENNY</span>
              <p className="text-[10px] tracking-[0.3em] uppercase mt-0.5 text-[#F9C4D2]">THE FASHION</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Your style, your story. Premium women's fashion curated for the modern Indian woman — bold, beautiful, and effortlessly chic.
          </p>
          {/* Social */}
          <div className="flex items-center gap-3 mt-6">
            <a
              href="https://wa.me/919909262100"
              id="footer-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200"
            >
              <MessageCircle size={16} />
              WhatsApp Us
            </a>
            <a
              href="https://www.instagram.com/lazenny.com1"
              id="footer-instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label="Instagram"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold tracking-widest uppercase text-[#F9C4D2] mb-5">Quick Links</h4>
          <ul className="space-y-3">
            {[
              { to: '/about', label: 'About Us' },
              { to: '/shop', label: 'Shop All' },
              { to: '/collections', label: 'Collections' },
              { to: '/contact', label: 'Contact' },
            ].map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-gray-400 text-sm hover:text-[#F9C4D2] transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Policies & Contact */}
        <div>
          <h4 className="text-sm font-semibold tracking-widest uppercase text-[#F9C4D2] mb-5">Customer Care</h4>
          <ul className="space-y-3 mb-6">
            {[
              { label: 'Returns Policy' },
              { label: 'Privacy Policy' },
              { label: 'Size Guide' },
              { label: 'Shipping Info' },
            ].map((item) => (
              <li key={item.label}>
                <span className="text-gray-400 text-sm hover:text-[#F9C4D2] transition-colors cursor-pointer">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
          <div className="space-y-2 text-gray-400 text-xs">
            <div className="flex items-center gap-2">
              <Mail size={12} />
              <span>lazenny01@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={12} />
              <span>+91 99092 62100</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={12} />
              <span>Varachha, Surat - 395006 🇮🇳</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© 2025 LA ZENNY — THE FASHION. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <span className="text-[#F9C4D2]">♥</span> in India
          </p>
        </div>
      </div>
    </footer>
  );
}

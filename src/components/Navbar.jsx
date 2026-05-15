import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, Heart } from 'lucide-react';

export default function Navbar({ cartCount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/collections', label: 'Collections' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-pink-100'
            : 'bg-white/90 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/logo.png"
                alt="LA ZENNY Logo"
                className="w-9 h-9 md:w-11 md:h-11 rounded-full object-cover shadow-sm group-hover:scale-110 transition-transform duration-300"
              />
              <div className="flex flex-col items-start leading-none">
                <span className="font-display text-2xl md:text-3xl font-bold text-[#111111] tracking-tight group-hover:text-[#F4A5BE] transition-colors duration-300">
                  LA ZENNY
                </span>
                <span className="text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-gray-500 font-medium -mt-0.5">
                  THE FASHION
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link ${
                    location.pathname === link.to
                      ? 'text-[#F4A5BE] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#F4A5BE]'
                      : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3 md:gap-4">
              <button
                id="nav-search"
                className="p-2 hover:text-[#F4A5BE] transition-colors duration-200"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
              <button
                id="nav-wishlist"
                className="p-2 hover:text-[#F4A5BE] transition-colors duration-200 hidden md:block"
                aria-label="Wishlist"
              >
                <Heart size={18} />
              </button>
              <Link
                to="/cart"
                id="nav-cart"
                className="relative p-2 hover:text-[#F4A5BE] transition-colors duration-200"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#F9C4D2] text-[#111111] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
              {/* Mobile Menu Toggle */}
              <button
                id="nav-mobile-menu"
                className="md:hidden p-2 hover:text-[#F4A5BE] transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white border-t border-pink-100 px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-semibold tracking-widest uppercase py-2 border-b border-gray-100 ${
                  location.pathname === link.to ? 'text-[#F4A5BE]' : 'text-[#111111]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-4 pt-2">
              <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#F4A5BE] transition-colors">
                <Heart size={16} /> Wishlist
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Spacer */}
      <div className="h-16 md:h-20" />
    </>
  );
}

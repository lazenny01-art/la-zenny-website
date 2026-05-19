import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, CreditCard, RotateCcw, Star, Loader } from 'lucide-react';
import { getProducts, getCategories } from '../firebase/firestore';
import ProductCard from '../components/ProductCard';

const testimonials = [
  { name: 'Priya S.', city: 'Mumbai', text: 'Love the quality! The Miu Miu co-ord is absolutely stunning. Got so many compliments!', stars: 5 },
  { name: 'Kavitha R.', city: 'Bangalore', text: 'Super fast delivery and amazing packaging. The pink eyelet crop is my new fav!', stars: 5 },
  { name: 'Sneha M.', city: 'Delhi', text: 'Affordable and so stylish. LA Zenny is now my go-to for everything!', stars: 5 },
];

export default function Home({ onAddToCart }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setFeaturedProducts(prods.filter(p => p.featured).slice(0, 8));
      setCategories(cats);
      setLoading(false);
    };
    load();
  }, []);

  const catImages = [
    'https://picsum.photos/seed/cat-a/400/500',
    'https://picsum.photos/seed/cat-b/400/500',
    'https://picsum.photos/seed/cat-c/400/500',
    'https://picsum.photos/seed/cat-d/400/500',
    'https://picsum.photos/seed/cat-e/400/500',
    'https://picsum.photos/seed/cat-f/400/500',
    'https://picsum.photos/seed/cat-g/400/500',
    'https://picsum.photos/seed/cat-h/400/500',
  ];

  return (
    <div className="animate-fade-in">
      {/* HERO */}
      <section className="relative hero-gradient overflow-hidden" style={{ minHeight: '90vh' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-[#F9C4D2]/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-white/40 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12 py-16 lg:py-24" style={{ minHeight: '90vh' }}>
          <div className="flex-1 text-center lg:text-left">
            <p className="section-subtitle text-[#F4A5BE] mb-4">New Collection 2025</p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-[#111111] leading-tight mb-6">
              Your Style.<br />
              <span className="text-[#F4A5BE] italic">Your Story.</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-md mb-8 mx-auto lg:mx-0">
              Discover the latest in women's fashion — bold prints, feminine silhouettes, crafted just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/shop" id="hero-shop-now" className="btn-primary">Shop Now</Link>
              <Link to="/collections" className="btn-outline">View Collections</Link>
            </div>
            <div className="flex flex-wrap gap-6 mt-10 justify-center lg:justify-start text-sm text-gray-600">
              <span className="flex items-center gap-2"><Truck size={16} className="text-[#F4A5BE]" /> Free Delivery ₹999+</span>
              <span className="flex items-center gap-2"><CreditCard size={16} className="text-[#F4A5BE]" /> COD Available</span>
              <span className="flex items-center gap-2"><RotateCcw size={16} className="text-[#F4A5BE]" /> Easy Returns</span>
            </div>
          </div>
          <div className="flex-1 relative w-full max-w-lg">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="rounded-2xl overflow-hidden shadow-2xl h-64 animate-float">
                  <img src="https://picsum.photos/seed/hero1/500/700" alt="Fashion" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl h-44">
                  <img src="https://picsum.photos/seed/hero3/500/600" alt="Fashion" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-3 mt-8">
                <div className="rounded-2xl overflow-hidden shadow-xl h-44">
                  <img src="https://picsum.photos/seed/hero4/500/600" alt="Fashion" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-2xl h-64 animate-float" style={{ animationDelay: '1.5s' }}>
                  <img src="https://picsum.photos/seed/hero2/500/700" alt="Fashion" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-pink-100">
              <p className="text-xs text-gray-500 tracking-wider">Trending Now</p>
              <p className="font-bold text-[#111111] text-sm">Co-ord Sets 🌟</p>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-[#F9C4D2] rounded-2xl shadow-xl p-4">
              <p className="text-xs font-medium text-[#111111]">Free Delivery</p>
              <p className="font-bold text-[#111111] text-sm">Above ₹999 🚚</p>
            </div>
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENT STRIP */}
      <div className="bg-[#111111] text-white py-3 overflow-hidden">
        <div className="marquee-track animate-marquee">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex items-center gap-8 px-8 text-sm tracking-widest whitespace-nowrap">
              <span>✨ Free Delivery on Orders Above ₹999</span>
              <span className="text-[#F9C4D2]">◆</span>
              <span>💳 COD Available</span>
              <span className="text-[#F9C4D2]">◆</span>
              <span>🔄 Easy 7-Day Returns</span>
              <span className="text-[#F9C4D2]">◆</span>
              <span>🌸 New Arrivals Every Week</span>
              <span className="text-[#F9C4D2]">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <p className="section-subtitle text-[#F4A5BE] mb-2">Shop by Style</p>
            <h2 className="section-title">Featured Categories</h2>
          </div>
          <div className={`grid gap-4 ${
            categories.length <= 2 ? 'grid-cols-2' :
            categories.length === 3 ? 'grid-cols-2 md:grid-cols-3' :
            'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          }`}>
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.name}`}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={catImages[i % catImages.length]}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <h3 className="text-white font-bold text-lg tracking-wide">{cat.name}</h3>
                  <p className="text-white/70 text-xs tracking-wider mt-1 flex items-center justify-center gap-1 group-hover:text-[#F9C4D2] transition-colors">
                    Shop Now <ArrowRight size={12} />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* PROMO BANNER */}
      <section className="mx-6 md:mx-auto max-w-7xl md:px-6 mb-16">
        <div className="relative rounded-3xl overflow-hidden bg-[#111111] py-14 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#F9C4D2]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 text-center md:text-left">
            <p className="text-[#F9C4D2] tracking-widest uppercase text-sm font-semibold mb-3">Limited Time</p>
            <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">New Season Drop 🌸</h3>
            <p className="text-gray-400 max-w-sm">Fresh styles, vibrant prints, and feminine silhouettes — shop the new collection before it sells out.</p>
          </div>
          <Link to="/shop" className="relative z-10 btn-pink text-sm px-10 py-4 whitespace-nowrap">Explore Now</Link>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-6 py-6 pb-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div>
            <p className="section-subtitle text-[#F4A5BE] mb-2">Just Dropped</p>
            <h2 className="section-title">New Arrivals</h2>
          </div>
          <Link to="/shop" className="flex items-center gap-2 text-sm font-semibold text-[#111111] hover:text-[#F4A5BE] transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader size={28} className="animate-spin mr-3" />
            <span>Loading products...</span>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#FDE8EF] rounded-3xl">
            <p className="text-5xl mb-4">🌸</p>
            <h3 className="font-display text-2xl font-bold text-[#111111] mb-2">Collection Coming Soon</h3>
            <p className="text-gray-500">We're curating something beautiful for you. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
        )}
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#FDE8EF] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="section-subtitle text-[#F4A5BE] mb-2">What Our Girls Say</p>
            <h2 className="section-title">Customer Love 💕</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex gap-1 mb-3">
                  {[...Array(t.stars)].map((_, s) => <Star key={s} size={14} className="fill-[#F4A5BE] text-[#F4A5BE]" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#F9C4D2] flex items-center justify-center font-bold text-sm text-[#111111]">{t.name[0]}</div>
                  <div>
                    <p className="font-semibold text-sm text-[#111111]">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

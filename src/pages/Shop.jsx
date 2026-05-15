import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Loader } from 'lucide-react';
import { getProducts, getCategories } from '../firebase/firestore';
import ProductCard from '../components/ProductCard';

const ALL_SIZES = ["XS", "S", "M", "L", "XL"];
const priceRanges = [
  { label: 'Under ₹599', min: 0, max: 599 },
  { label: '₹599 – ₹799', min: 599, max: 799 },
  { label: '₹799 – ₹999', min: 799, max: 999 },
  { label: 'Above ₹999', min: 999, max: Infinity },
];

export default function Shop({ onAddToCart }) {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    const load = async () => {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const toggleSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const allCategories = ['All', ...categories.map(c => c.name)];

  const filteredProducts = products
    .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
    .filter(p => selectedSizes.length === 0 || selectedSizes.some(s => (p.sizes || []).includes(s)))
    .filter(p => {
      if (!selectedPrice) return true;
      return p.price >= selectedPrice.min && p.price <= selectedPrice.max;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedSizes([]);
    setSelectedPrice(null);
    setSortBy('default');
  };

  const hasFilters = selectedCategory !== 'All' || selectedSizes.length > 0 || selectedPrice;

  const Sidebar = () => (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-7 sticky top-28">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-[#111111] text-base">Filters</h3>
        {hasFilters && (
          <button onClick={clearFilters} className="text-xs text-[#F4A5BE] hover:text-[#E8789A] font-semibold flex items-center gap-1">
            <X size={12} /> Clear All
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <h4 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-3">Category</h4>
        {loading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => <div key={i} className="h-9 bg-gray-100 rounded-lg animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-2">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all ${
                  selectedCategory === cat ? 'bg-[#F9C4D2] text-[#111111] font-semibold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Size */}
      <div>
        <h4 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-3">Size</h4>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`size-badge ${selectedSizes.includes(size) ? 'active' : ''}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h4 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-3">Price Range</h4>
        <div className="space-y-2">
          {priceRanges.map((range, i) => (
            <button
              key={i}
              onClick={() => setSelectedPrice(selectedPrice?.label === range.label ? null : range)}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all ${
                selectedPrice?.label === range.label ? 'bg-[#F9C4D2] text-[#111111] font-semibold' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-8">
        <p className="section-subtitle text-[#F4A5BE] mb-2">All Products</p>
        <h1 className="section-title">Shop LA ZENNY</h1>
      </div>

      {/* Mobile filter toggle */}
      <div className="flex items-center justify-between gap-3 mb-6 md:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center gap-2 border border-gray-300 px-4 py-2 text-sm font-semibold hover:border-[#F9C4D2] transition-colors"
        >
          <SlidersHorizontal size={14} />
          Filters {hasFilters && <span className="bg-[#F9C4D2] text-[#111111] text-xs rounded-full px-1.5">!</span>}
        </button>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#F9C4D2] rounded">
          <option value="default">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name: A–Z</option>
        </select>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex gap-8">
        {/* Sidebar - Desktop */}
        <div className="hidden md:block w-56 shrink-0">
          <Sidebar />
        </div>

        <div className="flex-1">
          <div className="hidden md:flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-[#111111]">{filteredProducts.length}</span> products
            </p>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500 font-medium">Sort by:</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-[#F9C4D2] rounded-lg">
                <option value="default">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A–Z</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24 text-gray-400">
              <Loader size={28} className="animate-spin mr-3" /> Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">{hasFilters ? '🔍' : '🌸'}</p>
              <p className="font-semibold text-lg mb-2">{hasFilters ? 'No products found' : 'No products yet'}</p>
              <p className="text-sm">{hasFilters ? 'Try adjusting your filters' : 'The owner is adding products soon!'}</p>
              {hasFilters && <button onClick={clearFilters} className="mt-4 btn-pink">Clear Filters</button>}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

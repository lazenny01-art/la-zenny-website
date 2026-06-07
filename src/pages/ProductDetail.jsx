import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Zap, Star, Truck, RotateCcw, Shield, ChevronDown, Loader, PlayCircle } from 'lucide-react';
import { getProductById, getProducts } from '../firebase/firestore';

export default function ProductDetail({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const prod = await getProductById(id);
      setProduct(prod);
      if (prod) {
        const allProds = await getProducts();
        setRelated(allProds.filter(p => p.category === prod.category && p.id !== id).slice(0, 4));
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
        <Loader size={28} className="animate-spin mr-3" /> Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="text-5xl mb-4">😕</p>
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [product.image];
  const colors = product.colors || [];

  // Extract YouTube video ID from various URL formats
  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };
  const youtubeId = getYouTubeId(product.youtubeUrl);

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); setTimeout(() => setSizeError(false), 2000); return; }
    for (let i = 0; i < qty; i++) {
      onAddToCart({ ...product, selectedSize, selectedColor: selectedColor || colors[0] || '' });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedSize) { setSizeError(true); setTimeout(() => setSizeError(false), 2000); return; }
    onAddToCart({ ...product, selectedSize, selectedColor: selectedColor || colors[0] || '' });
    navigate('/cart');
  };

  return (
    <div className="animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <Link to="/" className="hover:text-[#F4A5BE]">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#F4A5BE]">Shop</Link>
          <span>/</span>
          <span className="text-[#111111]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <div className="space-y-3">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-50 product-img-wrap shadow-lg">
              <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#F9C4D2] text-[#111111] text-xs font-bold tracking-widest px-3 py-1.5 uppercase">{product.badge}</span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-[#F4A5BE]' : 'border-transparent'}`}>
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* YouTube Video Embed */}
            {youtubeId && (
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                  <PlayCircle size={16} className="text-[#F4A5BE]" />
                  <span className="text-xs font-semibold text-gray-600 tracking-wide uppercase">Product Video</span>
                </div>
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                    title="Product Video"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-5">
            <div>
              <p className="section-subtitle text-[#F4A5BE] mb-2">{product.category}</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-[#111111] leading-tight mb-3">{product.name}</h1>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-[#F4A5BE] text-[#F4A5BE]" />)}
                </div>
                <span className="text-xs text-gray-400">(48 reviews)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="font-bold text-3xl text-[#111111]">₹{Number(product.price).toLocaleString('en-IN')}</span>
              {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                <>
                  <span className="text-gray-400 text-sm line-through">₹{Number(product.originalPrice).toLocaleString('en-IN')}</span>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded">
                    {Math.round((product.originalPrice - product.price) / product.originalPrice * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Color */}
            {colors.length > 1 && (
              <div>
                <p className="text-sm font-semibold text-[#111111] mb-2">Color: <span className="font-normal text-gray-500">{selectedColor || colors[0]}</span></p>
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
                    <button key={color} onClick={() => setSelectedColor(color)} className={`px-4 py-1.5 text-sm border rounded-full transition-all ${(selectedColor || colors[0]) === color ? 'border-[#111111] bg-[#111111] text-white' : 'border-gray-300 text-gray-600 hover:border-[#F4A5BE]'}`}>{color}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className={`text-sm font-semibold ${sizeError ? 'text-red-500' : 'text-[#111111]'}`}>
                  Size {sizeError && <span className="text-red-500 font-normal text-xs ml-1">— Please select a size</span>}
                </p>
                <button onClick={() => setShowSizeChart(!showSizeChart)} className="text-xs text-[#F4A5BE] underline flex items-center gap-1">
                  Size Chart <ChevronDown size={12} className={`transition-transform ${showSizeChart ? 'rotate-180' : ''}`} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(product.sizes || []).map(size => (
                  <button key={size} onClick={() => { setSelectedSize(size); setSizeError(false); }} className={`size-badge text-sm px-4 py-2 ${selectedSize === size ? 'active' : ''} ${sizeError ? 'border-red-300' : ''}`}>{size}</button>
                ))}
              </div>

              {showSizeChart && (
                <div className="mt-4 border border-gray-100 rounded-xl overflow-hidden animate-fade-in">
                  <table className="w-full text-xs text-center">
                    <thead className="bg-[#F9C4D2]/40">
                      <tr>
                        <th className="py-2 px-3 font-semibold text-left">Size</th>
                        <th className="py-2 px-3 font-semibold">Chest (in)</th>
                        <th className="py-2 px-3 font-semibold">Waist (in)</th>
                        <th className="py-2 px-3 font-semibold">Hip (in)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        {s:'XS',c:'32',w:'26',h:'35'},{s:'S',c:'34',w:'28',h:'37'},
                        {s:'M',c:'36',w:'30',h:'39'},{s:'L',c:'38',w:'32',h:'41'},
                        {s:'XL',c:'40',w:'34',h:'43'},{s:'2XL',c:'42',w:'36',h:'45'},
                        {s:'3XL',c:'44',w:'38',h:'47'},{s:'4XL',c:'46',w:'40',h:'49'},
                        {s:'5XL',c:'48',w:'42',h:'51'},{s:'6XL',c:'50',w:'44',h:'53'},
                      ].map(row => (
                        <tr key={row.s} className={selectedSize === row.s ? 'bg-[#FDE8EF]' : 'hover:bg-gray-50'}>
                          <td className="py-2 px-3 text-left font-semibold">{row.s}</td>
                          <td className="py-2 px-3">{row.c}"</td>
                          <td className="py-2 px-3">{row.w}"</td>
                          <td className="py-2 px-3">{row.h}"</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Qty */}
            <div>
              <p className="text-sm font-semibold text-[#111111] mb-2">Quantity</p>
              <div className="flex items-center gap-0">
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span className="w-12 h-8 border-y border-gray-300 flex items-center justify-center text-sm font-semibold">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button onClick={handleAddToCart} className={`flex-1 py-4 font-bold tracking-widest uppercase text-sm flex items-center justify-center gap-2 transition-all ${added ? 'bg-green-500 text-white' : 'btn-primary'}`}>
                <ShoppingBag size={16} /> {added ? 'Added to Cart!' : 'Add to Cart'}
              </button>
              <button onClick={handleBuyNow} className="flex-1 py-4 bg-[#F9C4D2] text-[#111111] font-bold tracking-widest uppercase text-sm flex items-center justify-center gap-2 hover:bg-[#F4A5BE] transition-all">
                <Zap size={16} /> Buy Now
              </button>
            </div>

            <div className="flex flex-wrap gap-4 pt-2 text-xs text-gray-500 border-t border-gray-100 pt-5">
              <span className="flex items-center gap-1.5"><Truck size={13} className="text-[#F4A5BE]" /> Free Delivery ₹999+</span>
              <span className="flex items-center gap-1.5"><RotateCcw size={13} className="text-[#F4A5BE]" /> 7-Day Easy Returns</span>
              <span className="flex items-center gap-1.5"><Shield size={13} className="text-[#F4A5BE]" /> COD Available</span>
            </div>

            {product.description && (
              <div className="border-t border-gray-100 pt-5">
                <h3 className="font-semibold text-[#111111] mb-3 text-sm tracking-wider uppercase">Product Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="section-title text-2xl mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map(p => (
                <div key={p.id} className="group card-hover">
                  <Link to={`/product/${p.id}`}>
                    <div className="product-img-wrap aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-gray-50">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-semibold text-sm text-[#111111] group-hover:text-[#F4A5BE] transition-colors">{p.name}</h3>
                    <p className="font-bold text-sm mt-1">₹{Number(p.price).toLocaleString('en-IN')}</p>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

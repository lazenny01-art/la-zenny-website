import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Eye } from 'lucide-react';

export default function ProductCard({ product, onAddToCart }) {
  const [liked, setLiked] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    onAddToCart({ ...product, selectedSize: selectedSize || product.sizes[1] || product.sizes[0] });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative bg-white card-hover rounded-sm overflow-hidden border border-transparent hover:border-pink-100">
      {/* Image */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="product-img-wrap relative aspect-[3/4] bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Badge */}
          {product.badge && (
            <span className={`absolute top-3 left-3 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 ${
              product.badge === 'Bestseller'
                ? 'bg-[#111111] text-white'
                : product.badge === 'Trending'
                ? 'bg-[#F4A5BE] text-[#111111]'
                : 'bg-[#F9C4D2] text-[#111111]'
            }`}>
              {product.badge}
            </span>
          )}
          {/* Quick actions overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <Link
              to={`/product/${product.id}`}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#F9C4D2] transition-colors shadow-md"
              aria-label="Quick view"
            >
              <Eye size={16} />
            </Link>
          </div>
          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center hover:bg-[#F9C4D2] transition-all shadow-sm opacity-0 group-hover:opacity-100"
            aria-label="Wishlist"
          >
            <Heart
              size={15}
              className={liked ? 'fill-[#F4A5BE] text-[#F4A5BE]' : 'text-gray-600'}
            />
          </button>
        </div>
      </Link>

      {/* Details */}
      <div className="p-3.5">
        {/* Category */}
        <p className="text-[10px] tracking-widest uppercase text-[#F4A5BE] font-semibold mb-1">
          {product.category}
        </p>
        {/* Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-[#111111] text-sm leading-snug hover:text-[#F4A5BE] transition-colors mb-1.5 line-clamp-2">
            {product.name}
          </h3>
        </Link>
        {/* Price */}
        <div className="mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-[#111111] text-base">₹{Number(product.price).toLocaleString('en-IN')}</span>
            {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
              <>
                <span className="text-gray-400 text-xs line-through">₹{Number(product.originalPrice).toLocaleString('en-IN')}</span>
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {Math.round((product.originalPrice - product.price) / product.originalPrice * 100)}% OFF
                </span>
              </>
            )}
          </div>
        </div>

        {/* Sizes */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`size-badge ${selectedSize === size ? 'active' : ''}`}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Add to Cart */}
        <button
          id={`add-to-cart-${product.id}`}
          onClick={handleAddToCart}
          className={`w-full py-2.5 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
            added
              ? 'bg-green-500 text-white'
              : 'bg-[#111111] text-white hover:bg-[#F9C4D2] hover:text-[#111111]'
          }`}
        >
          <ShoppingBag size={13} />
          {added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

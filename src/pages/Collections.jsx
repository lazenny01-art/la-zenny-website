import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { getProducts, getCategories } from '../firebase/firestore';
import ProductCard from '../components/ProductCard';

const catColors = [
  'from-purple-50 to-pink-50',
  'from-rose-50 to-pink-50',
  'from-blue-50 to-sky-50',
  'from-yellow-50 to-orange-50',
  'from-green-50 to-emerald-50',
];

export default function Collections({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="animate-fade-in">
      <section className="bg-gradient-to-br from-[#FDE8EF] via-white to-white py-20 text-center">
        <p className="section-subtitle text-[#F4A5BE] mb-3">Explore</p>
        <h1 className="section-title text-4xl md:text-5xl">Our Collections</h1>
        <p className="text-gray-500 mt-4 max-w-md mx-auto">Discover curated collections for every mood, occasion, and story.</p>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400">
            <Loader size={28} className="animate-spin mr-3" /> Loading collections...
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-24 bg-[#FDE8EF] rounded-3xl">
            <p className="text-5xl mb-4">🌸</p>
            <h3 className="font-display text-2xl font-bold text-[#111111] mb-2">Collections Coming Soon</h3>
            <p className="text-gray-500">We're curating beautiful collections for you. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-20">
            {categories.map((cat, index) => {
              const catProducts = products.filter(p => p.category === cat.name);
              return (
                <section key={cat.id} id={`collection-${cat.id}`}>
                  <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-r ${catColors[index % catColors.length]} mb-8`}>
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="p-10 md:p-14 flex flex-col justify-center">
                        <p className="section-subtitle text-[#F4A5BE] mb-2">Collection</p>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-[#111111] mb-4">{cat.name}</h2>
                        <p className="text-gray-600 mb-6 max-w-sm">
                          Explore our curated {cat.name} collection — handpicked styles made just for you.
                        </p>
                        <Link to={`/shop?category=${cat.name}`} className="btn-primary self-start">
                          Shop {cat.name}
                        </Link>
                      </div>
                      <div className="hidden md:block aspect-video md:aspect-auto bg-gray-100">
                        {catProducts[0]?.image && (
                          <img src={catProducts[0].image} alt={cat.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                    </div>
                  </div>

                  {catProducts.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 border border-dashed border-gray-200 rounded-2xl">
                      <p>No products in this category yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                      {catProducts.map(product => (
                        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

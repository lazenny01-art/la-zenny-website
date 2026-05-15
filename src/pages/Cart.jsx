import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, Truck, CreditCard, Shield, ArrowLeft } from 'lucide-react';

export default function Cart({ cartItems, onUpdateQty, onRemove }) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center animate-fade-in">
        <div className="inline-flex w-24 h-24 bg-[#FDE8EF] rounded-full items-center justify-center mb-6 mx-auto">
          <ShoppingBag size={40} className="text-[#F4A5BE]" />
        </div>
        <h2 className="font-display text-3xl font-bold mb-3 text-[#111111]">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet. Let's fix that!</p>
        <Link to="/shop" id="cart-go-shop" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-subtitle text-[#F4A5BE] mb-1">Your Bag</p>
          <h1 className="section-title">Shopping Cart</h1>
        </div>
        <Link to="/shop" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#F4A5BE] transition-colors">
          <ArrowLeft size={14} /> Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
              className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 hover:border-pink-200 transition-colors"
            >
              {/* Image */}
              <div className="w-24 h-28 rounded-xl overflow-hidden shrink-0 bg-gray-50 product-img-wrap">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] tracking-widest uppercase text-[#F4A5BE] font-semibold">{item.category}</p>
                    <h3 className="font-semibold text-[#111111] text-sm leading-snug mt-0.5">{item.name}</h3>
                    <div className="flex gap-3 mt-1 text-xs text-gray-500">
                      {item.selectedSize && <span className="bg-gray-100 px-2 py-0.5 rounded">Size: {item.selectedSize}</span>}
                      {item.selectedColor && <span className="bg-gray-100 px-2 py-0.5 rounded">{item.selectedColor}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(item.id, item.selectedSize)}
                    className="text-gray-300 hover:text-red-400 transition-colors p-1"
                    aria-label="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3 gap-2">
                  {/* Qty */}
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => onUpdateQty(item.id, item.selectedSize, item.qty - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">{item.qty}</span>
                    <button
                      onClick={() => onUpdateQty(item.id, item.selectedSize, item.qty + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                  {/* Price */}
                  <p className="font-bold text-[#111111]">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          ))}

          {/* COD Banner */}
          <div className="bg-[#FDE8EF] rounded-2xl p-4 flex items-center gap-3 border border-pink-100">
            <div className="w-10 h-10 bg-[#F9C4D2] rounded-full flex items-center justify-center shrink-0">
              <CreditCard size={18} className="text-[#111111]" />
            </div>
            <div>
              <p className="font-semibold text-sm text-[#111111]">Cash on Delivery Available! 💰</p>
              <p className="text-xs text-gray-500">Pay when your order arrives at your doorstep.</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-28">
            <h2 className="font-bold text-lg text-[#111111] mb-6">Order Summary</h2>

            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartItems.reduce((s, i) => s + i.qty, 0)} items)</span>
                <span className="font-semibold text-[#111111]">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : 'text-[#111111]'}`}>
                  {shipping === 0 ? 'FREE 🎉' : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-[#F4A5BE] bg-[#FDE8EF] px-3 py-2 rounded-lg">
                  Add ₹{(999 - subtotal).toLocaleString('en-IN')} more for FREE delivery!
                </p>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base text-[#111111]">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              id="proceed-to-checkout"
              className="w-full bg-[#111111] text-white py-4 font-bold tracking-widest uppercase text-sm hover:bg-[#F4A5BE] hover:text-[#111111] transition-all duration-300 mb-3"
            >
              Proceed to Checkout
            </button>

            <button className="w-full bg-[#F9C4D2] text-[#111111] py-3 font-semibold tracking-wider uppercase text-xs hover:bg-[#F4A5BE] transition-all duration-300">
              💰 Pay via COD
            </button>

            {/* Trust badges */}
            <div className="mt-6 pt-5 border-t border-gray-100 space-y-2">
              {[
                { icon: Truck, text: 'Free delivery on orders above ₹999' },
                { icon: Shield, text: 'Secure & trusted checkout' },
                { icon: CreditCard, text: 'COD available across India' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                  <Icon size={12} className="text-[#F4A5BE] shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

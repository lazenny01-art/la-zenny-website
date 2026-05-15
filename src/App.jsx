import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import Shop from './pages/Shop';
import Collections from './pages/Collections';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(
        item => item.id === product.id && item.selectedSize === product.selectedSize
      );
      if (existing) {
        return prev.map(item =>
          item.id === product.id && item.selectedSize === product.selectedSize
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, selectedSize, qty) => {
    if (qty <= 0) { removeFromCart(id, selectedSize); return; }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id && item.selectedSize === selectedSize ? { ...item, qty } : item
      )
    );
  };

  const removeFromCart = (id, selectedSize) => {
    setCartItems(prev =>
      prev.filter(item => !(item.id === id && item.selectedSize === selectedSize))
    );
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* ── Admin Routes (no Navbar/Footer) ── */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* ── Public Routes ── */}
          <Route
            path="/*"
            element={
              <div className="min-h-screen flex flex-col bg-white">
                <Navbar cartCount={cartCount} />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home onAddToCart={addToCart} />} />
                    <Route path="/shop" element={<Shop onAddToCart={addToCart} />} />
                    <Route path="/collections" element={<Collections onAddToCart={addToCart} />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/product/:id" element={<ProductDetail onAddToCart={addToCart} />} />
                    <Route path="/cart" element={<Cart cartItems={cartItems} onUpdateQty={updateQty} onRemove={removeFromCart} />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

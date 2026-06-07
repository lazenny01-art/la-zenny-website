import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Trash2, LogOut, Tag, Package, Upload, X,
  ChevronDown, Image as ImageIcon, Loader, CheckCircle,
  LayoutDashboard, AlertCircle, Pencil
} from "lucide-react";
import { logoutAdmin } from "../../firebase/auth";
import {
  getCategories, addCategory, updateCategory, deleteCategory,
  getProducts, addProduct, updateProduct, deleteProduct,
} from "../../firebase/firestore";
import { uploadToCloudinary } from "../../utils/cloudinary";

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"];
const BADGES = ["", "New", "Bestseller", "Trending"];

const emptyForm = {
  name: "", price: "", originalPrice: "", description: "", category: "",
  sizes: [], colors: "", badge: "", featured: false, youtubeUrl: "",
};

export default function AdminDashboard() {
  const [tab, setTab] = useState("products");
  const navigate = useNavigate();

  // Categories
  const [categories, setCategories] = useState([]);
  const [catForm, setCatForm] = useState({ name: '', description: '' });
  const [catImageFile, setCatImageFile] = useState(null);
  const [catImagePreview, setCatImagePreview] = useState('');
  const [catLoading, setCatLoading] = useState(false);
  const [catErrorMsg, setCatErrorMsg] = useState('');
  const [showCatForm, setShowCatForm] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const catFileInputRef = useRef();

  // Products
  const [products, setProducts] = useState([]);
  const [prodLoading, setProdLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [imageItems, setImageItems] = useState([]); // [{preview, file}]
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const fileInputRef = useRef();

  // Load data
  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Load categories error:', err);
      setSuccessMsg('');
    }
  };

  const loadProducts = async () => {
    setProdLoading(true);
    try {
      const prods = await getProducts();
      setProducts(prods);
    } catch (err) {
      console.error('Load products error:', err);
    } finally {
      setProdLoading(false);
    }
  };

  // ── Logout ──
  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/admin");
  };

  // ── Category actions ──
  const resetCatForm = () => {
    setCatForm({ name: '', description: '' });
    setCatImageFile(null);
    setCatImagePreview('');
    setShowCatForm(false);
    setEditingCat(null);
    setCatErrorMsg('');
  };

  const handleEditCategory = (cat) => {
    setEditingCat(cat);
    setCatForm({ name: cat.name || '', description: cat.description || '' });
    setCatImagePreview(cat.image || '');
    setCatImageFile(null);
    setShowCatForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!catForm.name.trim()) return;
    setCatLoading(true);
    setCatErrorMsg('');
    try {
      let imageUrl = catImagePreview;
      if (catImageFile) {
        try {
          imageUrl = await uploadToCloudinary(catImageFile, () => {});
        } catch (imgErr) {
          // Image upload failed — save category without image
          console.warn('Image upload failed, saving without image:', imgErr);
          imageUrl = '';
        }
      }
      const data = {
        name: catForm.name.trim(),
        description: catForm.description.trim(),
        image: imageUrl,
      };
      if (editingCat) {
        await updateCategory(editingCat.id, data);
        setSuccessMsg(`Category "${data.name}" updated!`);
      } else {
        await addCategory(data);
        setSuccessMsg(`Category "${data.name}" added!`);
      }
      resetCatForm();
      await loadCategories();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Category error:', err);
      setCatErrorMsg('Error: ' + (err.message || 'Something went wrong. Try again.'));
    } finally {
      setCatLoading(false);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? This won't delete its products.`)) return;
    await deleteCategory(id);
    await loadCategories();
  };

  // ── Product form ──
  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 6 - imageItems.length;
    if (remaining <= 0) return;
    const newItems = files.slice(0, remaining).map(f => ({
      preview: URL.createObjectURL(f),
      file: f,
    }));
    setImageItems(prev => [...prev, ...newItems]);
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImageItems(prev => prev.filter((_, i) => i !== index));
  };

  const toggleSize = (size) => {
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(size)
        ? f.sizes.filter(s => s !== size)
        : [...f.sizes, size],
    }));
  };

  const handleEditProduct = (prod) => {
    setEditingProduct(prod);
    setForm({
      name: prod.name || '',
      price: prod.price || '',
      originalPrice: prod.originalPrice || '',
      description: prod.description || '',
      category: prod.category || '',
      sizes: prod.sizes || [],
      colors: (prod.colors || []).join(', '),
      badge: prod.badge || '',
      featured: prod.featured || false,
      youtubeUrl: prod.youtubeUrl || '',
    });
    const existingImages = prod.images?.length ? prod.images : (prod.image ? [prod.image] : []);
    setImageItems(existingImages.map(url => ({ preview: url, file: null })));
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (imageItems.length === 0) {
      setErrorMsg("Please upload at least one product image.");
      return;
    }
    if (form.sizes.length === 0) {
      setErrorMsg("Please select at least one size.");
      return;
    }
    setSubmitting(true);
    try {
      const finalImages = [];
      for (let i = 0; i < imageItems.length; i++) {
        const item = imageItems[i];
        if (item.file) {
          const url = await uploadToCloudinary(item.file, i === 0 ? setUploadProgress : () => {});
          finalImages.push(url);
        } else {
          finalImages.push(item.preview);
        }
      }
      const productData = {
        name: form.name.trim(),
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        description: form.description.trim(),
        category: form.category,
        sizes: form.sizes,
        colors: form.colors.split(",").map(c => c.trim()).filter(Boolean),
        badge: form.badge || null,
        featured: form.featured,
        image: finalImages[0],
        images: finalImages,
        youtubeUrl: form.youtubeUrl.trim() || '',
      };
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        setSuccessMsg(`"${form.name}" updated successfully!`);
        setEditingProduct(null);
      } else {
        await addProduct(productData);
        setSuccessMsg(`"${form.name}" added successfully!`);
      }
      setForm(emptyForm);
      setImageItems([]);
      setUploadProgress(0);
      setShowForm(false);
      await loadProducts();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Product error:", err);
      setErrorMsg("Failed: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await deleteProduct(id);
    await loadProducts();
  };

  const resetForm = () => {
    setForm(emptyForm);
    setImageItems([]);
    setUploadProgress(0);
    setErrorMsg("");
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[#111111] border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#F9C4D2] rounded-lg flex items-center justify-center">
              <LayoutDashboard size={16} className="text-[#111111]" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-lg leading-none">LA ZENNY</p>
              <p className="text-[9px] tracking-[0.25em] uppercase text-[#F9C4D2]">Admin Dashboard</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors border border-white/10 px-4 py-2 rounded-lg hover:border-white/30"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Products", value: products.length, color: "from-pink-500/20 to-pink-600/10" },
            { label: "Categories", value: categories.length, color: "from-purple-500/20 to-purple-600/10" },
            { label: "Featured", value: products.filter(p => p.featured).length, color: "from-yellow-500/20 to-yellow-600/10" },
            { label: "New Arrivals", value: products.filter(p => p.badge === "New").length, color: "from-green-500/20 to-green-600/10" },
          ].map(stat => (
            <div key={stat.label} className={`bg-gradient-to-br ${stat.color} border border-white/10 rounded-xl p-4`}>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Success / Error messages */}
        {successMsg && (
          <div className="mb-4 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl flex items-center gap-2">
            <CheckCircle size={16} /> {successMsg}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-8 w-fit">
          {[
            { id: "products", icon: Package, label: "Products" },
            { id: "categories", icon: Tag, label: "Categories" },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                tab === t.id
                  ? "bg-[#F9C4D2] text-[#111111]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {/* ── CATEGORIES TAB ── */}
        {tab === "categories" && (
          <div className="space-y-6">

            {/* Add Category Button */}
            {!showCatForm && (
              <button
                id="show-add-category-form"
                onClick={() => setShowCatForm(true)}
                className="flex items-center gap-2 bg-[#F9C4D2] text-[#111111] px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#F4A5BE] transition-colors"
              >
                <Plus size={16} /> Add New Category
              </button>
            )}

            {/* Add Category Form */}
            {showCatForm && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-white text-lg">{editingCat ? 'Edit Category' : 'Add New Category'}</h2>
                  <button onClick={resetCatForm} className="text-gray-400 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleAddCategory} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="admin-label">Category Name *</label>
                    <input
                      id="category-name-input"
                      type="text"
                      required
                      value={catForm.name}
                      onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))}
                      className="admin-input"
                      placeholder="e.g. Co-ords, Tops, Dresses"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="admin-label">Description</label>
                    <textarea
                      id="category-description"
                      rows={2}
                      value={catForm.description}
                      onChange={e => setCatForm(f => ({ ...f, description: e.target.value }))}
                      className="admin-input resize-none"
                      placeholder="Short description of this category..."
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="admin-label">Category Image</label>
                    <div
                      onClick={() => catFileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                        catImagePreview ? 'border-[#F9C4D2]/50 bg-[#F9C4D2]/5' : 'border-white/20 hover:border-[#F9C4D2]/50'
                      }`}
                    >
                      {catImagePreview ? (
                        <div className="relative">
                          <img src={catImagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg mx-auto" />
                          <button
                            type="button"
                            onClick={e => { e.stopPropagation(); setCatImageFile(null); setCatImagePreview(''); }}
                            className="absolute -top-2 -right-2 mx-auto w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white"
                            style={{ left: 'calc(50% + 48px)' }}
                          >
                            <X size={12} />
                          </button>
                          <p className="text-gray-400 text-xs mt-3">Click to change image</p>
                        </div>
                      ) : (
                        <>
                          <ImageIcon size={32} className="mx-auto text-gray-500 mb-3" />
                          <p className="text-gray-400 text-sm">Click to upload category image</p>
                          <p className="text-gray-600 text-xs mt-1">JPG, PNG — shows on homepage</p>
                        </>
                      )}
                    </div>
                    <input
                      ref={catFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files[0];
                        if (!file) return;
                        setCatImageFile(file);
                        setCatImagePreview(URL.createObjectURL(file));
                      }}
                      className="hidden"
                    />
                  </div>

                  {/* Error Message */}
                  {catErrorMsg && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                      <AlertCircle size={16} /> {catErrorMsg}
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      id="add-category-btn"
                      type="submit"
                      disabled={catLoading}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#F9C4D2] text-[#111111] py-3.5 rounded-xl text-sm font-bold hover:bg-[#F4A5BE] transition-colors disabled:opacity-60"
                    >
                      {catLoading ? <><Loader size={16} className="animate-spin" /> Saving...</> : <><Upload size={16} /> Add Category</>}
                    </button>
                    <button
                      type="button"
                      onClick={resetCatForm}
                      className="px-6 py-3.5 border border-white/20 text-gray-400 rounded-xl hover:border-white/40 hover:text-white transition-colors text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Categories List */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="font-bold text-white text-base mb-5">
                All Categories ({categories.length})
              </h2>
              {categories.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <Tag size={32} className="mx-auto mb-3 opacity-30" />
                  <p>No categories yet. Add your first one above!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map(cat => (
                    <div
                      key={cat.id}
                      className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors group"
                    >
                      {/* Image */}
                      <div className="aspect-[4/3] bg-white/5 relative overflow-hidden">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                            <ImageIcon size={32} />
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-white font-semibold">{cat.name}</h3>
                            {cat.description && <p className="text-gray-400 text-xs mt-1 leading-relaxed">{cat.description}</p>}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditCategory(cat)}
                              className="text-gray-500 hover:text-[#F9C4D2] transition-colors p-1.5 hover:bg-[#F9C4D2]/10 rounded-lg shrink-0"
                              aria-label="Edit category"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              className="text-gray-500 hover:text-red-400 transition-colors p-1.5 hover:bg-red-400/10 rounded-lg shrink-0"
                              aria-label="Delete category"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PRODUCTS TAB ── */}
        {tab === "products" && (
          <div className="space-y-6">
            {/* Add product button */}
            {!showForm && (
              <button
                id="show-add-product-form"
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-[#F9C4D2] text-[#111111] px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#F4A5BE] transition-colors"
              >
                <Plus size={16} /> Add New Product
              </button>
            )}

            {/* Add Product Form */}
            {showForm && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-white text-lg">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                  <button onClick={resetForm} className="text-gray-400 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label className="admin-label">Product Name *</label>
                      <input
                        id="product-name"
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="admin-input"
                        placeholder="e.g. Miu Miu Co-ord Set"
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="admin-label">Price (₹) *</label>
                      <input
                        id="product-price"
                        type="number"
                        required
                        min="0"
                        value={form.price}
                        onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                        className="admin-input"
                        placeholder="e.g. 599"
                      />
                    </div>

                    {/* Original Price */}
                    <div>
                      <label className="admin-label">Original Price / MRP (₹) <span className="text-gray-500 font-normal">(Optional)</span></label>
                      <input
                        id="product-original-price"
                        type="number"
                        min="0"
                        value={form.originalPrice}
                        onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))}
                        className="admin-input"
                        placeholder="e.g. 999 — leave empty if no discount"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="admin-label">Category *</label>
                      <div className="relative">
                        <select
                          id="product-category"
                          required
                          value={form.category}
                          onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                          className="admin-input appearance-none pr-10"
                        >
                          <option value="">Select category</option>
                          {categories.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                      {categories.length === 0 && (
                        <p className="text-yellow-400 text-xs mt-1.5">⚠️ Add categories first in the Categories tab.</p>
                      )}
                    </div>

                    {/* Badge */}
                    <div>
                      <label className="admin-label">Badge</label>
                      <div className="relative">
                        <select
                          id="product-badge"
                          value={form.badge}
                          onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                          className="admin-input appearance-none pr-10"
                        >
                          {BADGES.map(b => (
                            <option key={b} value={b}>{b || "None"}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="admin-label">Description</label>
                    <textarea
                      id="product-description"
                      rows={3}
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      className="admin-input resize-none"
                      placeholder="Describe this product..."
                    />
                  </div>

                  {/* Colors */}
                  <div>
                    <label className="admin-label">Colors (comma separated)</label>
                    <input
                      id="product-colors"
                      type="text"
                      value={form.colors}
                      onChange={e => setForm(f => ({ ...f, colors: e.target.value }))}
                      className="admin-input"
                      placeholder="e.g. Pink, White, Black"
                    />
                  </div>

                  {/* Sizes */}
                  <div>
                    <label className="admin-label">Sizes *</label>
                    <div className="flex flex-wrap gap-2">
                      {ALL_SIZES.map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          className={`px-4 py-2 text-sm font-semibold border rounded-lg transition-all ${
                            form.sizes.includes(size)
                              ? "bg-[#F9C4D2] text-[#111111] border-[#F9C4D2]"
                              : "border-white/20 text-gray-400 hover:border-white/40"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Featured */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                      className={`w-11 h-6 rounded-full transition-colors relative ${
                        form.featured ? "bg-[#F9C4D2]" : "bg-white/20"
                      }`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        form.featured ? "translate-x-5.5 left-0.5" : "left-0.5"
                      }`} />
                    </div>
                    <span className="text-sm text-gray-300">Show in "New Arrivals" on homepage</span>
                  </label>

                  {/* Images Upload - Multiple (up to 6) */}
                  <div>
                    <label className="admin-label">
                      Product Images * <span className="text-gray-500 font-normal text-xs">({imageItems.length}/6) — first image is the main photo</span>
                    </label>

                    {/* Preview Grid */}
                    {imageItems.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                        {imageItems.map((item, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#F9C4D2]/40">
                            <img src={item.preview} alt={`Image ${idx + 1}`} className="w-full h-full object-cover" />
                            {idx === 0 && (
                              <span className="absolute top-1 left-1 bg-[#F9C4D2] text-[#111111] text-[8px] font-bold px-1 py-0.5 rounded uppercase leading-none">Main</span>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload area */}
                    {imageItems.length < 6 && (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-white/20 hover:border-[#F9C4D2]/50 rounded-xl p-5 text-center cursor-pointer transition-colors"
                      >
                        <ImageIcon size={28} className="mx-auto text-gray-500 mb-2" />
                        <p className="text-gray-400 text-sm">Click to add images ({6 - imageItems.length} slots remaining)</p>
                        <p className="text-gray-600 text-xs mt-1">JPG, PNG — you can select multiple at once</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAddImages}
                      className="hidden"
                    />

                    {/* Upload Progress */}
                    {submitting && uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Uploading images...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1.5">
                          <div
                            className="bg-[#F9C4D2] h-1.5 rounded-full transition-all"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* YouTube Video Link */}
                  <div>
                    <label className="admin-label">YouTube Video Link <span className="text-gray-500 font-normal">(Optional)</span></label>
                    <input
                      id="product-youtube"
                      type="text"
                      value={form.youtubeUrl}
                      onChange={e => setForm(f => ({ ...f, youtubeUrl: e.target.value }))}
                      className="admin-input"
                      placeholder="https://youtu.be/VIDEO_ID or https://youtube.com/watch?v=..."
                    />
                    <p className="text-gray-600 text-xs mt-1.5">💡 Set video as "Unlisted" on YouTube so it only shows on your website</p>
                  </div>

                  {/* Error */}
                  {errorMsg && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                      <AlertCircle size={16} /> {errorMsg}
                    </div>
                  )}

                  {/* Submit */}
                  <div className="flex gap-3 pt-2">
                    <button
                      id="submit-product"
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-[#F9C4D2] text-[#111111] font-bold tracking-wider uppercase text-sm py-3.5 rounded-xl hover:bg-[#F4A5BE] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <><Loader size={16} className="animate-spin" /> Saving...</>
                      ) : editingProduct ? (
                        <><Upload size={16} /> Update Product</>
                      ) : (
                        <><Upload size={16} /> Add Product</>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3.5 border border-white/20 text-gray-400 rounded-xl hover:border-white/40 hover:text-white transition-colors text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products Grid */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="font-bold text-white text-base mb-5">
                All Products ({products.length})
              </h2>

              {prodLoading ? (
                <div className="flex items-center justify-center py-16 text-gray-500">
                  <Loader size={24} className="animate-spin mr-3" />
                  Loading products...
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Package size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No products yet.</p>
                  <p className="text-sm mt-1">Click "Add New Product" to get started!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map(prod => (
                    <div
                      key={prod.id}
                      className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors group"
                    >
                      <div className="aspect-[4/3] bg-white/5 relative overflow-hidden">
                        {prod.image ? (
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                            <ImageIcon size={32} />
                          </div>
                        )}
                        {prod.badge && (
                          <span className="absolute top-2 left-2 bg-[#F9C4D2] text-[#111111] text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                            {prod.badge}
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] tracking-widest uppercase text-[#F9C4D2] mb-1">{prod.category}</p>
                        <h3 className="text-white font-semibold text-sm leading-snug">{prod.name}</h3>
                        <p className="text-white font-bold mt-1">₹{Number(prod.price).toLocaleString("en-IN")}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex gap-1">
                             {(prod.sizes || []).map(s => (
                              <span key={s} className="text-[10px] text-gray-400 border border-white/10 px-1.5 py-0.5 rounded">{s}</span>
                            ))}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditProduct(prod)}
                              className="text-gray-500 hover:text-[#F9C4D2] transition-colors p-1.5 hover:bg-[#F9C4D2]/10 rounded-lg"
                              aria-label={`Edit ${prod.name}`}
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              className="text-gray-500 hover:text-red-400 transition-colors p-1.5 hover:bg-red-400/10 rounded-lg"
                              aria-label={`Delete ${prod.name}`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

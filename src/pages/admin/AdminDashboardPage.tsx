import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  MessageSquare,
  Settings,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  DollarSign,
  Clock,
  ExternalLink,
  X,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { api } from '../../services/api.ts';
import type {
  Product,
  Category,
  Order,
  ContactMessage,
  StoreSettings,
  DashboardStats,
  OrderStatus,
} from '../../types/index.ts';

interface AdminDashboardPageProps {
  onGoToSite: () => void;
  onRefreshData?: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onGoToSite,
  onRefreshData,
}) => {
  const { user, token, logout } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'orders' | 'contacts' | 'settings'>('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(false);

  // Modals state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    nameUz: '',
    nameRu: '',
    descriptionUz: '',
    descriptionRu: '',
    price: 250000,
    oldPrice: 0,
    categoryId: '',
    image: '/src/assets/images/hero_pink_cake_1790917416304.jpg',
    stock: 20,
    weight: '1.2 kg',
    ingredientsUz: 'Tabiiy shokolad, un, sariyog‘, tuxum',
    ingredientsRu: 'Натуральный шоколад, мука, сливочное масло',
    isFeatured: true,
  });

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    nameUz: '',
    nameRu: '',
    image: '/src/assets/images/cat_chocolate_cake_1790917450877.jpg',
  });

  const loadAll = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [sData, pData, cData, oData, mData, settsData] = await Promise.all([
        api.getStats(token),
        api.getProducts(),
        api.getCategories(),
        api.getOrders(token),
        api.getContacts(token),
        api.getSettings(),
      ]);
      setStats(sData);
      setProducts(pData);
      setCategories(cData);
      setOrders(oData);
      setContacts(mData);
      setSettings(settsData);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [token]);

  // Product CRUD
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      nameUz: '',
      nameRu: '',
      descriptionUz: '',
      descriptionRu: '',
      price: 250000,
      oldPrice: 0,
      categoryId: categories[0]?.id || 'cat-1',
      image: '/src/assets/images/hero_pink_cake_1790917416304.jpg',
      stock: 20,
      weight: '1.2 kg',
      ingredientsUz: 'Tabiiy shokolad, sariyog‘, tuxum, mevalar',
      ingredientsRu: 'Натуральный шоколад, сливочное масло, ягоды',
      isFeatured: true,
    });
    setProductModalOpen(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      nameUz: p.nameUz,
      nameRu: p.nameRu,
      descriptionUz: p.descriptionUz,
      descriptionRu: p.descriptionRu,
      price: p.price,
      oldPrice: p.oldPrice || 0,
      categoryId: p.categoryId,
      image: p.image,
      stock: p.stock,
      weight: p.weight,
      ingredientsUz: p.ingredientsUz,
      ingredientsRu: p.ingredientsRu,
      isFeatured: p.isFeatured,
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productForm, token);
      } else {
        await api.createProduct(productForm, token);
      }
      setProductModalOpen(false);
      loadAll();
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!token || !confirm('Ushbu mahsulotni o‘chirishni xohlaysizmi?')) return;
    try {
      await api.deleteProduct(id, token);
      loadAll();
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
    }
  };

  // Category CRUD
  const openAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      nameUz: '',
      nameRu: '',
      image: '/src/assets/images/cat_chocolate_cake_1790917450877.jpg',
    });
    setCategoryModalOpen(true);
  };

  const openEditCategory = (c: Category) => {
    setEditingCategory(c);
    setCategoryForm({
      nameUz: c.nameUz,
      nameRu: c.nameRu,
      image: c.image,
    });
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, categoryForm, token);
      } else {
        await api.createCategory(categoryForm, token);
      }
      setCategoryModalOpen(false);
      loadAll();
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!token || !confirm('Kategoriyani o‘chirmoqchimisiz?')) return;
    try {
      await api.deleteCategory(id, token);
      loadAll();
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
    }
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    if (!token) return;
    try {
      await api.updateOrderStatus(orderId, status, token);
      loadAll();
    } catch (err: any) {
      alert(err.message || 'Holatni yangilashda xatolik');
    }
  };

  // Contact operations
  const handleMarkContactRead = async (id: string) => {
    if (!token) return;
    try {
      await api.markContactRead(id, token);
      loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteContact = async (id: string) => {
    if (!token || !confirm('Xabarni o‘chirishni xohlaysizmi?')) return;
    try {
      await api.deleteContact(id, token);
      loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  // Settings update
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !settings) return;
    try {
      await api.updateSettings(settings, token);
      alert('Sozlamalar saqlandi!');
      loadAll();
    } catch (err: any) {
      alert(err.message || 'Xatolik');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7FA] text-[#4A2630]">
      {/* Admin Top Navigation */}
      <header className="bg-white border-b border-[#F8BBD0] px-4 sm:px-8 py-3.5 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#FCE4EC] text-[#D81B60] flex items-center justify-center font-bold">
            Z
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#4A2630] leading-none">
              Zahro Admin
            </h1>
            <span className="text-[10px] text-[#8A6870]">
              {user?.name} ({user?.username})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onGoToSite}
            className="px-3.5 py-1.5 rounded-full bg-[#FFF7FA] hover:bg-[#FCE4EC] text-xs font-semibold text-[#D81B60] flex items-center gap-1.5 border border-[#F8BBD0] transition-colors"
          >
            <span>Saytga o‘tish</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={logout}
            className="p-2 rounded-full text-[#8A6870] hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Chiqish"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Admin Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-[#D81B60] text-white shadow-xs'
                : 'bg-white text-[#8A6870] hover:text-[#4A2630] border border-[#F8BBD0]/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{t.admin.tabs.dashboard}</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-colors ${
              activeTab === 'products'
                ? 'bg-[#D81B60] text-white shadow-xs'
                : 'bg-white text-[#8A6870] hover:text-[#4A2630] border border-[#F8BBD0]/60'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>{t.admin.tabs.products}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#FFF7FA] text-[#D81B60] border border-[#F8BBD0]">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-colors ${
              activeTab === 'categories'
                ? 'bg-[#D81B60] text-white shadow-xs'
                : 'bg-white text-[#8A6870] hover:text-[#4A2630] border border-[#F8BBD0]/60'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>{t.admin.tabs.categories}</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-colors ${
              activeTab === 'orders'
                ? 'bg-[#D81B60] text-white shadow-xs'
                : 'bg-white text-[#8A6870] hover:text-[#4A2630] border border-[#F8BBD0]/60'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t.admin.tabs.orders}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#FFF7FA] text-[#D81B60] border border-[#F8BBD0]">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-colors ${
              activeTab === 'contacts'
                ? 'bg-[#D81B60] text-white shadow-xs'
                : 'bg-white text-[#8A6870] hover:text-[#4A2630] border border-[#F8BBD0]/60'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{t.admin.tabs.contacts}</span>
            {stats && stats.unreadMessages > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-bold">
                {stats.unreadMessages}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-colors ${
              activeTab === 'settings'
                ? 'bg-[#D81B60] text-white shadow-xs'
                : 'bg-white text-[#8A6870] hover:text-[#4A2630] border border-[#F8BBD0]/60'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{t.admin.tabs.settings}</span>
          </button>
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-6">
            {/* 4 Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-[#F8BBD0] shadow-xs">
                <div className="flex items-center justify-between text-[#8A6870] mb-2 text-xs">
                  <span>{t.admin.stats.totalProducts}</span>
                  <Package className="w-4 h-4 text-[#D81B60]" />
                </div>
                <div className="text-2xl font-bold text-[#4A2630] tabular-nums">
                  {stats.totalProducts}
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#F8BBD0] shadow-xs">
                <div className="flex items-center justify-between text-[#8A6870] mb-2 text-xs">
                  <span>{t.admin.stats.totalOrders}</span>
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-[#4A2630] tabular-nums">
                  {stats.totalOrders}
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#F8BBD0] shadow-xs">
                <div className="flex items-center justify-between text-[#8A6870] mb-2 text-xs">
                  <span>{t.admin.stats.pendingOrders}</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-bold text-amber-600 tabular-nums">
                  {stats.pendingOrders}
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#F8BBD0] shadow-xs">
                <div className="flex items-center justify-between text-[#8A6870] mb-2 text-xs">
                  <span>{t.admin.stats.revenue}</span>
                  <DollarSign className="w-4 h-4 text-[#D81B60]" />
                </div>
                <div className="text-xl font-bold text-[#D81B60] tabular-nums">
                  {stats.totalRevenue.toLocaleString()} {t.featured.currency}
                </div>
              </div>
            </div>

            {/* Recent Orders table */}
            <div className="bg-white rounded-3xl p-6 border border-[#F8BBD0] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#4A2630]">
                  So‘nggi buyurtmalar
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-[#D81B60] hover:underline"
                >
                  Barchasini ko‘rish →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#FCE4EC] text-[#8A6870]">
                      <th className="pb-3 font-semibold">Buyurtma №</th>
                      <th className="pb-3 font-semibold">Mijoz</th>
                      <th className="pb-3 font-semibold">Telefon</th>
                      <th className="pb-3 font-semibold">Sana</th>
                      <th className="pb-3 font-semibold">Summa</th>
                      <th className="pb-3 font-semibold">Holati</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FCE4EC]">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#FFF7FA]">
                        <td className="py-3 font-mono font-bold text-[#D81B60]">
                          #{ord.orderNumber}
                        </td>
                        <td className="py-3 font-medium text-[#4A2630]">
                          {ord.customerName}
                        </td>
                        <td className="py-3 text-[#8A6870]">{ord.phone}</td>
                        <td className="py-3 text-[#8A6870]">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 font-bold text-[#4A2630] tabular-nums">
                          {ord.total.toLocaleString()} {t.featured.currency}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              ord.status === 'Yetkazildi'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'Bekor qilindi'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS CRUD */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 border border-[#F8BBD0] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#FCE4EC]">
              <div>
                <h2 className="text-base font-bold text-[#4A2630]">
                  {t.admin.tabs.products}
                </h2>
                <p className="text-xs text-[#8A6870]">
                  {products.length} ta mahsulot mavjud
                </p>
              </div>

              <button
                onClick={openAddProduct}
                className="px-4 py-2 rounded-full bg-[#D81B60] hover:bg-[#AD1457] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.admin.actions.add}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#FCE4EC] text-[#8A6870]">
                    <th className="pb-3 font-semibold">Rasm</th>
                    <th className="pb-3 font-semibold">Nomi (UZ / RU)</th>
                    <th className="pb-3 font-semibold">Narxi</th>
                    <th className="pb-3 font-semibold">Omborda</th>
                    <th className="pb-3 font-semibold">Tavsiya</th>
                    <th className="pb-3 font-semibold text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#FCE4EC]">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FFF7FA]">
                      <td className="py-3">
                        <img
                          src={p.image}
                          alt={p.nameUz}
                          className="w-10 h-10 rounded-xl object-cover border border-[#F8BBD0]"
                          referrerPolicy="no-referrer"
                        />
                      </td>
                      <td className="py-3">
                        <div className="font-bold text-[#4A2630]">{p.nameUz}</div>
                        <div className="text-[11px] text-[#8A6870]">{p.nameRu}</div>
                      </td>
                      <td className="py-3 font-bold text-[#D81B60] tabular-nums">
                        {p.price.toLocaleString()} {t.featured.currency}
                      </td>
                      <td className="py-3 text-[#4A2630] tabular-nums">
                        {p.stock} dona
                      </td>
                      <td className="py-3">
                        {p.isFeatured ? (
                          <span className="text-emerald-600 font-bold">Ha</span>
                        ) : (
                          <span className="text-[#8A6870]">Yo‘q</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => openEditProduct(p)}
                            className="p-1.5 rounded-lg text-[#8A6870] hover:text-[#D81B60] hover:bg-[#FFF7FA]"
                            title="Tahrirlash"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 rounded-lg text-[#8A6870] hover:text-rose-600 hover:bg-rose-50"
                            title="O‘chirish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIES CRUD */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-3xl p-6 border border-[#F8BBD0] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#FCE4EC]">
              <div>
                <h2 className="text-base font-bold text-[#4A2630]">
                  {t.admin.tabs.categories}
                </h2>
                <p className="text-xs text-[#8A6870]">
                  {categories.length} ta kategoriya
                </p>
              </div>

              <button
                onClick={openAddCategory}
                className="px-4 py-2 rounded-full bg-[#D81B60] hover:bg-[#AD1457] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.admin.actions.add}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="bg-[#FFF7FA] p-4 rounded-2xl border border-[#F8BBD0] flex items-center gap-4"
                >
                  <img
                    src={c.image}
                    alt={c.nameUz}
                    className="w-14 h-14 rounded-xl object-cover border border-[#F8BBD0]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#4A2630] truncate">{c.nameUz}</h4>
                    <p className="text-xs text-[#8A6870] truncate">{c.nameRu}</p>
                    <span className="text-[11px] text-[#D81B60] font-semibold">
                      {c.productCount} ta mahsulot
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => openEditCategory(c)}
                      className="p-1 rounded text-[#8A6870] hover:text-[#D81B60]"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(c.id)}
                      className="p-1 rounded text-[#8A6870] hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 border border-[#F8BBD0] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#FCE4EC]">
              <div>
                <h2 className="text-base font-bold text-[#4A2630]">
                  {t.admin.tabs.orders}
                </h2>
                <p className="text-xs text-[#8A6870]">
                  Jami {orders.length} ta buyurtma
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-[#FFF7FA] p-5 rounded-2xl border border-[#F8BBD0] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-[#D81B60]">
                        #{ord.orderNumber}
                      </span>
                      <span className="text-xs text-[#8A6870]">
                        {new Date(ord.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-[#4A2630]">
                      {ord.customerName} ({ord.phone})
                    </div>
                    <div className="text-xs text-[#8A6870]">
                      📍 {ord.address} | 🕒 {ord.deliveryDate} ({ord.deliveryTime})
                    </div>
                    {ord.comment && (
                      <div className="text-xs text-[#D81B60] italic">
                        «{ord.comment}»
                      </div>
                    )}
                    <div className="text-xs text-[#4A2630] font-medium pt-1">
                      {ord.items.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-auto shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-[#8A6870] block">To‘lov ({ord.paymentMethod}):</span>
                      <span className="text-base font-bold text-[#D81B60] tabular-nums">
                        {ord.total.toLocaleString()} {t.featured.currency}
                      </span>
                    </div>

                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className="bg-white border border-[#F8BBD0] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#4A2630] outline-none cursor-pointer focus:border-[#D81B60]"
                    >
                      <option value="Yangi">Yangi</option>
                      <option value="Tasdiqlangan">Tasdiqlangan</option>
                      <option value="Tayyorlanmoqda">Tayyorlanmoqda</option>
                      <option value="Yetkazilmoqda">Yetkazilmoqda</option>
                      <option value="Yetkazildi">Yetkazildi</option>
                      <option value="Bekor qilindi">Bekor qilindi</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CONTACT MESSAGES */}
        {activeTab === 'contacts' && (
          <div className="bg-white rounded-3xl p-6 border border-[#F8BBD0] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#4A2630] pb-4 border-b border-[#FCE4EC]">
              {t.admin.tabs.contacts}
            </h2>

            <div className="space-y-3">
              {contacts.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-2xl border transition-colors ${
                    msg.isRead
                      ? 'bg-[#FFF7FA] border-[#F8BBD0]/60'
                      : 'bg-white border-[#D81B60]/40 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-[#4A2630]">
                          {msg.name}
                        </span>
                        <span className="text-xs text-[#8A6870]">
                          ({msg.phone} {msg.email ? `• ${msg.email}` : ''})
                        </span>
                        {!msg.isRead && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                            Yangi
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#4A2630] mt-1.5 leading-relaxed">
                        {msg.message}
                      </p>
                      <span className="text-[10px] text-[#8A6870] mt-2 block">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!msg.isRead && (
                        <button
                          onClick={() => handleMarkContactRead(msg.id)}
                          className="px-3 py-1 bg-white border border-[#F8BBD0] rounded-lg text-xs font-semibold text-[#D81B60] hover:bg-[#FCE4EC]"
                        >
                          {t.admin.actions.markRead}
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteContact(msg.id)}
                        className="p-1.5 rounded-lg text-[#8A6870] hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: STORE SETTINGS */}
        {activeTab === 'settings' && settings && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F8BBD0] shadow-xs max-w-2xl">
            <h2 className="text-base font-bold text-[#4A2630] pb-4 border-b border-[#FCE4EC] mb-6">
              {t.admin.tabs.settings}
            </h2>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#4A2630] mb-1">
                  Do‘kon nomi:
                </label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  className="w-full bg-[#FFF7FA] border border-[#F8BBD0] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#D81B60]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#4A2630] mb-1">
                    Telefon:
                  </label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full bg-[#FFF7FA] border border-[#F8BBD0] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#D81B60]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#4A2630] mb-1">
                    Email:
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full bg-[#FFF7FA] border border-[#F8BBD0] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#D81B60]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#4A2630] mb-1">
                  Manzil:
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full bg-[#FFF7FA] border border-[#F8BBD0] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#D81B60]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#4A2630] mb-1">
                    Yetkazib berish narxi (so‘m):
                  </label>
                  <input
                    type="number"
                    value={settings.deliveryPrice}
                    onChange={(e) => setSettings({ ...settings, deliveryPrice: Number(e.target.value) })}
                    className="w-full bg-[#FFF7FA] border border-[#F8BBD0] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#D81B60]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#4A2630] mb-1">
                    Bepul yetkazish chegarasi (so‘m):
                  </label>
                  <input
                    type="number"
                    value={settings.freeDeliveryThreshold}
                    onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                    className="w-full bg-[#FFF7FA] border border-[#F8BBD0] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#D81B60]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 px-6 py-2.5 rounded-full bg-[#D81B60] hover:bg-[#AD1457] text-white font-semibold transition-colors cursor-pointer"
              >
                {t.admin.actions.save}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* PRODUCT MODAL (Create/Edit) */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-[#F8BBD0] shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#FCE4EC] mb-4">
              <h3 className="font-serif text-lg font-bold text-[#4A2630]">
                {editingProduct ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo‘shish'}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="p-1 rounded-full text-[#8A6870] hover:text-[#4A2630]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Nomi (UZ): *</label>
                  <input
                    type="text"
                    required
                    value={productForm.nameUz}
                    onChange={(e) => setProductForm({ ...productForm, nameUz: e.target.value })}
                    className="w-full bg-[#FFF7FA] border border-[#F8BBD0] rounded-xl px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Nomi (RU): *</label>
                  <input
                    type="text"
                    required
                    value={productForm.nameRu}
                    onChange={(e) => setProductForm({ ...productForm, nameRu: e.target.value })}
                    className="w-full bg-[#FFF7FA] border border-[#F8BBD0] rounded-xl px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Narxi (so‘m): *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-[#FFF7FA] border border-[#F8BBD0] rounded-xl px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Eski narxi (so‘m):</label>
                  <input
                    type="number"
                    value={productForm.oldPrice}
                    onChange={(e) => setProductForm({ ...productForm, oldPrice: Number(e.target.value) })}
                    className="w-full bg-[#FFF7FA] border border-[#F8BBD0] rounded-xl px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Kategoriya: *</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full bg-[#FFF7FA] border border-[#F8BBD0] rounded-xl px-3 py-2 outline-none cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameUz}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Vazni:</label>
                  <input
                    type="text"
                    value={productForm.weight}
                    onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })}
                    className="w-full bg-[#FFF7FA] border border-[#F8BBD0] rounded-xl px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Rasm URL:</label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full bg-[#FFF7FA] border border-[#F8BBD0] rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Tavsif (UZ):</label>
                <textarea
                  rows={2}
                  value={productForm.descriptionUz}
                  onChange={(e) => setProductForm({ ...productForm, descriptionUz: e.target.value })}
                  className="w-full bg-[#FFF7FA] border border-[#F8BBD0] rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Tavsif (RU):</label>
                <textarea
                  rows={2}
                  value={productForm.descriptionRu}
                  onChange={(e) => setProductForm({ ...productForm, descriptionRu: e.target.value })}
                  className="w-full bg-[#FFF7FA] border border-[#F8BBD0] rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featCheck"
                  checked={productForm.isFeatured}
                  onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                  className="rounded text-[#D81B60]"
                />
                <label htmlFor="featCheck" className="font-semibold cursor-pointer">
                  Tavsiya etilgan mahsulotlar (Bosh sahifada ko‘rsatish)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#FCE4EC]">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FFF7FA] text-[#8A6870]"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D81B60] text-white font-semibold"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 border border-[#F8BBD0] shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#FCE4EC] mb-4">
              <h3 className="font-serif text-lg font-bold text-[#4A2630]">
                {editingCategory ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya'}
              </h3>
              <button
                onClick={() => setCategoryModalOpen(false)}
                className="p-1 rounded-full text-[#8A6870] hover:text-[#4A2630]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nomi (UZ): *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.nameUz}
                  onChange={(e) => setCategoryForm({ ...categoryForm, nameUz: e.target.value })}
                  className="w-full bg-[#FFF7FA] border border-[#F8BBD0] rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Nomi (RU): *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.nameRu}
                  onChange={(e) => setCategoryForm({ ...categoryForm, nameRu: e.target.value })}
                  className="w-full bg-[#FFF7FA] border border-[#F8BBD0] rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Rasm URL:</label>
                <input
                  type="text"
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  className="w-full bg-[#FFF7FA] border border-[#F8BBD0] rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#FCE4EC]">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FFF7FA] text-[#8A6870]"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D81B60] text-white font-semibold"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { FavoritesProvider } from './context/FavoritesContext.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';

import { Header } from './components/layout/Header.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { MobileBottomNav } from './components/layout/MobileBottomNav.tsx';
import { SearchModal } from './components/common/SearchModal.tsx';
import { Toast } from './components/common/Toast.tsx';

import { HomePage } from './pages/HomePage.tsx';
import { ProductsPage } from './pages/ProductsPage.tsx';
import { ProductDetailPage } from './pages/ProductDetailPage.tsx';
import { CartPage } from './pages/CartPage.tsx';
import { CheckoutPage } from './pages/CheckoutPage.tsx';
import { FavoritesPage } from './pages/FavoritesPage.tsx';
import { OrderTrackingPage } from './pages/OrderTrackingPage.tsx';
import { AboutPage, DeliveryPage, ContactPage } from './pages/StaticPages.tsx';
import { AdminLoginPage } from './pages/admin/AdminLoginPage.tsx';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.tsx';

import { api } from './services/api.ts';
import type { Category, Product } from './types/index.ts';

function MainApp() {
  const { isAuthenticated } = useAuth();

  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('popular');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [trackingOrderNumber, setTrackingOrderNumber] = useState<string>('');
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Data state
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Load catalog data
  const fetchData = async () => {
    try {
      const [cats, prods] = await Promise.all([
        api.getCategories(),
        api.getProducts(),
      ]);
      setCategories(cats);
      setProducts(prods);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sync with browser URL / history
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        setCurrentTab(isAuthenticated ? 'admin' : 'admin-login');
      } else if (path === '/cart') {
        setCurrentTab('cart');
      } else if (path === '/checkout') {
        setCurrentTab('checkout');
      } else if (path === '/products') {
        setCurrentTab('products');
      } else if (path === '/favorites') {
        setCurrentTab('favorites');
      } else if (path.startsWith('/products/')) {
        const id = path.replace('/products/', '');
        setSelectedProductId(id);
        setCurrentTab('product-detail');
      } else if (path === '/about') {
        setCurrentTab('about');
      } else if (path === '/delivery') {
        setCurrentTab('delivery');
      } else if (path === '/contact') {
        setCurrentTab('contact');
      } else {
        setCurrentTab('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated]);

  const navigate = (tab: string, param?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentTab(tab);

    if (tab === 'home') {
      window.history.pushState(null, '', '/');
    } else if (tab === 'products') {
      if (param) {
        setSelectedCategory(param);
      }
      window.history.pushState(null, '', '/products');
    } else if (tab === 'product-detail' && param) {
      setSelectedProductId(param);
      window.history.pushState(null, '', `/products/${param}`);
    } else if (tab === 'cart') {
      window.history.pushState(null, '', '/cart');
    } else if (tab === 'checkout') {
      window.history.pushState(null, '', '/checkout');
    } else if (tab === 'favorites') {
      window.history.pushState(null, '', '/favorites');
    } else if (tab === 'track-order') {
      if (param) setTrackingOrderNumber(param);
      window.history.pushState(null, '', '/track');
    } else if (tab === 'about') {
      window.history.pushState(null, '', '/about');
    } else if (tab === 'delivery') {
      window.history.pushState(null, '', '/delivery');
    } else if (tab === 'contact') {
      window.history.pushState(null, '', '/contact');
    } else if (tab === 'admin') {
      window.history.pushState(null, '', '/admin');
    } else if (tab === 'admin-login') {
      window.history.pushState(null, '', '/admin/login');
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    navigate('product-detail', productId);
  };

  const handleSelectCategory = (catSlug: string) => {
    setSelectedCategory(catSlug);
    navigate('products', catSlug);
  };

  const handleViewAllSearchResults = (query: string) => {
    setSearchQuery(query);
    navigate('products');
  };

  // Filtered products list for ProductsPage
  let filteredProducts = [...products];
  if (selectedCategory && selectedCategory !== 'all') {
    filteredProducts = filteredProducts.filter(
      (p) => p.categorySlug === selectedCategory || p.categoryId === selectedCategory
    );
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.nameUz.toLowerCase().includes(q) ||
        p.nameRu.toLowerCase().includes(q) ||
        p.descriptionUz.toLowerCase().includes(q) ||
        p.descriptionRu.toLowerCase().includes(q)
    );
  }
  if (selectedSort === 'cheap') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (selectedSort === 'expensive') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (selectedSort === 'popular') {
    filteredProducts.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
  } else if (selectedSort === 'new') {
    filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Selected product for detail view
  const currentProduct = products.find((p) => p.id === selectedProductId || p.slug === selectedProductId);
  const relatedProducts = currentProduct
    ? products.filter((p) => p.categoryId === currentProduct.categoryId && p.id !== currentProduct.id)
    : [];

  // Admin dashboard view
  if (currentTab === 'admin' && isAuthenticated) {
    return (
      <AdminDashboardPage
        onGoToSite={() => navigate('home')}
        onRefreshData={fetchData}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F5] text-[#4A2630]">
      {/* Header */}
      <Header
        currentTab={currentTab}
        onNavigate={navigate}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main page view */}
      <main className="flex-1 pb-16 md:pb-0">
        {currentTab === 'home' && (
          <HomePage
            categories={categories}
            products={products}
            onNavigate={navigate}
            onSelectCategory={handleSelectCategory}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentTab === 'products' && (
          <ProductsPage
            products={filteredProducts}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedSort={selectedSort}
            onSelectSort={setSelectedSort}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
            onSelectProduct={handleSelectProduct}
            loading={loading}
          />
        )}

        {currentTab === 'product-detail' && currentProduct && (
          <ProductDetailPage
            product={currentProduct}
            relatedProducts={relatedProducts}
            onBack={() => navigate('products')}
            onSelectProduct={handleSelectProduct}
            onBuyNow={() => navigate('checkout')}
          />
        )}

        {currentTab === 'cart' && (
          <CartPage
            onNavigate={navigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentTab === 'checkout' && (
          <CheckoutPage
            onOrderSuccess={(ordNumber) => {
              setTrackingOrderNumber(ordNumber);
            }}
            onNavigate={navigate}
          />
        )}

        {currentTab === 'favorites' && (
          <FavoritesPage
            products={products}
            onSelectProduct={handleSelectProduct}
            onNavigate={navigate}
          />
        )}

        {currentTab === 'track-order' && (
          <OrderTrackingPage
            initialOrderNumber={trackingOrderNumber}
            onNavigate={navigate}
          />
        )}

        {currentTab === 'about' && (
          <AboutPage onNavigate={navigate} />
        )}

        {currentTab === 'delivery' && (
          <DeliveryPage />
        )}

        {currentTab === 'contact' && (
          <ContactPage />
        )}

        {currentTab === 'admin-login' && (
          <AdminLoginPage
            onSuccess={() => navigate('admin')}
            onBack={() => navigate('home')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigate} />

      {/* Mobile fixed bottom navigation */}
      <MobileBottomNav
        currentTab={currentTab}
        onNavigate={navigate}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectProduct={handleSelectProduct}
        onViewAllResults={handleViewAllSearchResults}
      />

      {/* Floating Toast Notification */}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <FavoritesProvider>
          <AuthProvider>
            <MainApp />
          </AuthProvider>
        </FavoritesProvider>
      </CartProvider>
    </LanguageProvider>
  );
}

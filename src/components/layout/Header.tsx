import React, { useState, useEffect } from 'react';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Cake,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useCart } from '../../context/CartContext.tsx';
import { useFavorites } from '../../context/FavoritesContext.tsx';
import { useAuth } from '../../context/AuthContext.tsx';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string, param?: string) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onOpenSearch,
}) => {
  const { t, language, setLanguage } = useLanguage();
  const { totalCount } = useCart();
  const { count: favCount } = useFavorites();
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'products', label: t.nav.products },
    { id: 'about', label: t.nav.about },
    { id: 'delivery', label: t.nav.delivery },
    { id: 'contact', label: t.nav.contact },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#F8BBD0]/50 py-3'
            : 'bg-white border-b border-[#FCE4EC] py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Mobile hamburger (mobile only) */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 text-[#4A2630] hover:text-[#D81B60] transition-colors focus:outline-none"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Logo */}
            <div
              onClick={() => onNavigate('home')}
              className="cursor-pointer flex items-center gap-2 group select-none"
            >
              <div className="w-10 h-10 rounded-full bg-[#FFF7FA] border border-[#F8BBD0] flex items-center justify-center text-[#D81B60] group-hover:scale-105 transition-transform shadow-xs">
                <Cake className="w-5 h-5 text-[#D81B60]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-script text-2xl md:text-3xl font-bold text-[#D81B60] tracking-wide leading-none">
                    Zahro
                  </span>
                  {/* Delicate doodle heart */}
                  <span className="text-[#D81B60] text-sm leading-none animate-pulse">
                    ♡
                  </span>
                </div>
                <span className="text-[9px] md:text-[10px] tracking-[0.18em] uppercase font-bold text-[#4A2630] font-sans -mt-0.5">
                  {language === 'ru' ? 'МИР СЛАДОСТЕЙ' : 'SHIRINLIK dunyosi'}
                </span>
              </div>
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-7 lg:space-x-9">
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`relative text-sm font-medium transition-colors py-1 ${
                      isActive
                        ? 'text-[#D81B60] font-semibold'
                        : 'text-[#4A2630] hover:text-[#D81B60]'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D81B60] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search button */}
              <button
                onClick={onOpenSearch}
                className="p-2 text-[#4A2630] hover:text-[#D81B60] transition-colors rounded-full hover:bg-[#FFF7FA]"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* User / Admin button */}
              <button
                onClick={() => onNavigate(isAuthenticated ? 'admin' : 'admin-login')}
                className="hidden sm:flex p-2 text-[#4A2630] hover:text-[#D81B60] transition-colors rounded-full hover:bg-[#FFF7FA] relative"
                aria-label="Admin Profile"
                title={isAuthenticated ? 'Admin Dashboard' : 'Admin Kirish'}
              >
                <User className="w-5 h-5" />
                {isAuthenticated && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                )}
              </button>

              {/* Favorites button */}
              <button
                onClick={() => onNavigate('favorites')}
                className="hidden sm:flex p-2 text-[#4A2630] hover:text-[#D81B60] transition-colors rounded-full hover:bg-[#FFF7FA] relative"
                aria-label="Favorites"
              >
                <Heart className={`w-5 h-5 ${favCount > 0 ? 'text-[#D81B60] fill-[#D81B60]' : ''}`} />
                {favCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#D81B60] text-white text-[10px] font-bold flex items-center justify-center">
                    {favCount}
                  </span>
                )}
              </button>

              {/* Shopping Cart button with badge */}
              <button
                onClick={() => onNavigate('cart')}
                className="p-2 text-[#4A2630] hover:text-[#D81B60] transition-colors rounded-full hover:bg-[#FFF7FA] relative"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-[#D81B60] text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                    {totalCount}
                  </span>
                )}
              </button>

              {/* Language Switcher UZ | RU */}
              <div className="flex items-center text-xs font-semibold pl-1 sm:pl-2 border-l border-[#F8BBD0]">
                <button
                  onClick={() => setLanguage('uz')}
                  className={`px-1.5 py-0.5 transition-colors ${
                    language === 'uz'
                      ? 'text-[#D81B60] font-bold underline decoration-2 underline-offset-2'
                      : 'text-[#8A6870] hover:text-[#4A2630]'
                  }`}
                >
                  UZ
                </button>
                <span className="text-[#F8BBD0]">|</span>
                <button
                  onClick={() => setLanguage('ru')}
                  className={`px-1.5 py-0.5 transition-colors ${
                    language === 'ru'
                      ? 'text-[#D81B60] font-bold underline decoration-2 underline-offset-2'
                      : 'text-[#8A6870] hover:text-[#4A2630]'
                  }`}
                >
                  RU
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col p-6 z-10 border-r border-[#F8BBD0]">
            <div className="flex items-center justify-between pb-6 border-b border-[#FCE4EC]">
              <div
                onClick={() => {
                  onNavigate('home');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-[#FFF7FA] border border-[#F8BBD0] flex items-center justify-center text-[#D81B60]">
                  <Cake className="w-4 h-4 text-[#D81B60]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-script text-2xl font-bold text-[#D81B60] leading-none">
                    Zahro
                  </span>
                  <span className="text-[8px] tracking-widest uppercase font-bold text-[#4A2630]">
                    {language === 'ru' ? 'МИР СЛАДОСТЕЙ' : 'SHIRINLIK dunyosi'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full text-[#8A6870] hover:text-[#D81B60] hover:bg-[#FFF7FA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 space-y-2 flex-1 overflow-y-auto">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-base font-medium transition-colors ${
                    currentTab === item.id
                      ? 'bg-[#FFF7FA] text-[#D81B60] font-semibold'
                      : 'text-[#4A2630] hover:bg-[#FFF7FA]'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="pt-4 border-t border-[#FCE4EC] space-y-2">
                <button
                  onClick={() => {
                    onNavigate('favorites');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-[#4A2630] hover:bg-[#FFF7FA] flex items-center justify-between"
                >
                  <span>{t.favorites.title}</span>
                  {favCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FCE4EC] text-[#D81B60] text-xs font-bold">
                      {favCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    onNavigate(isAuthenticated ? 'admin' : 'admin-login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-[#4A2630] hover:bg-[#FFF7FA] flex items-center justify-between"
                >
                  <span>{isAuthenticated ? 'Admin Dashboard' : t.nav.admin}</span>
                  {isAuthenticated && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#FCE4EC] flex items-center justify-between">
              <span className="text-xs text-[#8A6870]">Til / Язык:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguage('uz')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                    language === 'uz'
                      ? 'bg-[#D81B60] text-white'
                      : 'bg-[#FFF7FA] text-[#4A2630]'
                  }`}
                >
                  O‘zbek
                </button>
                <button
                  onClick={() => setLanguage('ru')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                    language === 'ru'
                      ? 'bg-[#D81B60] text-white'
                      : 'bg-[#FFF7FA] text-[#4A2630]'
                  }`}
                >
                  Русский
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

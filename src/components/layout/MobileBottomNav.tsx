import React from 'react';
import { Home, Grid, Search, Heart, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useCart } from '../../context/CartContext.tsx';
import { useFavorites } from '../../context/FavoritesContext.tsx';

interface MobileBottomNavProps {
  currentTab: string;
  onNavigate: (tab: string, param?: string) => void;
  onOpenSearch: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onNavigate,
  onOpenSearch,
}) => {
  const { t } = useLanguage();
  const { totalCount } = useCart();
  const { count: favCount } = useFavorites();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#F8BBD0] md:hidden px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-colors ${
            currentTab === 'home' ? 'text-[#D81B60]' : 'text-[#8A6870] hover:text-[#4A2630]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">{t.bottomNav.home}</span>
        </button>

        {/* Catalog / Categories */}
        <button
          onClick={() => onNavigate('products')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-colors ${
            currentTab === 'products' ? 'text-[#D81B60]' : 'text-[#8A6870] hover:text-[#4A2630]'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">{t.bottomNav.catalog}</span>
        </button>

        {/* Search */}
        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 text-[#8A6870] hover:text-[#4A2630] transition-colors"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">{t.bottomNav.search}</span>
        </button>

        {/* Favorites */}
        <button
          onClick={() => onNavigate('favorites')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 relative transition-colors ${
            currentTab === 'favorites' ? 'text-[#D81B60]' : 'text-[#8A6870] hover:text-[#4A2630]'
          }`}
        >
          <Heart className={`w-5 h-5 ${favCount > 0 && currentTab === 'favorites' ? 'fill-[#D81B60]' : ''}`} />
          {favCount > 0 && (
            <span className="absolute top-1 right-2 min-w-4 h-4 px-1 rounded-full bg-[#D81B60] text-white text-[9px] font-bold flex items-center justify-center">
              {favCount}
            </span>
          )}
          <span className="text-[10px] font-medium mt-0.5">{t.bottomNav.favorites}</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => onNavigate('cart')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 relative transition-colors ${
            currentTab === 'cart' || currentTab === 'checkout'
              ? 'text-[#D81B60]'
              : 'text-[#8A6870] hover:text-[#4A2630]'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          {totalCount > 0 && (
            <span className="absolute top-1 right-2 min-w-4 h-4 px-1 rounded-full bg-[#D81B60] text-white text-[9px] font-bold flex items-center justify-center">
              {totalCount}
            </span>
          )}
          <span className="text-[10px] font-medium mt-0.5">{t.bottomNav.cart}</span>
        </button>
      </div>
    </nav>
  );
};

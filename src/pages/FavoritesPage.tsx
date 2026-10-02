import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useFavorites } from '../context/FavoritesContext.tsx';
import { ProductCard } from '../components/products/ProductCard.tsx';
import type { Product } from '../types/index.ts';

interface FavoritesPageProps {
  products: Product[];
  onSelectProduct: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  products,
  onSelectProduct,
  onNavigate,
}) => {
  const { t, language } = useLanguage();
  const { favorites } = useFavorites();

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  if (favoriteProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F8BBD0]/70 max-w-md mx-auto shadow-xs">
          <div className="w-20 h-20 rounded-full bg-[#FFF7FA] border border-[#FCE4EC] flex items-center justify-center text-[#D81B60] mx-auto mb-5">
            <Heart className="w-10 h-10" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#4A2630] mb-2">
            {t.favorites.emptyTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#8A6870] mb-6 leading-relaxed">
            {t.favorites.emptyDesc}
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="px-8 py-3 rounded-full bg-[#D81B60] hover:bg-[#AD1457] text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2 cursor-pointer"
          >
            <span>{t.favorites.explore}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A2630]">
          {t.favorites.title}
        </h1>
        <p className="text-xs text-[#8A6870] mt-1">
          {favoriteProducts.length} {t.categories.itemsSuffix} {language === 'ru' ? 'в избранном' : 'sevimlilar ro‘yxatida'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {favoriteProducts.map((p) => (
          <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
        ))}
      </div>
    </div>
  );
};

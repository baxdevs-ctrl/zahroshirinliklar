import React from 'react';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useCart } from '../../context/CartContext.tsx';
import { useFavorites } from '../../context/FavoritesContext.tsx';
import type { Product } from '../../types/index.ts';

interface ProductCardProps {
  product: Product;
  onSelect: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const isFav = isFavorite(product.id);
  const name = language === 'ru' ? product.nameRu : product.nameUz;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <div
      onClick={() => onSelect(product.id)}
      className="group bg-white rounded-3xl p-3.5 sm:p-4 border border-[#F8BBD0]/70 shadow-xs hover:shadow-xl hover:border-[#D81B60]/40 transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
    >
      {/* Top badges & Favorite Heart */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FFF7FA] mb-3">
        <img
          src={product.image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-106"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Favorite toggle button top right */}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isFav
              ? 'bg-[#D81B60] text-white shadow-md'
              : 'bg-white/85 text-[#8A6870] hover:text-[#D81B60] hover:bg-white shadow-xs'
          }`}
          aria-label="Add to favorites"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Discount badge if oldPrice is present */}
        {product.oldPrice && product.oldPrice > product.price && (
          <div className="absolute top-2.5 left-2.5 bg-[#D81B60] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="space-y-1.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 text-amber-500 text-xs mb-1">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-semibold text-xs text-[#4A2630] tabular-nums">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-[11px] text-[#8A6870]">
              ({product.reviewCount})
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-sm sm:text-base font-bold text-[#4A2630] group-hover:text-[#D81B60] transition-colors line-clamp-1">
            {name}
          </h3>

          {/* Weight or short tag */}
          <p className="text-[11px] text-[#8A6870]">
            {product.weight}
          </p>
        </div>

        {/* Price and Add-To-Cart Action */}
        <div className="pt-2">
          <div className="flex items-baseline gap-2 mb-2.5">
            <span className="text-base sm:text-lg font-bold text-[#D81B60] tabular-nums">
              {product.price.toLocaleString()} {t.featured.currency}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-[#8A6870] line-through tabular-nums">
                {product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-2 sm:py-2.5 px-3 rounded-full bg-[#D81B60] hover:bg-[#AD1457] text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md active:scale-98"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{t.featured.addToCart}</span>
            </button>

            <button
              onClick={handleToggleFavorite}
              className={`w-9 h-9 rounded-full border border-[#F8BBD0] flex items-center justify-center transition-colors shrink-0 ${
                isFav
                  ? 'border-[#D81B60] text-[#D81B60] bg-[#FFF7FA]'
                  : 'text-[#8A6870] hover:text-[#D81B60] hover:border-[#D81B60]'
              }`}
              aria-label="Toggle favorite"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-[#D81B60]' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

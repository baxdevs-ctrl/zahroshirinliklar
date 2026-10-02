import React, { useState } from 'react';
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  ChevronLeft,
  Plus,
  Minus,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useFavorites } from '../context/FavoritesContext.tsx';
import { ProductCard } from '../components/products/ProductCard.tsx';
import type { Product } from '../types/index.ts';

interface ProductDetailPageProps {
  product: Product;
  relatedProducts: Product[];
  onBack: () => void;
  onSelectProduct: (id: string) => void;
  onBuyNow: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  relatedProducts,
  onBack,
  onSelectProduct,
  onBuyNow,
}) => {
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);

  const isFav = isFavorite(product.id);
  const name = language === 'ru' ? product.nameRu : product.nameUz;
  const description = language === 'ru' ? product.descriptionRu : product.descriptionUz;
  const ingredients = language === 'ru' ? product.ingredientsRu : product.ingredientsUz;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleDirectBuy = () => {
    addToCart(product, quantity);
    onBuyNow();
  };

  const gallery = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#8A6870] hover:text-[#D81B60] mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>{language === 'ru' ? 'Назад в каталог' : 'Katalogga qaytish'}</span>
      </button>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-4/3 sm:aspect-square w-full rounded-3xl overflow-hidden bg-white border border-[#F8BBD0]/80 shadow-md">
            <img
              src={selectedImage}
              alt={name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="absolute top-4 left-4 bg-[#D81B60] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
              </span>
            )}
          </div>

          {/* Thumbnails if multiple images */}
          {gallery.length > 1 && (
            <div className="flex gap-3">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === img
                      ? 'border-[#D81B60] shadow-sm scale-102'
                      : 'border-[#F8BBD0]/60 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category tag & Rating */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#D81B60] uppercase tracking-wider">
                {product.categorySlug}
              </span>
              <div className="flex items-center gap-1.5 text-amber-500 text-xs">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-[#4A2630] tabular-nums">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-[#8A6870]">
                  ({product.reviewCount} {t.featured.reviews})
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A2630] leading-snug">
              {name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-[#D81B60] tabular-nums">
                {product.price.toLocaleString()} {t.featured.currency}
              </span>
              {product.oldPrice && (
                <span className="text-base text-[#8A6870] line-through tabular-nums">
                  {product.oldPrice.toLocaleString()} {t.featured.currency}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-sm text-[#8A6870] leading-relaxed">
              {description}
            </p>

            {/* Weight & Ingredients Specs */}
            <div className="bg-[#FFF7FA] p-4 rounded-2xl border border-[#F8BBD0] space-y-2 text-xs">
              <div className="flex justify-between pb-1.5 border-b border-[#FCE4EC]">
                <span className="text-[#8A6870] font-medium">
                  {language === 'ru' ? 'Вес порции:' : 'Vazni:'}
                </span>
                <span className="font-bold text-[#4A2630]">{product.weight}</span>
              </div>
              <div className="pt-1">
                <span className="text-[#8A6870] font-medium block mb-1">
                  {language === 'ru' ? 'Состав и ингредиенты:' : 'Tarkibi:'}
                </span>
                <span className="text-[#4A2630] leading-normal">{ingredients}</span>
              </div>
            </div>

            {/* Delivery Reassurance Badge */}
            <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-[#F8BBD0]/70 text-xs text-[#4A2630]">
              <Truck className="w-5 h-5 text-[#D81B60] shrink-0" />
              <div>
                <span className="font-semibold block">
                  {language === 'ru'
                    ? 'Доставка по Ташкенту сегодня'
                    : 'Bugun Toshkent bo‘ylab yetkazib berish'}
                </span>
                <span className="text-[#8A6870] text-[11px]">
                  {language === 'ru'
                    ? 'При заказе до 16:00 доставим в течение 2-3 часов'
                    : 'Soat 16:00 gacha buyurtma bersangiz, 2-3 soatda yetkaziladi'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions: Quantity Stepper & Buttons */}
          <div className="space-y-3 pt-4 border-t border-[#FCE4EC]">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-[#8A6870]">
                {language === 'ru' ? 'Количество:' : 'Miqdori:'}
              </span>
              <div className="flex items-center border border-[#F8BBD0] rounded-full bg-white px-2 py-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[#8A6870] hover:text-[#D81B60] hover:bg-[#FFF7FA]"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-[#4A2630] tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[#8A6870] hover:text-[#D81B60] hover:bg-[#FFF7FA]"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Wishlist button */}
              <button
                onClick={() => toggleFavorite(product.id)}
                className={`ml-auto w-10 h-10 rounded-full border border-[#F8BBD0] flex items-center justify-center transition-colors ${
                  isFav
                    ? 'border-[#D81B60] bg-[#FFF7FA] text-[#D81B60]'
                    : 'text-[#8A6870] hover:text-[#D81B60]'
                }`}
                aria-label="Toggle wishlist"
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="py-3 px-4 rounded-full bg-[#FFF7FA] hover:bg-[#FCE4EC] border border-[#D81B60] text-[#D81B60] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.featured.addToCart}</span>
              </button>

              <button
                onClick={handleDirectBuy}
                className="py-3 px-4 rounded-full bg-[#D81B60] hover:bg-[#AD1457] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{language === 'ru' ? 'Купить сразу' : 'Hozir xarid qilish'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-[#FCE4EC]">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#D81B60]" />
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#4A2630]">
              {language === 'ru' ? 'Вам также может понравиться' : 'Sizga ham yoqishi mumkin'}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} onSelect={onSelectProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

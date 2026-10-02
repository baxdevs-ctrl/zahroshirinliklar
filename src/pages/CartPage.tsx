import React from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useCart } from '../context/CartContext.tsx';

interface CartPageProps {
  onNavigate: (tab: string) => void;
  onSelectProduct: (id: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate, onSelectProduct }) => {
  const { t, language } = useLanguage();
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    freeDeliveryThreshold,
    amountNeededForFreeDelivery,
    totalAmount,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F8BBD0]/70 max-w-md mx-auto shadow-xs">
          <div className="w-20 h-20 rounded-full bg-[#FFF7FA] border border-[#FCE4EC] flex items-center justify-center text-[#D81B60] mx-auto mb-5">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#4A2630] mb-2">
            {t.cart.emptyTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#8A6870] mb-6 leading-relaxed">
            {t.cart.emptyDesc}
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="px-8 py-3 rounded-full bg-[#D81B60] hover:bg-[#AD1457] text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2 cursor-pointer"
          >
            <span>{t.cart.continueShopping}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const freeDeliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#FCE4EC]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A2630]">
            {t.cart.title}
          </h1>
          <p className="text-xs text-[#8A6870] mt-1">
            {items.length} {t.categories.itemsSuffix} {language === 'ru' ? 'в вашей корзине' : 'savatchangizda mavjud'}
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-[#8A6870] hover:text-[#D81B60] transition-colors"
        >
          {t.cart.clearCart}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Delivery Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#F8BBD0] shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-[#D81B60] mb-2">
              <Truck className="w-4 h-4" />
              <span>
                {amountNeededForFreeDelivery > 0
                  ? `${t.cart.freeDeliveryAlert} ${amountNeededForFreeDelivery.toLocaleString()} ${t.featured.currency}`
                  : t.cart.freeDeliveryEarned}
              </span>
            </div>
            <div className="w-full bg-[#FFF7FA] h-2 rounded-full overflow-hidden border border-[#F8BBD0]/40">
              <div
                className="bg-[#D81B60] h-full rounded-full transition-all duration-500"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3">
            {items.map(({ product, quantity }) => {
              const name = language === 'ru' ? product.nameRu : product.nameUz;
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl p-4 border border-[#F8BBD0]/70 shadow-xs flex flex-col sm:flex-row items-center gap-4 group"
                >
                  {/* Image */}
                  <div
                    onClick={() => onSelectProduct(product.id)}
                    className="w-20 h-20 rounded-2xl overflow-hidden bg-[#FFF7FA] shrink-0 cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <h3
                      onClick={() => onSelectProduct(product.id)}
                      className="text-sm sm:text-base font-bold text-[#4A2630] hover:text-[#D81B60] transition-colors cursor-pointer truncate"
                    >
                      {name}
                    </h3>
                    <p className="text-xs text-[#8A6870] mt-0.5">
                      {product.weight}
                    </p>
                    <div className="text-xs font-bold text-[#D81B60] mt-1 tabular-nums">
                      {product.price.toLocaleString()} {t.featured.currency} / dona
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-[#F8BBD0] rounded-full bg-[#FFF7FA] px-2 py-1 shrink-0">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[#8A6870] hover:text-[#D81B60] hover:bg-white"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-[#4A2630] tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[#8A6870] hover:text-[#D81B60] hover:bg-white"
                      aria-label="Increase"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Subtotal for this item */}
                  <div className="text-right min-w-[100px] shrink-0 hidden sm:block">
                    <span className="text-sm font-bold text-[#4A2630] tabular-nums">
                      {(product.price * quantity).toLocaleString()} {t.featured.currency}
                    </span>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-2 rounded-full text-[#8A6870] hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#F8BBD0]/80 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#4A2630] pb-3 border-b border-[#FCE4EC]">
            {t.checkout.orderSummary}
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-[#8A6870]">
              <span>{t.cart.subtotal}</span>
              <span className="font-bold text-[#4A2630] tabular-nums">
                {subtotal.toLocaleString()} {t.featured.currency}
              </span>
            </div>

            <div className="flex justify-between text-[#8A6870]">
              <span>{t.cart.deliveryFee}</span>
              <span className="font-bold tabular-nums">
                {deliveryFee === 0 ? (
                  <span className="text-emerald-600">
                    {language === 'ru' ? 'Бесплатно' : 'Bepul'}
                  </span>
                ) : (
                  `${deliveryFee.toLocaleString()} ${t.featured.currency}`
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-[#FCE4EC] flex justify-between text-sm sm:text-base font-bold text-[#4A2630]">
              <span>{t.cart.totalAmount}</span>
              <span className="text-[#D81B60] tabular-nums">
                {totalAmount.toLocaleString()} {t.featured.currency}
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('checkout')}
            className="w-full py-3.5 rounded-full bg-[#D81B60] hover:bg-[#AD1457] text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <span>{t.cart.checkoutBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-center text-[#8A6870] pt-1">
            🔒 {language === 'ru' ? 'Безопасная оплата и быстрая доставка' : 'Xavfsiz buyurtma va kafolatlangan yetkazib berish'}
          </p>
        </div>
      </div>
    </div>
  );
};

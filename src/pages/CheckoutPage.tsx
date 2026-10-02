import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Banknote,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { api } from '../services/api.ts';
import type { Order } from '../types/index.ts';

interface CheckoutPageProps {
  onOrderSuccess: (orderId: string) => void;
  onNavigate: (tab: string, param?: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onOrderSuccess,
  onNavigate,
}) => {
  const { t, language } = useLanguage();
  const { items, subtotal, deliveryFee, totalAmount, clearCart } = useCart();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [address, setAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [deliveryTime, setDeliveryTime] = useState('14:00 - 16:00');
  const [comment, setComment] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'click' | 'payme'>('cash');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // If cart is empty and no order created, redirect to cart
  useEffect(() => {
    if (items.length === 0 && !createdOrder) {
      onNavigate('cart');
    }
  }, [items, createdOrder, onNavigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      setError(t.checkout.validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderItems = items.map((i) => ({
        productId: i.product.id,
        productName: language === 'ru' ? i.product.nameRu : i.product.nameUz,
        quantity: i.quantity,
        price: i.product.price,
        image: i.product.image,
      }));

      const newOrder = await api.createOrder({
        customerName: fullName,
        phone,
        address,
        deliveryDate,
        deliveryTime,
        comment,
        paymentMethod,
        items: orderItems,
        subtotal,
        deliveryPrice: deliveryFee,
        total: totalAmount,
      });

      setCreatedOrder(newOrder);
      clearCart();

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D81B60', '#F8BBD0', '#FFD54F', '#4CAF50'],
        });
      } catch (err) {
        console.error('Confetti error', err);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS SCREEN
  if (createdOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F8BBD0] shadow-lg">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A2630] mb-2">
            {t.checkout.successTitle}
          </h2>

          <div className="inline-block bg-[#FFF7FA] border border-[#F8BBD0] rounded-2xl px-6 py-3 my-4">
            <span className="text-xs text-[#8A6870] block">
              {t.checkout.orderNumberLabel}
            </span>
            <span className="text-xl font-bold text-[#D81B60] tracking-wider font-mono">
              #{createdOrder.orderNumber}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#8A6870] max-w-md mx-auto mb-8 leading-relaxed">
            {t.checkout.successDesc}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('track-order', createdOrder.orderNumber)}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#D81B60] hover:bg-[#AD1457] text-white text-xs sm:text-sm font-semibold transition-all shadow-md cursor-pointer"
            >
              {t.checkout.trackOrderBtn}
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#FFF7FA] hover:bg-[#FCE4EC] text-[#4A2630] text-xs sm:text-sm font-semibold border border-[#F8BBD0] transition-colors cursor-pointer"
            >
              {t.checkout.backHome}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A2630]">
          {t.checkout.title}
        </h1>
        <p className="text-xs text-[#8A6870] mt-1">
          {language === 'ru'
            ? 'Пожалуйста, заполните данные для оперативной доставки'
            : 'Iltimos, yetkazib berish ma’lumotlarini to‘ldiring'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form fields */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#F8BBD0]/80 shadow-xs space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-[#FCE4EC]">
              <MapPin className="w-5 h-5 text-[#D81B60]" />
              <h2 className="text-base font-bold text-[#4A2630]">
                {t.checkout.deliveryInfo}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A2630] mb-1.5">
                  {t.checkout.fullName} *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t.checkout.fullNamePlh}
                  className="w-full bg-[#FFF7FA] border border-[#F8BBD0] rounded-2xl px-4 py-3 text-sm text-[#4A2630] outline-none focus:border-[#D81B60] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A2630] mb-1.5">
                  {t.checkout.phone} *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.checkout.phonePlh}
                  className="w-full bg-[#FFF7FA] border border-[#F8BBD0] rounded-2xl px-4 py-3 text-sm text-[#4A2630] outline-none focus:border-[#D81B60] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A2630] mb-1.5">
                {t.checkout.address} *
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t.checkout.addressPlh}
                className="w-full bg-[#FFF7FA] border border-[#F8BBD0] rounded-2xl px-4 py-3 text-sm text-[#4A2630] outline-none focus:border-[#D81B60] transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A2630] mb-1.5">
                  {t.checkout.deliveryDate}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full bg-[#FFF7FA] border border-[#F8BBD0] rounded-2xl px-4 py-3 text-sm text-[#4A2630] outline-none focus:border-[#D81B60] transition-colors cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A2630] mb-1.5">
                  {t.checkout.deliveryTime}
                </label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full bg-[#FFF7FA] border border-[#F8BBD0] rounded-2xl px-4 py-3 text-sm text-[#4A2630] outline-none focus:border-[#D81B60] transition-colors cursor-pointer"
                >
                  {t.checkout.timeSlots.map((slot, idx) => (
                    <option key={idx} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A2630] mb-1.5">
                {t.checkout.comment}
              </label>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t.checkout.commentPlh}
                className="w-full bg-[#FFF7FA] border border-[#F8BBD0] rounded-2xl px-4 py-3 text-sm text-[#4A2630] outline-none focus:border-[#D81B60] transition-colors"
              />
            </div>

            {/* Payment Method Selection */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-[#4A2630] mb-2.5">
                {t.checkout.paymentMethod}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-[#D81B60] bg-[#FFF7FA] shadow-xs'
                      : 'border-[#F8BBD0]/70 hover:border-[#F8BBD0]'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-[#D81B60] shrink-0" />
                  <span className="text-xs font-semibold text-[#4A2630]">
                    {t.checkout.cash}
                  </span>
                </div>

                <div
                  onClick={() => setPaymentMethod('click')}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                    paymentMethod === 'click'
                      ? 'border-[#D81B60] bg-[#FFF7FA] shadow-xs'
                      : 'border-[#F8BBD0]/70 hover:border-[#F8BBD0]'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#D81B60] shrink-0" />
                  <span className="text-xs font-semibold text-[#4A2630]">
                    {t.checkout.click}
                  </span>
                </div>

                <div
                  onClick={() => setPaymentMethod('payme')}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                    paymentMethod === 'payme'
                      ? 'border-[#D81B60] bg-[#FFF7FA] shadow-xs'
                      : 'border-[#F8BBD0]/70 hover:border-[#F8BBD0]'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#D81B60] shrink-0" />
                  <span className="text-xs font-semibold text-[#4A2630]">
                    {t.checkout.payme}
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                {error}
              </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#F8BBD0]/80 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#4A2630] pb-3 border-b border-[#FCE4EC]">
              {t.checkout.orderSummary}
            </h3>

            {/* List preview */}
            <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={product.image}
                    alt={product.nameUz}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#4A2630] truncate">
                      {language === 'ru' ? product.nameRu : product.nameUz}
                    </p>
                    <p className="text-[11px] text-[#8A6870]">
                      {quantity} x {product.price.toLocaleString()} {t.featured.currency}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-3 border-t border-[#FCE4EC] text-xs">
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
              <div className="pt-2 border-t border-[#FCE4EC] flex justify-between text-base font-bold text-[#4A2630]">
                <span>{t.cart.totalAmount}</span>
                <span className="text-[#D81B60] tabular-nums">
                  {totalAmount.toLocaleString()} {t.featured.currency}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#D81B60] hover:bg-[#AD1457] text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer mt-4"
            >
              {loading ? t.checkout.processing : t.checkout.confirmBtn}
            </button>

            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#8A6870]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ru' ? 'Гарантия безопасности заказа' : 'Buyurtma xavfsizligi kafolatlanadi'}</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

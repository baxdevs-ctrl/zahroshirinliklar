import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, Clock, Truck, Package, XCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { api } from '../services/api.ts';
import type { Order, OrderStatus } from '../types/index.ts';

interface OrderTrackingPageProps {
  initialOrderNumber?: string;
  onNavigate: (tab: string) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialOrderNumber,
  onNavigate,
}) => {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState(initialOrderNumber || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (orderNum: string) => {
    if (!orderNum.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getOrderById(orderNum.trim());
      setOrder(data);
    } catch (err: any) {
      setError(
        language === 'ru'
          ? 'Заказ с таким номером не найден. Проверьте правильность ввода.'
          : 'Ushbu raqamli buyurtma topilmadi. Raqamni tekshirib qaytadan kiriting.'
      );
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      fetchOrder(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(query);
  };

  const statusSteps: { key: OrderStatus; labelUz: string; labelRu: string; icon: any }[] = [
    { key: 'Yangi', labelUz: 'Qabul qilindi', labelRu: 'Принят', icon: CheckCircle2 },
    { key: 'Tasdiqlangan', labelUz: 'Tasdiqlandi', labelRu: 'Подтвержден', icon: Package },
    { key: 'Tayyorlanmoqda', labelUz: 'Tayyorlanmoqda', labelRu: 'Готовится', icon: Clock },
    { key: 'Yetkazilmoqda', labelUz: 'Yo‘lda', labelRu: 'В пути', icon: Truck },
    { key: 'Yetkazildi', labelUz: 'Yetkazildi', labelRu: 'Доставлен', icon: CheckCircle2 },
  ];

  const getStatusIndex = (st?: OrderStatus) => {
    if (!st || st === 'Bekor qilindi') return -1;
    return statusSteps.findIndex((s) => s.key === st);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="text-center mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A2630]">
          {language === 'ru' ? 'Отслеживание заказа' : 'Buyurtmani kuzatish'}
        </h1>
        <p className="text-xs sm:text-sm text-[#8A6870] mt-1">
          {language === 'ru'
            ? 'Введите номер заказа (например: ZH-000101) для проверки статуса'
            : 'Buyurtma holatini bilish uchun buyurtma raqamini kiriting (masalan: ZH-000101)'}
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto mb-10">
        <div className="flex items-center gap-2 bg-white rounded-full p-1.5 border border-[#F8BBD0] shadow-sm">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ZH-000101"
            className="flex-1 bg-transparent px-4 py-2 text-sm text-[#4A2630] font-mono outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-full bg-[#D81B60] hover:bg-[#AD1457] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            {loading ? '...' : language === 'ru' ? 'Найти' : 'Qidirish'}
          </button>
        </div>
        {error && (
          <p className="text-xs text-rose-600 text-center mt-2.5">{error}</p>
        )}
      </form>

      {/* Order Status Display */}
      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F8BBD0]/80 shadow-sm space-y-8 animate-fade-in">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#FCE4EC] gap-3">
            <div>
              <span className="text-xs text-[#8A6870] block">Buyurtma:</span>
              <span className="text-xl font-bold text-[#D81B60] font-mono">
                #{order.orderNumber}
              </span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-[#8A6870] block">Buyurtma sanasi:</span>
              <span className="text-xs font-semibold text-[#4A2630]">
                {new Date(order.createdAt).toLocaleString(language === 'ru' ? 'ru-RU' : 'uz-UZ')}
              </span>
            </div>
          </div>

          {/* Timeline */}
          {order.status === 'Bekor qilindi' ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-sm">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{language === 'ru' ? 'Этот заказ был отменен.' : 'Ushbu buyurtma bekor qilingan.'}</span>
            </div>
          ) : (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A6870] mb-6">
                {language === 'ru' ? 'Статус выполнения:' : 'Bajarilish holati:'}
              </h3>
              <div className="grid grid-cols-5 gap-2 text-center relative">
                {statusSteps.map((step, idx) => {
                  const currentIdx = getStatusIndex(order.status);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;
                  const Icon = step.icon;

                  return (
                    <div key={step.key} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                          isCompleted
                            ? 'bg-[#D81B60] text-white shadow-xs'
                            : 'bg-[#FFF7FA] text-[#8A6870] border border-[#F8BBD0]'
                        } ${isCurrent ? 'ring-4 ring-[#F8BBD0]' : ''}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs font-semibold ${
                          isCompleted ? 'text-[#4A2630]' : 'text-[#8A6870]'
                        }`}
                      >
                        {language === 'ru' ? step.labelRu : step.labelUz}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Delivery & Items details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#FCE4EC] text-xs">
            <div>
              <h4 className="font-bold text-[#4A2630] mb-2">
                {language === 'ru' ? 'Информация о доставке' : 'Yetkazib berish ma’lumotlari'}
              </h4>
              <p className="text-[#8A6870] leading-relaxed">
                <span className="font-medium text-[#4A2630]">{order.customerName}</span><br />
                {order.phone}<br />
                {order.address}<br />
                {order.deliveryDate} ({order.deliveryTime})
              </p>
            </div>

            <div>
              <h4 className="font-bold text-[#4A2630] mb-2">
                {language === 'ru' ? 'Состав заказа' : 'Buyurtma tarkibi'}
              </h4>
              <div className="space-y-1.5">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[#8A6870]">
                    <span>{item.quantity}x {item.productName}</span>
                    <span className="font-semibold text-[#4A2630]">
                      {(item.price * item.quantity).toLocaleString()} {t.featured.currency}
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-[#FCE4EC] flex justify-between font-bold text-sm text-[#4A2630]">
                  <span>Jami to‘lov:</span>
                  <span className="text-[#D81B60]">
                    {order.total.toLocaleString()} {t.featured.currency}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { ShoppingCart, Flame, Truck, Sparkles, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';

export const DeliverySection: React.FC = () => {
  const { t, language } = useLanguage();

  const steps = [
    {
      num: '01',
      icon: ShoppingCart,
      title: t.delivery.step1Title,
      desc: t.delivery.step1Desc,
    },
    {
      num: '02',
      icon: Flame,
      title: t.delivery.step2Title,
      desc: t.delivery.step2Desc,
    },
    {
      num: '03',
      icon: Truck,
      title: t.delivery.step3Title,
      desc: t.delivery.step3Desc,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="text-center mb-10 md:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FCE4EC] text-[#D81B60] text-xs font-semibold mb-3">
          <Truck className="w-3.5 h-3.5" />
          <span>{t.delivery.title}</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#4A2630]">
          {language === 'ru' ? 'Как мы работаем' : 'Qanday ishlaymiz?'}
        </h2>
        <p className="text-xs sm:text-sm text-[#8A6870] mt-2 max-w-lg mx-auto">
          {t.delivery.subtitle}
        </p>
      </div>

      {/* 3 Step cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-[#F8BBD0]/70 shadow-xs hover:shadow-md hover:border-[#D81B60]/40 transition-all text-center relative group"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#FFF7FA] border border-[#FCE4EC] flex items-center justify-center text-[#D81B60] mx-auto mb-4 group-hover:scale-110 group-hover:bg-[#D81B60] group-hover:text-white transition-all duration-300">
                <Icon className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-[#D81B60] tracking-widest block mb-1">
                QADAM {step.num}
              </span>
              <h3 className="text-base font-bold text-[#4A2630] mb-2">
                {step.title}
              </h3>
              <p className="text-xs text-[#8A6870] leading-relaxed">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Delivery Zone Banner */}
      <div className="bg-[#FFF7FA] rounded-2xl p-5 border border-[#F8BBD0] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FCE4EC] text-[#D81B60] flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-[#4A2630]">
            {t.delivery.tashkentZones}
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2 text-xs font-bold text-[#D81B60] bg-white px-3 py-1.5 rounded-full border border-[#F8BBD0]">
          <Sparkles className="w-4 h-4" />
          <span>{language === 'ru' ? 'Свежесть гарантирована' : '100% Yangi holatda'}</span>
        </div>
      </div>
    </section>
  );
};

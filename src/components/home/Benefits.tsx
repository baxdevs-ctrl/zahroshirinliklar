import React from 'react';
import { Truck, ShieldCheck, Heart, Headphones } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';

export const Benefits: React.FC = () => {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: Truck,
      title: t.benefits.deliveryTitle,
      desc: t.benefits.deliveryDesc,
    },
    {
      icon: ShieldCheck,
      title: t.benefits.qualityTitle,
      desc: t.benefits.qualityDesc,
    },
    {
      icon: Heart,
      title: t.benefits.discountsTitle,
      desc: t.benefits.discountsDesc,
    },
    {
      icon: Headphones,
      title: t.benefits.supportTitle,
      desc: t.benefits.supportDesc,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {benefits.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div
              key={idx}
              className="bg-white p-4 sm:p-5 rounded-2xl md:rounded-3xl border border-[#F8BBD0]/60 shadow-xs hover:shadow-md hover:border-[#D81B60]/40 transition-all flex items-center gap-3.5 sm:gap-4 group"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FFF7FA] border border-[#FCE4EC] flex items-center justify-center text-[#D81B60] shrink-0 group-hover:bg-[#D81B60] group-hover:text-white transition-colors duration-300">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-[#4A2630] group-hover:text-[#D81B60] transition-colors truncate">
                  {b.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-[#8A6870] truncate mt-0.5">
                  {b.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

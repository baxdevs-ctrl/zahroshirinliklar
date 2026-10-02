import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import type { Category } from '../../types/index.ts';

interface CategoriesSectionProps {
  categories: Category[];
  onSelectCategory: (categorySlug: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  onSelectCategory,
}) => {
  const { t, language } = useLanguage();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Header with decorative flourish */}
      <div className="text-center mb-8 md:mb-12">
        <div className="inline-flex items-center justify-center gap-3 mb-2">
          <span className="w-8 h-0.5 bg-[#F8BBD0] rounded-full hidden sm:block" />
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#4A2630] tracking-tight">
            {t.categories.sectionTitle}
          </h2>
          <span className="w-8 h-0.5 bg-[#F8BBD0] rounded-full hidden sm:block" />
        </div>
        <p className="text-xs sm:text-sm text-[#8A6870] font-medium">
          {t.categories.sectionSubtitle}
        </p>
      </div>

      {/* 5-Column Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {categories.map((cat) => {
          const name = language === 'ru' ? cat.nameRu : cat.nameUz;
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className="group bg-white rounded-3xl p-3 sm:p-4 border border-[#F8BBD0]/70 shadow-xs hover:shadow-lg hover:border-[#D81B60] transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Image container */}
              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-[#FFF7FA] mb-3.5 relative">
                <img
                  src={cat.image}
                  alt={name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Title & Arrow info */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#4A2630] group-hover:text-[#D81B60] transition-colors leading-tight">
                    {name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#8A6870] mt-0.5">
                    ({cat.productCount} {t.categories.itemsSuffix})
                  </p>
                </div>

                {/* Arrow circle */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FCE4EC] group-hover:bg-[#D81B60] text-[#D81B60] group-hover:text-white flex items-center justify-center transition-all duration-300 shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

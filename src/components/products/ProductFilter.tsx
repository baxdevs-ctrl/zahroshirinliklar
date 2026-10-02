import React from 'react';
import { Filter, ArrowUpDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import type { Category } from '../../types/index.ts';

interface ProductFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (catSlug: string) => void;
  selectedSort: string;
  onSelectSort: (sort: string) => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedSort,
  onSelectSort,
}) => {
  const { t, language } = useLanguage();

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#F8BBD0]/70 shadow-xs mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Tabs (Horizontally scrollable on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#D81B60] text-white shadow-xs'
                : 'bg-[#FFF7FA] text-[#8A6870] hover:text-[#4A2630] hover:bg-[#FCE4EC]'
            }`}
          >
            {t.filter.all}
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug || selectedCategory === cat.id;
            const name = language === 'ru' ? cat.nameRu : cat.nameUz;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#D81B60] text-white shadow-xs'
                    : 'bg-[#FFF7FA] text-[#8A6870] hover:text-[#4A2630] hover:bg-[#FCE4EC]'
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <ArrowUpDown className="w-4 h-4 text-[#8A6870]" />
          <span className="text-xs text-[#8A6870] hidden sm:inline">{t.filter.sort}:</span>
          <select
            value={selectedSort}
            onChange={(e) => onSelectSort(e.target.value)}
            className="bg-[#FFF7FA] border border-[#F8BBD0] text-[#4A2630] text-xs sm:text-sm font-medium rounded-full px-3 py-1.5 outline-none focus:border-[#D81B60] cursor-pointer"
          >
            <option value="popular">{t.filter.sortPopular}</option>
            <option value="cheap">{t.filter.sortCheap}</option>
            <option value="expensive">{t.filter.sortExpensive}</option>
            <option value="new">{t.filter.sortNew}</option>
          </select>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ProductFilter } from '../components/products/ProductFilter.tsx';
import { ProductCard } from '../components/products/ProductCard.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { Sparkles, SearchX } from 'lucide-react';
import type { Category, Product } from '../types/index.ts';

interface ProductsPageProps {
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedSort: string;
  onSelectSort: (sort: string) => void;
  searchQuery?: string;
  onClearSearch?: () => void;
  onSelectProduct: (id: string) => void;
  loading?: boolean;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  selectedSort,
  onSelectSort,
  searchQuery,
  onClearSearch,
  onSelectProduct,
  loading,
}) => {
  const { t, language } = useLanguage();

  const currentCatObj = categories.find(
    (c) => c.slug === selectedCategory || c.id === selectedCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Title & Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FCE4EC] text-[#D81B60] text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.nav.products}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A2630]">
          {searchQuery
            ? `${language === 'ru' ? 'Результаты поиска' : 'Qidiruv natijalari'}: «${searchQuery}»`
            : currentCatObj
            ? language === 'ru'
              ? currentCatObj.nameRu
              : currentCatObj.nameUz
            : t.categories.sectionTitle}
        </h1>
        <p className="text-xs sm:text-sm text-[#8A6870] mt-2">
          {products.length} {t.categories.itemsSuffix} {language === 'ru' ? 'в наличии' : 'shirinlik mavjud'}
        </p>
      </div>

      {searchQuery && onClearSearch && (
        <div className="mb-6 flex items-center justify-between bg-[#FFF7FA] p-3 rounded-2xl border border-[#F8BBD0]">
          <span className="text-xs text-[#8A6870]">
            «{searchQuery}» {language === 'ru' ? 'по запросу' : 'bo‘yicha mahsulotlar'}
          </span>
          <button
            onClick={onClearSearch}
            className="text-xs font-semibold text-[#D81B60] hover:underline cursor-pointer"
          >
            {language === 'ru' ? 'Сбросить поиск' : 'Qidiruvni tozalash'}
          </button>
        </div>
      )}

      {/* Filter bar */}
      <ProductFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        selectedSort={selectedSort}
        onSelectSort={onSelectSort}
      />

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-4 border border-[#F8BBD0]/50 h-80 space-y-4">
              <div className="bg-[#FFF7FA] rounded-2xl w-full h-48" />
              <div className="h-4 bg-[#FFF7FA] rounded w-3/4" />
              <div className="h-4 bg-[#FFF7FA] rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Product Grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-[#F8BBD0]/70 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#FFF7FA] border border-[#FCE4EC] flex items-center justify-center text-[#8A6870] mx-auto mb-4">
            <SearchX className="w-8 h-8 text-[#D81B60]" />
          </div>
          <h3 className="text-lg font-bold text-[#4A2630] mb-2">
            {language === 'ru' ? 'Товары не найдены' : 'Hozircha mahsulotlar topilmadi'}
          </h3>
          <p className="text-xs text-[#8A6870] mb-6">
            {language === 'ru'
              ? 'Попробуйте изменить категорию или очистить поисковый запрос.'
              : 'Kategoriya yoki qidiruv so‘zini o‘zgartirib ko‘ring.'}
          </p>
          <button
            onClick={() => {
              onSelectCategory('all');
              if (onClearSearch) onClearSearch();
            }}
            className="px-6 py-2.5 rounded-full bg-[#D81B60] text-white text-xs font-semibold hover:bg-[#AD1457] transition-colors"
          >
            {language === 'ru' ? 'Смотреть все товары' : 'Barcha mahsulotlarni ko‘rish'}
          </button>
        </div>
      )}
    </div>
  );
};

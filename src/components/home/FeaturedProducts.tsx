import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { ProductCard } from '../products/ProductCard.tsx';
import type { Product } from '../../types/index.ts';

interface FeaturedProductsProps {
  products: Product[];
  onSelectProduct: (id: string) => void;
  onViewAll: () => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  onSelectProduct,
  onViewAll,
}) => {
  const { t } = useLanguage();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8 md:mb-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#FCE4EC] flex items-center justify-center text-[#D81B60]">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A2630]">
            {t.featured.sectionTitle}
          </h2>
        </div>

        <button
          onClick={onViewAll}
          className="text-xs sm:text-sm font-semibold text-[#D81B60] hover:text-[#AD1457] flex items-center gap-1 transition-colors group"
        >
          <span>{t.featured.viewAll}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {products.slice(0, 8).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onSelectProduct}
          />
        ))}
      </div>
    </section>
  );
};

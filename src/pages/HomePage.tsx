import React from 'react';
import { Hero } from '../components/home/Hero.tsx';
import { Benefits } from '../components/home/Benefits.tsx';
import { CategoriesSection } from '../components/home/CategoriesSection.tsx';
import { FeaturedProducts } from '../components/home/FeaturedProducts.tsx';
import { AboutSection } from '../components/home/AboutSection.tsx';
import { DeliverySection } from '../components/home/DeliverySection.tsx';
import { ContactSection } from '../components/home/ContactSection.tsx';
import type { Category, Product } from '../types/index.ts';

interface HomePageProps {
  categories: Category[];
  products: Product[];
  onNavigate: (tab: string, param?: string) => void;
  onSelectCategory: (categorySlug: string) => void;
  onSelectProduct: (productId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  categories,
  products,
  onNavigate,
  onSelectCategory,
  onSelectProduct,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Hero */}
      <Hero onCtaClick={() => onNavigate('products')} />

      {/* 2. Benefits */}
      <Benefits />

      {/* 3. Categories */}
      <CategoriesSection
        categories={categories}
        onSelectCategory={onSelectCategory}
      />

      {/* 4. Featured Products */}
      <FeaturedProducts
        products={products.filter((p) => p.isFeatured)}
        onSelectProduct={onSelectProduct}
        onViewAll={() => onNavigate('products')}
      />

      {/* 5. About */}
      <AboutSection onLearnMore={() => onNavigate('about')} />

      {/* 6. Delivery */}
      <DeliverySection />

      {/* 7. Contact */}
      <ContactSection />
    </div>
  );
};

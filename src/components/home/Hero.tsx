import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface HeroProps {
  onCtaClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  const { t, language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: '/src/assets/images/hero_pink_cake_1790917416304.jpg',
      alt: 'Zahro Malinali va qulupnayli shohona bayram torti',
    },
    {
      image: '/src/assets/images/cat_chocolate_cake_1790917450877.jpg',
      alt: 'Zahro Belgiyalik qora shokoladli tort',
    },
    {
      image: '/src/assets/images/cat_pink_cupcakes_1790917464226.jpg',
      alt: 'Zahro Nafis malinali kapkeyklar to‘plami',
    },
  ];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F8] via-[#FCE4EC]/50 to-[#FFF7FA] rounded-b-[36px] md:rounded-b-[56px] border-b border-[#F8BBD0]/40 shadow-xs">
      {/* Delicate floating background elements */}
      <div className="absolute top-8 left-8 text-[#F8BBD0]/40 text-4xl select-none pointer-events-none animate-float-slow">
        🌸
      </div>
      <div className="absolute bottom-12 left-1/3 text-[#F8BBD0]/30 text-3xl select-none pointer-events-none">
        ♡
      </div>
      <div className="absolute top-1/4 right-10 text-[#F8BBD0]/40 text-3xl select-none pointer-events-none animate-float-slow">
        ✨
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-4 md:space-y-6">
            <div className="space-y-1">
              <div className="inline-flex items-center justify-center lg:justify-start gap-2">
                <span className="font-script text-5xl sm:text-6xl md:text-7xl font-bold text-[#D81B60] tracking-wide">
                  {t.brandName}
                </span>
                <span className="text-[#D81B60] text-3xl md:text-4xl animate-pulse">
                  ♡
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#4A2630] uppercase">
                {t.hero.title}
              </h1>
            </div>

            <p className="text-xl sm:text-2xl font-serif text-[#D81B60] font-semibold italic">
              «{t.hero.tagline}»
            </p>

            <p className="text-sm sm:text-base text-[#8A6870] leading-relaxed max-w-xl mx-auto lg:mx-0">
              {t.hero.description}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onCtaClick}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#D81B60] hover:bg-[#AD1457] text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{t.hero.ctaView}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Cake Image Showcase Column */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            {/* Soft pink glow backdrop */}
            <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-[#F8BBD0]/40 blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-lg aspect-4/3 sm:aspect-4/3 rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white group">
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].alt}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Prev / Next circular buttons matching reference */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
                <button
                  onClick={handlePrev}
                  className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#4A2630] hover:text-[#D81B60] shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#4A2630] hover:text-[#D81B60] shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Slide dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 bg-black/20 backdrop-blur-xs px-3 py-1 rounded-full">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === idx
                        ? 'w-6 bg-white'
                        : 'w-2 bg-white/60 hover:bg-white'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

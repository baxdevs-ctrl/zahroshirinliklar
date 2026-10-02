import React from 'react';
import { ArrowRight, Leaf, Award, HeartHandshake } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface AboutSectionProps {
  onLearnMore: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onLearnMore }) => {
  const { t } = useLanguage();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="bg-gradient-to-r from-[#FFF5F8] via-[#FFF0F5] to-[#FCE4EC]/50 rounded-[32px] md:rounded-[48px] p-6 sm:p-10 lg:p-12 border border-[#F8BBD0]/60 shadow-xs overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Pastry Chef Image */}
          <div className="lg:col-span-5">
            <div className="relative aspect-4/3 sm:aspect-4/3 rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-white group">
              <img
                src="/src/assets/images/about_female_chef_1790917434108.jpg"
                alt="Zahro mahoratli qandolatchisi"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Right: Text and Features */}
          <div className="lg:col-span-7 space-y-5 md:space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="text-xl">🌸</span>
                <span className="text-xs font-bold text-[#D81B60] uppercase tracking-widest font-sans">
                  Zahro SHIRINLIK
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#4A2630]">
                {t.about.title}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#4A2630]/85 leading-relaxed font-normal">
              {t.about.description}
            </p>

            {/* 3 Key Trust Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2">
              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-[#F8BBD0]/60 text-center">
                <Leaf className="w-5 h-5 text-[#D81B60] mx-auto mb-1.5" />
                <span className="text-xs font-semibold text-[#4A2630] block">
                  {t.about.feature1}
                </span>
              </div>
              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-[#F8BBD0]/60 text-center">
                <Award className="w-5 h-5 text-[#D81B60] mx-auto mb-1.5" />
                <span className="text-xs font-semibold text-[#4A2630] block">
                  {t.about.feature2}
                </span>
              </div>
              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-[#F8BBD0]/60 text-center">
                <HeartHandshake className="w-5 h-5 text-[#D81B60] mx-auto mb-1.5" />
                <span className="text-xs font-semibold text-[#4A2630] block">
                  {t.about.feature3}
                </span>
              </div>
            </div>

            {/* Action and Decorative quote */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <button
                onClick={onLearnMore}
                className="px-6 py-2.5 sm:py-3 rounded-full bg-[#D81B60] hover:bg-[#AD1457] text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2 group cursor-pointer"
              >
                <span>{t.about.cta}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex flex-col text-left sm:text-right">
                <span className="font-script text-xl sm:text-2xl text-[#D81B60] font-bold">
                  «{t.about.quote}»
                </span>
                <span className="text-xs text-[#8A6870] font-medium">
                  🧁 Zahro Qandolatchiligi
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

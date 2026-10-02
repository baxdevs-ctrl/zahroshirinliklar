import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { api } from '../../services/api.ts';
import type { Product } from '../../types/index.ts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (productId: string) => void;
  onViewAllResults: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onViewAllResults,
}) => {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.getProducts({ search: query });
        setResults(data);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const popularSuggestions =
    language === 'uz'
      ? ['Shokoladli tort', 'Red Velvet', 'Malinali keks', 'Cheesecake', 'Pechenye']
      : ['Шоколадный торт', 'Красный бархат', 'Малиновый кекс', 'Чизкейк', 'Печенье'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#F8BBD0]">
        {/* Search header */}
        <div className="p-4 md:p-6 border-b border-[#FCE4EC] flex items-center gap-3">
          <Search className="w-6 h-6 text-[#D81B60] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                onViewAllResults(query);
                onClose();
              }
            }}
            placeholder={t.search.placeholder}
            className="w-full bg-transparent text-lg md:text-xl text-[#4A2630] placeholder-[#8A6870] outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#8A6870] hover:text-[#4A2630] p-1"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FFF7FA] flex items-center justify-center text-[#8A6870] hover:text-[#D81B60] hover:bg-[#FCE4EC] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 md:p-6">
          {loading && (
            <div className="py-8 text-center text-[#8A6870] text-sm">
              <div className="w-6 h-6 border-2 border-[#D81B60] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Qidirilmoqda...
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-[#8A6870] uppercase tracking-wider mb-2">
                {results.length} {t.search.found}
              </div>
              {results.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectProduct(item.id);
                    onClose();
                  }}
                  className="flex items-center gap-4 p-2.5 rounded-2xl hover:bg-[#FFF7FA] cursor-pointer transition-colors group"
                >
                  <img
                    src={item.image}
                    alt={language === 'ru' ? item.nameRu : item.nameUz}
                    className="w-14 h-14 rounded-xl object-cover border border-[#F8BBD0] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-[#4A2630] group-hover:text-[#D81B60] transition-colors truncate">
                      {language === 'ru' ? item.nameRu : item.nameUz}
                    </h4>
                    <p className="text-xs text-[#8A6870] truncate">
                      {language === 'ru' ? item.descriptionRu : item.descriptionUz}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-[#D81B60]">
                      {item.price.toLocaleString()} {t.featured.currency}
                    </span>
                  </div>
                </div>
              ))}

              {results.length > 5 && (
                <button
                  onClick={() => {
                    onViewAllResults(query);
                    onClose();
                  }}
                  className="w-full mt-3 py-2.5 px-4 bg-[#FFF7FA] hover:bg-[#FCE4EC] text-[#D81B60] font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <span>{t.categories.viewAll} ({results.length})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="py-8 text-center text-[#8A6870]">
              <p className="text-base font-medium">{t.search.noResults}</p>
            </div>
          )}

          {!query && (
            <div>
              <p className="text-xs font-semibold text-[#8A6870] uppercase tracking-wider mb-3">
                {t.search.popularSearch}
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(item)}
                    className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-[#FFF7FA] text-[#8A6870] hover:bg-[#FCE4EC] hover:text-[#D81B60] border border-[#F8BBD0]/50 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

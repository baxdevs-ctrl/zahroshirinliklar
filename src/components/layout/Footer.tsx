import React, { useState } from 'react';
import {
  Cake,
  Phone,
  Mail,
  MapPin,
  Send,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface FooterProps {
  onNavigate: (tab: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, language, setLanguage } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#6B1536] text-[#FFF7FA] pt-14 pb-20 md:pb-10 border-t border-[#8A2449]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20 group-hover:scale-105 transition-transform">
                <Cake className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-script text-3xl font-bold text-white leading-none">
                  Zahro
                </span>
                <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-[#F8BBD0]">
                  {language === 'ru' ? 'МИР СЛАДОСТЕЙ' : 'SHIRINLIK dunyosi'}
                </span>
              </div>
            </div>
            <p className="text-xs text-[#F8BBD0]/80 leading-relaxed max-w-xs">
              {language === 'ru'
                ? 'Изысканные торты и десерты ручной работы. Доставляем моменты счастья и сладкого вдохновения в каждый дом!'
                : 'Har bir tort va shirinlik mehr bilan tayyorlanadi. Hayotingizdagi quvonchli lahzalar uchun eng mazali shirinliklar!'}
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white mb-4">
              {t.footer.menuTitle}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#F8BBD0]">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-white transition-colors"
                >
                  {t.nav.products}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('delivery')}
                  className="hover:text-white transition-colors"
                >
                  {t.nav.delivery}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  {t.nav.contact}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin-login')}
                  className="hover:text-white/80 transition-colors opacity-75 text-[11px]"
                >
                  Admin
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Social */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white mb-4">
              {t.footer.contactTitle}
            </h4>
            <ul className="space-y-3 text-xs text-[#F8BBD0]">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#F8BBD0] shrink-0" />
                <span>+998 90 123 45 67</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#F8BBD0] shrink-0" />
                <span>zahro@shirinlik.uz</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#F8BBD0] shrink-0" />
                <span>Toshkent, O‘zbekiston</span>
              </li>
            </ul>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#D81B60] flex items-center justify-center text-white transition-colors"
                aria-label="Instagram"
              >
                <span className="text-xs font-bold">IG</span>
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#D81B60] flex items-center justify-center text-white transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#D81B60] flex items-center justify-center text-white transition-colors"
                aria-label="TikTok"
              >
                <span className="text-xs font-bold">TT</span>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#D81B60] flex items-center justify-center text-white transition-colors"
                aria-label="YouTube"
              >
                <span className="text-xs font-bold">YT</span>
              </a>
            </div>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white mb-2">
              {t.footer.newsletterTitle}
            </h4>
            <p className="text-xs text-[#F8BBD0] mb-3 leading-relaxed">
              {t.footer.newsletterDesc}
            </p>

            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.footer.newsletterPlh}
                className="w-full bg-white/10 border border-white/20 rounded-full px-4 py-2.5 text-xs text-white placeholder-[#F8BBD0]/60 outline-none focus:border-white transition-colors pr-10"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 w-7 h-7 rounded-full bg-[#D81B60] hover:bg-[#AD1457] text-white flex items-center justify-center transition-colors"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {subscribed && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-300 mt-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.footer.newsletterSuccess}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom copyright and language */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F8BBD0]/70 gap-3">
          <p>© 2026 Zahro SHIRINLIK dunyosi. {t.footer.rights}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage('uz')}
              className={`hover:text-white transition-colors ${
                language === 'uz' ? 'text-white font-bold' : ''
              }`}
            >
              UZ
            </button>
            <span>|</span>
            <button
              onClick={() => setLanguage('ru')}
              className={`hover:text-white transition-colors ${
                language === 'ru' ? 'text-white font-bold' : ''
              }`}
            >
              RU
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

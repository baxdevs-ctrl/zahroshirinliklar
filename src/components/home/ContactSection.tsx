import React, { useState } from 'react';
import { Phone, Send, MapPin, CheckCircle2, MessageSquare } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { api } from '../../services/api.ts';

export const ContactSection: React.FC = () => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    setStatus('loading');
    try {
      await api.sendContact({ name, phone, email, message });
      setStatus('success');
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="text-center mb-10 md:mb-12">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#4A2630]">
          {t.contact.title}
        </h2>
        <p className="text-xs sm:text-sm text-[#8A6870] mt-2 max-w-md mx-auto">
          {t.contact.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-[#F8BBD0]/70 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF7FA] border border-[#FCE4EC] flex items-center justify-center text-[#D81B60] shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#8A6870] block">{t.contact.phone}</span>
              <a
                href="tel:+998901234567"
                className="text-sm font-bold text-[#4A2630] hover:text-[#D81B60] transition-colors"
              >
                +998 90 123 45 67
              </a>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#F8BBD0]/70 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF7FA] border border-[#FCE4EC] flex items-center justify-center text-[#D81B60] shrink-0">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#8A6870] block">{t.contact.telegram}</span>
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="text-sm font-bold text-[#4A2630] hover:text-[#D81B60] transition-colors"
              >
                @zahro_shirinlik
              </a>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#F8BBD0]/70 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF7FA] border border-[#FCE4EC] flex items-center justify-center text-[#D81B60] shrink-0">
              <span className="text-sm font-bold">IG</span>
            </div>
            <div>
              <span className="text-xs text-[#8A6870] block">{t.contact.instagram}</span>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-sm font-bold text-[#4A2630] hover:text-[#D81B60] transition-colors"
              >
                @zahro_shirinlik
              </a>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#F8BBD0]/70 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF7FA] border border-[#FCE4EC] flex items-center justify-center text-[#D81B60] shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-[#8A6870] block">{t.contact.address}</span>
              <p className="text-xs font-semibold text-[#4A2630] leading-snug">
                {t.contact.addressVal}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Working Message Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#F8BBD0]/70 shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-[#D81B60]" />
            <h3 className="text-lg font-bold text-[#4A2630]">
              {t.contact.subtitle}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A2630] mb-1.5">
                  {t.contact.formName} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.contact.formNamePlh}
                  className="w-full bg-[#FFF7FA] border border-[#F8BBD0]/80 rounded-2xl px-4 py-3 text-sm text-[#4A2630] placeholder-[#8A6870]/60 outline-none focus:border-[#D81B60] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A2630] mb-1.5">
                  {t.contact.formPhone} *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.contact.formPhonePlh}
                  className="w-full bg-[#FFF7FA] border border-[#F8BBD0]/80 rounded-2xl px-4 py-3 text-sm text-[#4A2630] placeholder-[#8A6870]/60 outline-none focus:border-[#D81B60] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A2630] mb-1.5">
                {t.contact.formEmail}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.contact.formEmailPlh}
                className="w-full bg-[#FFF7FA] border border-[#F8BBD0]/80 rounded-2xl px-4 py-3 text-sm text-[#4A2630] placeholder-[#8A6870]/60 outline-none focus:border-[#D81B60] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A2630] mb-1.5">
                {t.contact.formMessage} *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t.contact.formMessagePlh}
                className="w-full bg-[#FFF7FA] border border-[#F8BBD0]/80 rounded-2xl px-4 py-3 text-sm text-[#4A2630] placeholder-[#8A6870]/60 outline-none focus:border-[#D81B60] transition-colors resize-none"
              />
            </div>

            {status === 'success' && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.contact.success}</span>
              </div>
            )}

            {status === 'error' && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs">
                {t.contact.error}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3.5 rounded-full bg-[#D81B60] hover:bg-[#AD1457] text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {status === 'loading' ? t.contact.submitting : t.contact.submit}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

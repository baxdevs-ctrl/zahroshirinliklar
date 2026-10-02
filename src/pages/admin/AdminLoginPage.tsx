import React, { useState } from 'react';
import { Lock, User, Cake, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface AdminLoginPageProps {
  onSuccess: () => void;
  onBack: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess, onBack }) => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('zahro2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(username, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Kirishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-white rounded-3xl p-8 border border-[#F8BBD0] shadow-xl text-center">
        <div className="w-16 h-16 rounded-full bg-[#FFF7FA] border border-[#FCE4EC] flex items-center justify-center text-[#D81B60] mx-auto mb-4">
          <Cake className="w-8 h-8" />
        </div>

        <h1 className="font-serif text-2xl font-bold text-[#4A2630] mb-1">
          {t.admin.loginTitle}
        </h1>
        <p className="text-xs text-[#8A6870] mb-6">
          Zahro SHIRINLIK dunyosi boshqaruv paneli
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-[#4A2630] mb-1.5">
              {t.admin.username}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#FFF7FA] border border-[#F8BBD0] rounded-2xl px-4 py-3 pl-10 text-sm text-[#4A2630] outline-none focus:border-[#D81B60]"
              />
              <User className="w-4 h-4 text-[#8A6870] absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A2630] mb-1.5">
              {t.admin.password}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FFF7FA] border border-[#F8BBD0] rounded-2xl px-4 py-3 pl-10 text-sm text-[#4A2630] outline-none focus:border-[#D81B60]"
              />
              <Lock className="w-4 h-4 text-[#8A6870] absolute left-3.5 top-3.5" />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-[#FFF7FA] p-3 rounded-xl border border-[#F8BBD0]/60 text-[11px] text-[#8A6870]">
            💡 Standart login: <span className="font-mono text-[#D81B60]">admin</span> / parol: <span className="font-mono text-[#D81B60]">zahro2026</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-[#D81B60] hover:bg-[#AD1457] text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Kirilmoqda...' : t.admin.loginBtn}
          </button>
        </form>

        <button
          onClick={onBack}
          className="mt-6 text-xs text-[#8A6870] hover:text-[#D81B60] transition-colors"
        >
          ← Bosh sahifaga qaytish
        </button>
      </div>
    </div>
  );
};

# Zahro SHIRINLIK dunyosi 🎂🌸

Premium, nafis va to‘liq ishlaydigan online shirinlik va bayramona tortlar do‘koni.

---

## 🎨 Dizayn va Xususiyatlar
- **Feminine Luxury Bakery Aesthetic:** Pastel pushti, qaymoqrang, toza oq va raspberry aksentlar.
- **Tipografiya:** *Caveat* (Zahro brendi va qo‘lyozma nafis yozuvlar), *Playfair Display* (sarlavhalar), *Plus Jakarta Sans* (matnlar).
- **Ikki tilli interfeys (UZ | RU):** Butun veb-sayt (mahsulotlar, qidiruv, savatcha, buyurtma, admin panel) bir marta bosishda tilni almashtiradi.
- **E-Commerce to‘liq xarid oqimi:**
  - Jonli qidiruv va kategoriya filtrlari
  - Mahsulot kartasi va tafsilotlar sahifasi (vazni, tarkibi, galereyasi)
  - Savatcha va bepul yetkazib berish progress-bari
  - Buyurtmani rasmiylashtirish (Checkout) & buyurtma raqamini generatsiya qilish (`#ZH-000104`)
  - Buyurtmani holati bo‘yicha kuzatish (Track order)
  - Sevimli mahsulotlar (Wishlist)
  - Ishlaydigan aloqa formasi
- **Admin Panel (`/admin` yoki `/admin/login`):**
  - **Login:** `admin`
  - **Parol:** `zahro2026`
  - Mahsulotlar CRUD (yangi qo‘shish, tahrirlash, o‘chirish)
  - Kategoriyalar CRUD
  - Buyurtmalar holatini yangilash (*Yangi*, *Tasdiqlangan*, *Tayyorlanmoqda*, *Yetkazilmoqda*, *Yetkazildi*, *Bekor qilindi*)
  - Mijozlar xabarlarini o‘qish
  - Do‘kon sozlamalari (yetkazib berish narxlari, telefon, manzillar)
- **Mobil moslashuvchanlik:** Mobil qurilmalar uchun maxsus fixed pastki navigatsiya paneli (Bottom Navigation).

---

## 🚀 Ishga tushirish (Local Development)

```bash
# 1. Bog'liqliklarni o'rnatish
npm install

# 2. Server va frontendni ishga tushirish (Port 3000)
npm run dev

# 3. Brauzerda ochish
http://localhost:3000
```

---

## 📦 GitHub-ga yuklash (Push to GitHub)

Loyihani o‘zingizning GitHub hisobingizga yuklash uchun quyidagi buyruqlarni terminalda bajaring:

```bash
# 1. Git repozitoriyni initsializatsiya qilish
git init
git add .
git commit -m "feat: complete Zahro SHIRINLIK dunyosi ecommerce with full backend"

# 2. GitHub-da yangi repozitoriy oching (masalan, zahro-bakery) va bog'lang
git branch -M main
git remote add origin https://github.com/SIZNING_USERNAME/zahro-bakery.git

# 3. GitHub-ga push qilish
git push -u origin main
```

---

## ⚡ Vercel-ga joylashtirish (Deploy to Vercel)

Loyiha Vercel arxitekturasiga to‘liq tayyorlangan (`vercel.json` va `api/index.ts` serverless handler mavjud).

### 1-usul: GitHub orqali (Eng oson)
1. Kodni GitHub-ga push qiling.
2. [Vercel Dashboard](https://vercel.com/dashboard) ga kiring.
3. **"Add New..."** -> **"Project"** tugmasini bosing.
4. GitHub repozitoriyni tanlang va **Deploy** tugmasini bosing.
5. Vercel loyihani avtomatik quradi va jonli URL manzil taqdim etadi!

### 2-usul: Vercel CLI orqali
```bash
npm install -g vercel
vercel
```

---

## 🛠 Texnologiyalar
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Canvas Confetti
- **Backend:** Node.js, Express, TypeScript REST API
- **Data Persistence:** `data/db.json` (avtomatik seed ma’lumotlari bilan)
- **Deployment:** Vercel / Node.js
